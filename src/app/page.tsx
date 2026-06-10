import Link from "next/link";
import { Search, LogIn } from "lucide-react";
import "./globals.css";

export default function LandingPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "var(--bg-color)", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div className="card" style={{ maxWidth: "600px", width: "100%", textAlign: "center", padding: "3rem 2rem" }}>
        
        <img 
          src="/logo.png" 
          alt="โลโก้บ้านครูอร TUTOR" 
          style={{ width: "160px", height: "160px", objectFit: "contain", marginBottom: "1.5rem" }} 
        />
        
        <h1 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>ยินดีต้อนรับสู่ บ้านครูอร TUTOR</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "3rem", fontSize: "1.125rem" }}>
          ระบบบริหารจัดการบ้านสอนพิเศษที่ทันสมัยที่สุด
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link href="/search" style={{ textDecoration: "none" }}>
            <div className="btn btn-outline" style={{ width: "100%", height: "60px", justifyContent: "flex-start", padding: "0 1.5rem", borderRadius: "16px" }}>
              <Search size={24} style={{ color: "var(--primary)", marginRight: "1rem" }} />
              <div>
                <div style={{ fontWeight: "bold", color: "var(--text-main)" }}>ตรวจสอบข้อมูลนักเรียน</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "left" }}>สำหรับผู้ปกครองและนักเรียน</div>
              </div>
            </div>
          </Link>

          <Link href="/login" style={{ textDecoration: "none" }}>
            <div className="btn" style={{ width: "100%", height: "60px", justifyContent: "flex-start", padding: "0 1.5rem", borderRadius: "16px" }}>
              <LogIn size={24} style={{ marginRight: "1rem" }} />
              <div>
                <div style={{ fontWeight: "bold" }}>เข้าสู่ระบบระบบบริหาร</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", textAlign: "left" }}>สำหรับแอดมินและคุณครู</div>
              </div>
            </div>
          </Link>
        </div>

      </div>
      
      <p style={{ marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        &copy; {new Date().getFullYear()} บ้านครูอร TUTOR. All rights reserved.
      </p>
    </div>
  );
}
