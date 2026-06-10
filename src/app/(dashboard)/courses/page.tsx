"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlusCircle } from "lucide-react";

type Course = {
  id: string;
  course_name: string;
  subject: string;
  price: number;
  total_sessions: number;
};

type Student = { id: string; full_name: string; nickname: string };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [formData, setFormData] = useState({
    course_name: "", subject: "", price: "", total_sessions: ""
  });

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (data) setCourses(data);
  };

  const fetchStudents = async () => {
    const { data } = await supabase.from("students").select("id, full_name, nickname");
    if (data) setStudents(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("courses").insert([{
      ...formData,
      price: Number(formData.price),
      total_sessions: Number(formData.total_sessions)
    }]);
    setFormData({ course_name: "", subject: "", price: "", total_sessions: "" });
    setShowForm(false);
    fetchCourses();
  };

  const handleAddStudentToCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedCourse || !selectedStudent) return;
    await supabase.from("student_courses").insert([{
      course_id: selectedCourse,
      student_id: selectedStudent
    }]);
    alert("ลงทะเบียนนักเรียนสำเร็จ!");
    setSelectedStudent("");
    setSelectedCourse(null);
  };

  return (
    <div>
      <div className="flex-between mb-8">
        <h1>จัดการคอร์สเรียน</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={20} />
          <span className="hidden-mobile">เพิ่มคอร์ส</span>
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h3 className="mb-4">สร้างคอร์สใหม่</h3>
          <form onSubmit={handleSave} className="grid-2">
            <div className="form-group"><label>ชื่อคอร์ส</label><input required className="form-input" value={formData.course_name} onChange={e => setFormData({...formData, course_name: e.target.value})} /></div>
            <div className="form-group"><label>วิชา</label><input required className="form-input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} /></div>
            <div className="form-group"><label>ราคา (บาท)</label><input required type="number" className="form-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
            <div className="form-group"><label>จำนวนครั้งที่สอน</label><input required type="number" className="form-input" value={formData.total_sessions} onChange={e => setFormData({...formData, total_sessions: e.target.value})} /></div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}><button type="submit" className="btn" style={{width: "100%"}}>บันทึกคอร์ส</button></div>
          </form>
        </div>
      )}

      <div className="card mb-8" style={{ border: "2px solid #eff6ff" }}>
        <h3 className="mb-4" style={{ color: "var(--primary)" }}>ลงทะเบียนนักเรียนเข้าคอร์ส</h3>
        <form onSubmit={handleAddStudentToCourse} className="grid-2">
          <div className="form-group">
            <label>เลือกคอร์ส</label>
            <select className="form-input" value={selectedCourse || ""} onChange={e => setSelectedCourse(e.target.value)} required>
              <option value="">-- เลือกคอร์ส --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>เลือกนักเรียน</label>
            <select className="form-input" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
              <option value="">-- เลือกนักเรียน --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.nickname})</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: "1 / -1" }}><button type="submit" className="btn btn-outline" style={{width: "100%"}}>ยืนยันการลงทะเบียน</button></div>
        </form>
      </div>

      <h2 className="mb-4">รายชื่อคอร์สทั้งหมด</h2>
      <div className="grid-2">
        {courses.map(c => (
          <div key={c.id} className="card">
            <div className="flex-between mb-2">
              <span className="badge" style={{ background: "#eff6ff", color: "var(--primary)" }}>{c.subject}</span>
              <span style={{ fontWeight: "bold" }}>฿{c.price}</span>
            </div>
            <h3 style={{ marginBottom: "4px" }}>{c.course_name}</h3>
            <p>รวม {c.total_sessions} ครั้ง</p>
          </div>
        ))}
        {courses.length === 0 && <p className="text-center" style={{ gridColumn: "1 / -1", padding: "2rem" }}>ยังไม่มีข้อมูลคอร์ส</p>}
      </div>
    </div>
  );
}
