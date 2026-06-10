"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

type Course = { id: string; course_name: string; schedule_dates: string[] };
type EnrolledStudent = {
  student_id: string;
  students: { id: string; full_name: string; nickname: string; student_code: string };
};

export default function AttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  
  // วันที่ใช้ในการเช็คชื่อ (เริ่มต้นเป็นวันนี้)
  const [attendanceDate, setAttendanceDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  // ดึงข้อมูลรายชื่อนักเรียนใหม่ทุกครั้งที่มีการเปลี่ยนคอร์ส หรือ เปลี่ยนวันที่
  useEffect(() => {
    if (selectedCourse && attendanceDate) {
      fetchStudentsInCourse(selectedCourse, attendanceDate);
    } else {
      setStudents([]);
    }
  }, [selectedCourse, attendanceDate]);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("id, course_name, schedule_dates");
    if (data) setCourses(data);
  };

  const fetchStudentsInCourse = async (courseId: string, date: Date) => {
    const { data: stdData } = await supabase.from("student_courses")
      .select("student_id, students(id, full_name, nickname, student_code)")
      .eq("course_id", courseId);
    
    const targetDate = format(date, "yyyy-MM-dd");
    const { data: attData } = await supabase.from("attendance")
      .select("student_id, status")
      .eq("course_id", courseId)
      .eq("attendance_date", targetDate);

    if (stdData) setStudents(stdData as any);
    
    const attMap: Record<string, boolean> = {};
    if (attData) {
      attData.forEach(a => attMap[a.student_id] = a.status === 'present');
    }
    setAttendance(attMap);
  };

  const toggleAttendance = async (studentId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const targetDate = format(attendanceDate, "yyyy-MM-dd");
    
    setAttendance(prev => ({ ...prev, [studentId]: newStatus }));

    await supabase.from("attendance").upsert({
      student_id: studentId,
      course_id: selectedCourse,
      attendance_date: targetDate,
      status: newStatus ? 'present' : 'absent'
    }, { onConflict: 'student_id, course_id, attendance_date' });
  };

  // กรองคอร์สเพื่อหาว่ามีวันที่เราเลือกอยู่ในตารางเรียนหรือไม่ (ใช้สำหรับไฮไลต์/เตือน)
  const selectedCourseObj = courses.find(c => c.id === selectedCourse);
  const targetDateStr = format(attendanceDate, "yyyy-MM-dd");
  const isScheduledDate = selectedCourseObj?.schedule_dates?.includes(targetDateStr);

  return (
    <div>
      <h1 className="mb-8">เช็คชื่อนักเรียน</h1>

      <div className="card mb-8">
        <div className="grid-2">
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>1. เลือกวันที่ต้องการเช็คชื่อ</label>
            <button 
              className="form-input" 
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "#fff", cursor: "pointer" }}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <span>{format(attendanceDate, "dd MMMM yyyy", { locale: th })}</span>
              <CalendarIcon size={20} color="var(--primary)" />
            </button>
            
            {showCalendar && (
              <div style={{ position: "absolute", zIndex: 10, background: "white", padding: "1rem", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", marginTop: "0.5rem" }}>
                <DayPicker
                  mode="single"
                  selected={attendanceDate}
                  onSelect={(date) => {
                    if (date) setAttendanceDate(date);
                    setShowCalendar(false);
                  }}
                  locale={th}
                />
              </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>2. เลือกคอร์สเรียน</label>
            <select className="form-input" style={{ width: "100%" }} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              <option value="">-- แตะเพื่อเลือกคอร์ส --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
            </select>
          </div>
        </div>

        {selectedCourse && selectedCourseObj?.schedule_dates && !isScheduledDate && (
           <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#fef3c7", color: "#b45309", borderRadius: "8px", fontSize: "0.875rem" }}>
             ⚠️ วันที่เลือกว่าจะเช็คชื่อ ({format(attendanceDate, "dd MMM", { locale: th })}) ไม่ตรงกับวันที่ระบุในตารางเรียนของคอร์สนี้
           </div>
        )}
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
