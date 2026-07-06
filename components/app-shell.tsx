"use client";

import {
  Activity,
  BarChart3,
  Bell,
  BicepsFlexed,
  BookOpen,
  CalendarRange,
  ChevronDown,
  Dumbbell,
  Gauge,
  House,
  Medal,
  Menu,
  Moon,
  Ruler,
  Settings,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Brand } from "@/components/brand";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Today’s workout", href: "/workout/today", icon: Dumbbell },
  { label: "Workout plan", href: "/plan", icon: CalendarRange },
  { label: "Exercise library", href: "/exercises", icon: BookOpen },
  { label: "Progress", href: "/progress", icon: BarChart3 },
  { label: "Body tracking", href: "/body", icon: Ruler },
  { label: "Personal records", href: "/records", icon: Medal },
  { label: "Settings", href: "/settings", icon: Settings },
];

const mobileNavigation = [
  { label: "Home", href: "/dashboard", icon: House },
  { label: "Workout", href: "/workout/today", icon: BicepsFlexed },
  { label: "Plan", href: "/plan", icon: CalendarRange },
  { label: "Progress", href: "/progress", icon: Activity },
  { label: "Profile", href: "/settings", icon: UserRound },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("repforge-theme") === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("repforge-theme", nextTheme);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Brand />
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          <span className="side-label">TRAINING</span>
          {navigation.slice(0, 4).map((item) => (
            <Link
              className={`side-link ${isCurrent(pathname, item.href) ? "active" : ""}`}
              href={item.href}
              key={item.href}
            >
              <item.icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
              {item.href === "/workout/today" && (
                <span className="live-dot" title="Today’s workout ready" />
              )}
            </Link>
          ))}
          <span className="side-label side-label-spaced">INSIGHTS</span>
          {navigation.slice(4).map((item) => (
            <Link
              className={`side-link ${isCurrent(pathname, item.href) ? "active" : ""}`}
              href={item.href}
              key={item.href}
            >
              <item.icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-block">
          <div className="block-top">
            <span>TRAINING BLOCK</span>
            <strong>WEEK 4 / 6</strong>
          </div>
          <div className="mini-progress">
            <span style={{ width: "66%" }} />
          </div>
          <p>Hypertrophy base</p>
        </div>
        <Link className="sidebar-user" href="/settings">
          <span className="avatar">AK</span>
          <span>
            <strong>Akshay</strong>
            <small>Lean mass · 63 kg</small>
          </span>
          <ChevronDown size={15} />
        </Link>
      </aside>

      <header className="mobile-header">
        <Brand />
        <div className="mobile-header-actions">
          <button className="icon-button" aria-label="Notifications">
            <Bell size={18} />
            <span className="notification-dot" />
          </button>
          <button
            className="icon-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="app-column">
        <header className="topbar">
          <div>
            <p className="eyebrow">MONDAY · 06 JUL</p>
            <strong>Make today count.</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <div className="topbar-divider" />
            <div className="topbar-user">
              <span className="avatar">AK</span>
              <span>
                <strong>Akshay</strong>
                <small>Intermediate</small>
              </span>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <motion.main
          className="app-main"
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {children}
        </motion.main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {mobileNavigation.map((item) => (
          <Link
            className={isCurrent(pathname, item.href) ? "active" : ""}
            href={item.href}
            key={item.href}
          >
            <item.icon size={20} strokeWidth={1.9} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              className="drawer-backdrop"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="drawer-header">
                <Brand />
                <button
                  className="icon-button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav>
                {navigation.map((item) => (
                  <Link
                    className={isCurrent(pathname, item.href) ? "active" : ""}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    key={item.href}
                  >
                    <item.icon size={19} />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <button className="button button-secondary" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
