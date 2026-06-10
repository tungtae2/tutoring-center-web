"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { exportToExcel } from "@/lib/exportExcel";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);

  const exportStudents = async () => {
    setLoading(true);
    const { data } = await supabase.from("students").select("student_code, full_name, nickname, grade, school, parent_phone, note");
    if (data) {
      exportToExcel(data, "students_report");
    }
    setLoading(false);
  };

  const exportAttendance = async () => {
    setLoading(true);
    const { data } = await supabase.from("attendance")
      .select("attendance_date, status, students(student_code, full_name), courses(course_name)");
    
    if (data) {
      const formatted = data.map(d => ({
        วันที่: d.attendance_date,
        คอร์ส: (d as any).courses.course_name,
        รหัสนักเรียน: (d as any).students.student_code,
        ชื่อนักเรียน: (d as any).students.full_name,
        สถานะ: d.status === 'present' ? 'มาเรียน' : 'ขาดเรียน'
      }));
      exportToExcel(formatted, "attendance_report");
    }
    setLoading(false);
  };

  const exportPayments = async () => {
    setLoading(true);
    const { data } = await supabase.from("payments")
      .select("paid, paid_date, students(student_code, full_name), courses(course_name)");
    
    if (data) {
      const formatted = data.map(d => ({
        คอร์ส: (d as any).courses.course_name,
        รหัสนักเรียน: (d as any).students.student_code,
        ชื่อนักเรียน: (d as any).students.full_name,
        สถานะ: d.paid ? 'ชำระแล้ว' : 'ค้างชำระ',
        วันที่ชำระ: d.paid_date ? new Date(d.paid_date).toLocaleString('th-TH') : '-'
      }));
      exportToExcel(formatted, "payments_report");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="mb-8">รายงานและการส่งออก</h1>

      <div className="grid-3">
        <div className="card text-center" style={{ padding: "2rem" }}>
          <h3 className="mb-4">รายชื่อนักเรียนทั้งหมด</h3>
          <p className="mb-8">ส่งออกข้อมูลนักเรียนทั้งหมดในระบบ รวมถึงเบอร์ติดต่อผู้ปกครอง</p>
          <button className="btn btn-outline" style={{ width: "100%" }} onClick={exportStudents} disabled={loading}>
            <Download size={20} /> ส่งออก Excel
          </button>
        </div>

        <div className="card text-center" style={{ padding: "2rem" }}>
          <h3 className="mb-4">ประวัติการเข้าเรียน</h3>
          <p className="mb-8">ส่งออกประวัติการเข้าเรียนของทุกคอร์ส แยกตามวันและสถานะ</p>
          <button className="btn btn-outline" style={{ width: "100%" }} onClick={exportAttendance} disabled={loading}>
            <Download size={20} /> ส่งออก Excel
          </button>
        </div>

        <div className="card text-center" style={{ padding: "2rem" }}>
          <h3 className="mb-4">สรุปการชำระเงิน</h3>
          <p className="mb-8">ส่งออกข้อมูลการชำระเงินของนักเรียนในแต่ละคอร์ส</p>
          <button className="btn btn-outline" style={{ width: "100%" }} onClick={exportPayments} disabled={loading}>
            <Download size={20} /> ส่งออก Excel
          </button>
        </div>
      </div>
    </div>
  );
}
