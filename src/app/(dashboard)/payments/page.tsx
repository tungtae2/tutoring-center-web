"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Course = { id: string; course_name: string };
type PaymentRecord = {
  id: string;
  student_id: string;
  paid: boolean;
  students: { full_name: string; nickname: string; student_code: string };
};

export default function PaymentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("id, course_name");
    if (data) setCourses(data);
  };

  const fetchPayments = async (courseId: string) => {
    setSelectedCourse(courseId);
    if (!courseId) {
      setPayments([]);
      return;
    }
    const { data } = await supabase.from("payments")
      .select("id, student_id, paid, students(full_name, nickname, student_code)")
      .eq("course_id", courseId);
    if (data) setPayments(data as any);
  };

  const togglePayment = async (paymentId: string, currentPaid: boolean) => {
    const newPaid = !currentPaid;
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, paid: newPaid } : p));
    await supabase.from("payments").update({
      paid: newPaid,
      paid_date: newPaid ? new Date().toISOString() : null
    }).eq("id", paymentId);
  };

  return (
    <div>
      <h1 className="mb-8">ชำระเงิน</h1>

      <div className="card mb-8">
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>เลือกคอร์ส</label>
        <select className="form-input" style={{ width: "100%", maxWidth: "400px" }} value={selectedCourse} onChange={e => fetchPayments(e.target.value)}>
          <option value="">-- แตะเพื่อเลือกคอร์ส --</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
        </select>
      </div>

      {selectedCourse && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {payments.map(p => (
            <div key={p.id} className="list-item">
              <div className="list-info">
                <h4>{p.students.full_name}</h4>
                <p>{p.students.student_code}</p>
              </div>
              <div>
                <button 
                  onClick={() => togglePayment(p.id, p.paid)}
                  className={`toggle-btn ${p.paid ? "toggle-on" : "toggle-off"}`}
                  style={{ width: "120px" }}
                >
                  {p.paid ? "ชำระแล้ว" : "ค้างชำระ"}
                </button>
              </div>
            </div>
          ))}
          {payments.length === 0 && <p className="text-center" style={{ padding: "2rem" }}>ไม่มีรายชื่อนักเรียนในคอร์สนี้</p>}
        </div>
      )}
    </div>
  );
}
