import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow | Kanban & Team Workload",
  description: "Modern engineering task management with real-time workload balancing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans text-neutral-900 bg-neutral-50/40">
        {children}
      </body>
    </html>
  );
}
