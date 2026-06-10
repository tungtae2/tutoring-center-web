import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, CheckSquare, CreditCard, MoreHorizontal } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: "หน้าแรก", path: "/dashboard", icon: <Home size={24} /> },
    { name: "นักเรียน", path: "/students", icon: <Users size={24} /> },
    { name: "เช็คชื่อ", path: "/attendance", icon: <CheckSquare size={24} /> },
    { name: "ชำระเงิน", path: "/payments", icon: <CreditCard size={24} /> },
    { name: "เพิ่มเติม", path: "/settings", icon: <MoreHorizontal size={24} /> },
  ];

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-content">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`mobile-nav-item ${pathname === item.path || (item.path === '/settings' && (pathname === '/courses' || pathname === '/reports')) ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
