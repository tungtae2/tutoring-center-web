"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import "@/app/globals.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setNotFound(false);
    setStudent(null);

    const { data } = await supabase.from("students")
      .select(`
        id, full_name, nickname, grade, student_code,
        student_courses (
          course_id, courses (course_name, total_sessions)
        ),
        attendance (id, status),
        payments (course_id, paid)
      `)
      .or(`full_name.ilike.%${query}%,student_code.eq.${query}`)
      .limit(1);

    if (data && data.length > 0) {
      setStudent(data[0]);
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
          <form onSubmit={handleSearch} className="flex-between gap-4">
            <input 
              className="form-input" 
              placeholder="รหัสนักเรียน หรือ ชื่อ-นามสกุล..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn" disabled={loading}>
              <Search size={20} />
            </button>
          </form>
        </div>

        {notFound && (
          <div className="card text-center" style={{ color: "var(--danger)" }}>
            ไม่พบข้อมูลนักเรียน กรุณาตรวจสอบรหัสหรือชื่ออีกครั้ง
          </div>
        )}

        {student && (
          <div className="card">
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
                  const attends = student.attendance?.filter((a: any) => a.status === 'present').length || 0;
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
                          <div style={{ width: `${(attends/total)*100}%`, height: "100%", background: "var(--primary)" }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
