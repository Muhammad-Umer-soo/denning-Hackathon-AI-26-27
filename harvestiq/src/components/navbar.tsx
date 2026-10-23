"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  FlaskConical,
  BarChart3,
  HandCoins,
  PhoneCall,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", labelUr: "ڈیش بورڈ", icon: LayoutDashboard },
  { href: "/crops", label: "Crops", labelUr: "فصلیں", icon: Sprout },
  { href: "/prices", label: "Prices", labelUr: "قیمتیں", icon: TrendingUp },
  { href: "/soil", label: "Soil AI", labelUr: "مٹی تجزیہ", icon: FlaskConical },
  { href: "/planner", label: "Planner", labelUr: "منصوبہ ساز", icon: BarChart3 },
  { href: "/schemes", label: "Schemes", labelUr: "سکیمیں", icon: HandCoins },
  { href: "/support", label: "Support", labelUr: "مدد", icon: PhoneCall },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🌾</span>
          <div>
            <span className="font-bold text-lg text-emerald-700 leading-none block">HarvestIQ</span>
            <span className="text-xs text-slate-500 leading-none">AgriWise · Punjab Pilot</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                <span className="ml-auto text-slate-400 text-xs">{item.labelUr}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
