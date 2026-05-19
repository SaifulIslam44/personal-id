// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import styles from "./tabs.module.css";
// import { Gift, ListChecks, Users, Info, BarChart3 } from "lucide-react";

// export default function ProfileLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const tabs = [
//     { label: "Rewards", path: "/profile/checkin", icon: Gift },
//     { label: "Task", path: "/profile/checkin/tasks", icon: ListChecks },
//     { label: "Score", path: "/profile/checkin/score", icon: BarChart3 },
//     { label: "Frens", path: "/profile/checkin/frens", icon: Users },
//     { label: "Info", path: "/profile/checkin/info", icon: Info },
//   ];

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.content}>{children}</div>

//       <nav className={styles.bottomNav}>
//         {tabs.map((t) => {
//           const Icon = t.icon;
//           const active = pathname === t.path;

//           return (
//             <button
//               key={t.path}
//               className={`${styles.tabBtn} ${active ? styles.active : ""}`}
//               onClick={() => router.push(t.path)}
//             >
//               <Icon size={22} />
//               <span>{t.label}</span>
//               {active && <i className={styles.dot} />}
//             </button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }












"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./tabs.module.css";
import { Gift, ListChecks, Trophy, IdCard, ArrowUpDown, BarChart3 } from "lucide-react";
import Image from "next/image";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { label: "Rewards", path: "/profile/checkin", icon: Gift },
    { label: "Task", path: "/profile/checkin/tasks", icon: ListChecks },
    { label: "Menus", path: "MENU_TRIGGER", icon: null },
    // { label: "Score", path: "/profile/checkin/score", icon: BarChart3 },
    // { label: "Frens", path: "/profile/checkin/frens", icon: Users },
    { label: "Swap & Earn", path: "/profile/checkin/swap", icon: ArrowUpDown },
    // { label: "Info", path: "/profile/checkin/info", icon: Info },
    // { label: "Info", path: "#", icon: Info, disabled: true },
    { label: "Mint ID", path: "/profile", icon: IdCard },
  ];

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>{children}</div>

      {/* --- 🌟 ARC / FAN MENU OVERLAY --- */}
      {isMenuOpen && (
        <>
          {/* Background Overlay */}
          <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
          
          {/* Fan Menu Container */}
          <div className={styles.fanMenuContainer}>
            
            {/* 1. LEFT ITEM: Leaderboard */}
            <div 
              className={`${styles.fanItem} ${styles.posLeft}`} 
              onClick={() => handleNavigation("/profile/checkin/leaderboard")}
            >
              <div className={styles.fanCircle}>
                <Trophy size={20} color="#ffd700" />
              </div>
              <span className={styles.fanLabel}>Leaderboard</span>
            </div>

            {/* 2. CENTER ITEM: Score */}
            <div 
              className={`${styles.fanItem} ${styles.posCenter}`}
              onClick={() => handleNavigation("/profile/checkin/score")}
            >
              {/* <div className={`${styles.fanCircle} ${styles.centerCircleStyle}`}> */}
              <div className={styles.fanCircle}>
                <BarChart3 size={20} color="#4da3ff" />
              </div>
              <span className={styles.fanLabel}>Score</span>
            </div>

            {/* 3. RIGHT ITEM: Badges (Coming Soon) */}
           <div 
  className={`${styles.fanItem} ${styles.posRight}`} 
  onClick={() => handleNavigation("/profile/checkin/giveaway")}
>
  <div className={styles.fanCircle}>
    <Gift size={20} color="#ff4d4d" /> {/* লাল বা আপনার পছন্দের কালার দিতে পারেন */}
  </div>
  <span className={styles.fanLabel}>Airdrop</span>
</div>

          </div>
        </>
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className={styles.bottomNav}>
        {tabs.map((t) => {
          const active = pathname === t.path;

          if (t.label === "Menus") {
            return (
              <button
                key={t.label}
                className={`${styles.centerFloatingBtn} ${isMenuOpen ? styles.menuOpenState : ""}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className={styles.logoContainer}>
                  <Image 
                    src="/layoutlogo.png" 
                    alt="Menu" 
                    width={32} 
                    height={32} 
                    className={styles.logoImage}
                    unoptimized
                  />
                </div>
              </button>
            );
          }

          const Icon = t.icon!;
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