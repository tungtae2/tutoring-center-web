import { supabase } from "@/lib/supabase";
import { Users, BookOpen, CreditCard, AlertCircle } from "lucide-react";

export default async function Dashboard() {
  // Fetch overview data
  const { count: studentCount } = await supabase.from("students").select("*", { count: "exact", head: true });
  const { count: courseCount } = await supabase.from("courses").select("*", { count: "exact", head: true });
  const { count: paidCount } = await supabase.from("payments").select("*", { count: "exact", head: true }).eq('paid', true);
  const { count: unpaidCount } = await supabase.from("payments").select("*", { count: "exact", head: true }).eq('paid', false);

  return (
    <div>
      <h1 className="mb-8">แดชบอร์ด</h1>
      
      <div className="grid-2">
        <div className="card flex-between">
          <div>
            <p className="mb-4">นักเรียนทั้งหมด</p>
            <h2 style={{ fontSize: "2rem" }}>{studentCount || 0}</h2>
          </div>
          <div style={{ padding: "1rem", background: "#eff6ff", borderRadius: "var(--radius-lg)", color: "var(--primary)" }}>
            <Users size={32} />
          </div>
        </div>

        <div className="card flex-between">
          <div>
            <p className="mb-4">คอร์สทั้งหมด</p>
            <h2 style={{ fontSize: "2rem" }}>{courseCount || 0}</h2>
          </div>
          <div style={{ padding: "1rem", background: "#f3f4f6", borderRadius: "var(--radius-lg)", color: "var(--text-muted)" }}>
            <BookOpen size={32} />
          </div>
        </div>

        <div className="card flex-between" style={{ border: "1px solid var(--success-bg)" }}>
          <div>
            <p className="mb-4">ชำระแล้ว</p>
            <h2 style={{ fontSize: "2rem", color: "var(--success)" }}>{paidCount || 0}</h2>
          </div>
          <div style={{ padding: "1rem", background: "var(--success-bg)", borderRadius: "var(--radius-lg)", color: "var(--success)" }}>
            <CreditCard size={32} />
          </div>
        </div>

        <div className="card flex-between" style={{ border: "1px solid var(--danger-bg)" }}>
          <div>
            <p className="mb-4">ค้างชำระ</p>
            <h2 style={{ fontSize: "2rem", color: "var(--danger)" }}>{unpaidCount || 0}</h2>
          </div>
          <div style={{ padding: "1rem", background: "var(--danger-bg)", borderRadius: "var(--radius-lg)", color: "var(--danger)" }}>
            <AlertCircle size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}
