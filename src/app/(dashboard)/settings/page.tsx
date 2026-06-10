"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div>
      <h1 className="mb-8">ตั้งค่าบัญชี</h1>

      <div className="card mb-8">
        <div className="flex-between" style={{ alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "32px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                <User size={32} />
              </div>
              <div>
                <h3>{user?.email}</h3>
                <p className="badge" style={{ background: "#f3f4f6", color: "var(--text-muted)", marginTop: "4px" }}>
                  ผู้ดูแลระบบ (Admin)
                </p>
              </div>
            </div>
          </div>
          
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={20} /> ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
