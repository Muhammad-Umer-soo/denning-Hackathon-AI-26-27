"use client";

import { MANDI_PRICES, PRICE_HISTORY, PILOT_CROPS } from "@/lib/data";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const CROP_COLORS: Record<string, string> = {
  wheat: "#f59e0b",
  cotton: "#10b981",
  maize: "#f97316",
  rice: "#8b5cf6",
};

export default function PricesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">📈 Mandi Price Intelligence</h1>
        <p className="text-slate-500 mt-1">Punjab mandi prices with full provenance · PKR per 40kg (Maund)</p>
        <p className="text-slate-400 text-sm urdu mt-0.5">منڈی قیمتیں · پنجاب</p>
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MANDI_PRICES.map((item) => {
          const crop = PILOT_CROPS.find((c) => c.nameEn === item.crop || c.nameEn === "Basmati Rice" && item.crop === "Basmati Rice");
          return (
            <div key={item.crop} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-800">{item.crop}</p>
                  <p className="text-xs text-slate-400 urdu">{item.nameUr}</p>
                </div>
                <span className={`flex items-center gap-0.5 text-sm font-medium ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {item.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(item.change)}%
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900">₨{item.price.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.unit}</p>
              <ProvenanceBadge source={item.source} unit={item.unit} asOf={item.asOf} status={item.status} />
            </div>
          );
        })}
      </div>

      {/* Price Trend Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-1">6-Month Price Trends</h2>
        <p className="text-sm text-slate-500 mb-4">May – Oct 2026 · PKR per 40kg (Maund)</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={PRICE_HISTORY} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₨${(v / 1000).toFixed(1)}k`} />
            <Tooltip formatter={(v: any) => [`₨${Number(v).toLocaleString()}`, ""]} />
            <Legend />
            <Line type="monotone" dataKey="wheat" name="Wheat" stroke={CROP_COLORS.wheat} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="cotton" name="Cotton" stroke={CROP_COLORS.cotton} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="maize" name="Maize" stroke={CROP_COLORS.maize} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="rice" name="Basmati Rice" stroke={CROP_COLORS.rice} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <ProvenanceBadge source="Punjab AMIS (Sample Benchmark)" unit="PKR / 40kg" asOf="May–Oct 2026" status="sample" />
      </div>
    </div>
  );
}
