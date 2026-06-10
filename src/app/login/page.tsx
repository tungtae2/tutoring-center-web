"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "var(--bg-color)" }}>
      <div className="card" style={{ width: "400px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img 
          src="/logo.png" 
          alt="โลโก้บ้านครูอร TUTOR" 
          style={{ width: "120px", height: "120px", objectFit: "contain", marginBottom: "1rem" }} 
        />
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>เข้าสู่ระบบ</h2>
        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>อีเมล</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem" }}>
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
