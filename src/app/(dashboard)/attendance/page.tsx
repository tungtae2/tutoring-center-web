"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Course = { id: string; course_name: string };
type EnrolledStudent = {
  student_id: string;
  students: { id: string; full_name: string; nickname: string; student_code: string };
};

export default function AttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("id, course_name");
    if (data) setCourses(data);
  };

  const fetchStudentsInCourse = async (courseId: string) => {
    setSelectedCourse(courseId);
    if (!courseId) {
      setStudents([]);
      return;
    }
    const { data: stdData } = await supabase.from("student_courses")
      .select("student_id, students(id, full_name, nickname, student_code)")
      .eq("course_id", courseId);
    
    const today = new Date().toISOString().split('T')[0];
    const { data: attData } = await supabase.from("attendance")
      .select("student_id, status")
      .eq("course_id", courseId)
      .eq("attendance_date", today);

    if (stdData) setStudents(stdData as any);
    
    const attMap: Record<string, boolean> = {};
    if (attData) {
      attData.forEach(a => attMap[a.student_id] = a.status === 'present');
    }
    setAttendance(attMap);
  };

  const toggleAttendance = async (studentId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const today = new Date().toISOString().split('T')[0];
    
    // Optimistic UI for instant feedback (Speed is priority)
    setAttendance(prev => ({ ...prev, [studentId]: newStatus }));

    await supabase.from("attendance").upsert({
      student_id: studentId,
      course_id: selectedCourse,
      attendance_date: today,
      status: newStatus ? 'present' : 'absent'
    }, { onConflict: 'student_id, course_id, attendance_date' });
  };

  return (
    <div>
      <h1 className="mb-8">เช็คชื่อเข้าเรียน</h1>

      <div className="card mb-8">
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>เลือกคอร์สเพื่อเช็คชื่อ (สำหรับวันนี้)</label>
        <select className="form-input" style={{ width: "100%", maxWidth: "400px" }} value={selectedCourse} onChange={e => fetchStudentsInCourse(e.target.value)}>
          <option value="">-- แตะเพื่อเลือกคอร์ส --</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
        </select>
      </div>

      {selectedCourse && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {students.map(s => {
            const isPresent = attendance[s.student_id] || false;
            return (
              <div key={s.student_id} className="list-item">
                <div className="list-info">
                  <h4>{s.students.full_name} ({s.students.nickname})</h4>
                  <p>{s.students.student_code}</p>
                </div>
                <div>
                  <button 
                    onClick={() => toggleAttendance(s.student_id, isPresent)}
                    className={`toggle-btn ${isPresent ? "toggle-on" : "toggle-off"}`}
                    style={{ width: "100px" }}
                  >
                    {isPresent ? "มาเรียน" : "ขาด"}
                  </button>
                </div>
              </div>
            );
          })}
          {students.length === 0 && <p className="text-center" style={{ padding: "2rem" }}>ไม่มีรายชื่อนักเรียนในคอร์สนี้</p>}
        </div>
      )}
    </div>
  );
}
