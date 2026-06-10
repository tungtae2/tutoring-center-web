"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Trash2 } from "lucide-react";

type Student = {
  id: string;
  student_code: string;
  full_name: string;
  nickname: string;
  grade: string;
  parent_phone: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "", nickname: "", grade: "", school: "", parent_phone: "", note: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    if (data) setStudents(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("students").insert([formData]);
    setFormData({ full_name: "", nickname: "", grade: "", school: "", parent_phone: "", note: "" });
    setShowForm(false);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    if(confirm("ยืนยันการลบนักเรียน?")) {
      await supabase.from("students").delete().eq("id", id);
      fetchStudents();
    }
  };

  return (
    <div>
      <div className="flex-between mb-8">
        <h1>รายชื่อนักเรียน</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          <UserPlus size={20} />
          <span className="hidden-mobile">เพิ่มนักเรียน</span>
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h3 className="mb-4">ข้อมูลนักเรียนใหม่</h3>
          <form onSubmit={handleSave} className="grid-2">
            <div className="form-group"><label>ชื่อ-นามสกุล</label><input required className="form-input" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} /></div>
            <div className="form-group"><label>ชื่อเล่น</label><input className="form-input" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} /></div>
            <div className="form-group"><label>ระดับชั้น</label><input required className="form-input" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} /></div>
            <div className="form-group"><label>เบอร์ผู้ปกครอง</label><input className="form-input" value={formData.parent_phone} onChange={e => setFormData({...formData, parent_phone: e.target.value})} /></div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className="btn" style={{width: "100%"}}>บันทึกข้อมูล</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2">
        {students.map(s => (
          <div key={s.id} className="card">
            <div className="flex-between mb-4">
              <span className="badge" style={{ background: "#f3f4f6", color: "var(--text-muted)" }}>{s.student_code}</span>
              <button onClick={() => handleDelete(s.id)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "8px" }}>
                <Trash2 size={20} />
              </button>
            </div>
            <h3 style={{ marginBottom: "4px" }}>{s.full_name} ({s.nickname})</h3>
            <p>ชั้น {s.grade} • โทร {s.parent_phone}</p>
          </div>
        ))}
        {students.length === 0 && <p className="text-center" style={{ gridColumn: "1 / -1", padding: "2rem" }}>ยังไม่มีข้อมูลนักเรียน</p>}
      </div>
    </div>
  );
}
