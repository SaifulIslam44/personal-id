"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./tabs.module.css";
import { Gift, ListChecks, Users, Info } from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { label: "Rewards", path: "/profile/checkin", icon: Gift },
    { label: "Task", path: "/profile/checkin/tasks", icon: ListChecks },
    { label: "Frens", path: "/profile/checkin/frens", icon: Users },
    { label: "Info", path: "/profile/checkin/info", icon: Info },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>{children}</div>

      <nav className={styles.bottomNav}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = pathname === t.path;

          return (
            <button
              key={t.path}
              className={`${styles.tabBtn} ${active ? styles.active : ""}`}
              onClick={() => router.push(t.path)}
            >
              <Icon size={22} />
              <span>{t.label}</span>
              {active && <i className={styles.dot} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
