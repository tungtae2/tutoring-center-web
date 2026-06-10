"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import "@/app/globals.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query && !grade) return;
    
    setLoading(true);
    setNotFound(false);
    setStudents([]);

    let queryBuilder = supabase.from("students")
      .select(`
        id, full_name, nickname, grade, student_code,
        student_courses (
          course_id, courses (course_name, total_sessions)
        ),
        attendance (id, status),
        payments (course_id, paid)
      `);

    // ถ้ามีการระบุระดับชั้น ให้กรองระดับชั้นด้วย
    if (grade) {
      queryBuilder = queryBuilder.ilike('grade', `%${grade}%`);
    }

    // ถ้ามีการพิมพ์คำค้นหา ให้หาจากชื่อจริง, ชื่อเล่น หรือ รหัส
    if (query) {
      queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,nickname.ilike.%${query}%,student_code.eq.${query}`);
    }

    const { data } = await queryBuilder;

    if (data && data.length > 0) {
      setStudents(data);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)", padding: "2rem" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 className="text-center" style={{ color: "var(--primary)", marginBottom: "2rem" }}>
          ตรวจสอบข้อมูลผู้เรียน
        </h1>
        
        <div className="card mb-8">
          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="grid-2">
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "bold" }}>ชื่อเล่น, ชื่อจริง หรือ รหัสนักเรียน</label>
                <input 
                  className="form-input" 
                  placeholder="เช่น น้องพลอย, 001" 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "bold" }}>ระดับชั้น (ไม่บังคับ)</label>
                <input 
                  className="form-input" 
                  placeholder="เช่น ม.1, ป.6" 
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            
            <button type="submit" className="btn" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              <Search size={20} style={{ marginRight: "0.5rem" }} />
              ค้นหาข้อมูล
            </button>
          </form>
        </div>

        {notFound && (
          <div className="card text-center" style={{ color: "var(--danger)" }}>
            ไม่พบข้อมูลนักเรียน กรุณาตรวจสอบข้อมูลอีกครั้ง
          </div>
        )}

        {students.map((student) => (
          <div key={student.id} className="card mb-4">
            <div className="flex-between mb-4">
              <span className="badge" style={{ background: "#eff6ff", color: "var(--primary)" }}>{student.student_code}</span>
              <span style={{ fontWeight: "bold" }}>ชั้น {student.grade}</span>
            </div>
            
            <h2 className="mb-8">{student.full_name} ({student.nickname})</h2>

            <h3 className="mb-4">ประวัติการเรียนและการชำระเงิน</h3>
            {student.student_courses.length === 0 ? (
              <p className="text-center" style={{ padding: "1rem" }}>ยังไม่ได้ลงทะเบียนเรียนคอร์สใดๆ</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {student.student_courses.map((sc: any) => {
                  const attends = student.attendance?.filter((a: any) => a.status === 'present' && a.course_id === sc.course_id).length || 0;
                  const total = sc.courses?.total_sessions || 0;
                  const payment = student.payments?.find((p: any) => p.course_id === sc.course_id);
                  const isPaid = payment ? payment.paid : false;

                  return (
                    <div key={sc.course_id} style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                      <div className="flex-between mb-2">
                        <h4 style={{ fontSize: "1rem" }}>{sc.courses?.course_name}</h4>
                        <span className={`badge ${isPaid ? 'badge-success' : 'badge-danger'}`}>
                          {isPaid ? "ชำระแล้ว" : "ค้างชำระ"}
                        </span>
                      </div>
                      <div className="flex-between">
                        <p style={{ fontSize: "0.875rem" }}>เข้าเรียน: {attends} / {total} ครั้ง</p>
                        {/* Simple progress bar */}
                        <div style={{ width: "100px", height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${total > 0 ? (attends/total)*100 : 0}%`, height: "100%", background: "var(--primary)" }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
