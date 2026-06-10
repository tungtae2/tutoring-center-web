import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "บ้านครูอร TUTOR",
  description: "ระบบบริหารบ้านสอนพิเศษ",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "บ้านครูอร TUTOR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

