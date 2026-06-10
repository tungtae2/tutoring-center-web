import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, CheckSquare, CreditCard, BarChart2, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "แดชบอร์ด", path: "/dashboard", icon: <Home size={20} /> },
    { name: "นักเรียน", path: "/students", icon: <Users size={20} /> },
    { name: "คอร์สเรียน", path: "/courses", icon: <BookOpen size={20} /> },
    { name: "เช็คชื่อ", path: "/attendance", icon: <CheckSquare size={20} /> },
    { name: "ชำระเงิน", path: "/payments", icon: <CreditCard size={20} /> },
    { name: "รายงาน", path: "/reports", icon: <BarChart2 size={20} /> },
    { name: "ตั้งค่า", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>บ้านสอนพิเศษ</h2>
        <p style={{ marginTop: "4px" }}>ระบบบริหารจัดการ</p>
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`nav-item ${pathname === item.path ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      {/* Moved logout to Settings page to keep sidebar clean */}
    </div>
  );
}
