"use client";

import { useState } from "react";
import { PILOT_CROPS } from "@/lib/data";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

export default function PlannerPage() {
  const [selected, setSelected] = useState<string[]>(["wheat", "cotton"]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  }

  const crops = PILOT_CROPS.filter((c) => selected.includes(c.id));

  const chartData = [
    { name: "Cost/Acre (₨k)", ...Object.fromEntries(crops.map((c) => [c.nameEn, Math.round(c.costPerAcre / 1000)])) },
    { name: "Revenue/Acre (₨k)", ...Object.fromEntries(crops.map((c) => [c.nameEn, Math.round(c.revenuePerAcre / 1000)])) },
    { name: "Net/Acre (₨k)", ...Object.fromEntries(crops.map((c) => [c.nameEn, Math.round((c.revenuePerAcre - c.costPerAcre) / 1000)])) },
  ];

  const COLORS = ["#f59e0b", "#10b981", "#f97316", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">📊 Planner — Crop Comparison</h1>
        <p className="text-slate-500 mt-1">Compare costs, revenue &amp; indicators across pilot crops</p>
        <p className="text-slate-400 text-sm urdu mt-0.5">فصل موازنہ · منصوبہ ساز</p>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
        <p><strong>Estimates only.</strong> Cost and revenue figures are benchmark assumptions — not guaranteed values. Actual results depend on soil, weather, inputs, and market conditions.</p>
      </div>

      {/* Crop Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-700 mb-3">Select crops to compare (up to 4):</p>
        <div className="flex flex-wrap gap-2">
          {PILOT_CROPS.map((crop) => (
            <button
              key={crop.id}
              onClick={() => toggle(crop.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selected.includes(crop.id)
                  ? `${crop.accentBg} text-white border-transparent`
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {crop.icon} {crop.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {crops.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-slate-500 font-medium">Metric</th>
                {crops.map((c) => (
                  <th key={c.id} className="text-right px-5 py-3 text-slate-700 font-semibold">
                    {c.icon} {c.nameEn}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { label: "Season", key: "season" as const },
                { label: "Price / Maund", key: "pricePerMaund" as const, format: (v: string | number) => `₨${Number(v).toLocaleString()}` },
                { label: "Yield / Acre", key: "yieldPerAcre" as const },
                { label: "Cost / Acre", key: "costPerAcre" as const, format: (v: string | number) => `₨${Number(v).toLocaleString()}` },
                { label: "Revenue / Acre*", key: "revenuePerAcre" as const, format: (v: string | number) => `₨${Number(v).toLocaleString()}` },
                { label: "Water Req.", key: "waterReq" as const },
                { label: "Sowing Window", key: "plantingWindow" as const },
              ].map((row) => (
                <tr key={row.label} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-slate-600 font-medium">{row.label}</td>
                  {crops.map((c) => (
                    <td key={c.id} className="px-5 py-3 text-right text-slate-800">
                      {row.format ? row.format(c[row.key]) : c[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-emerald-50">
                <td className="px-5 py-3 font-semibold text-slate-700">Net Est./Acre*</td>
                {crops.map((c) => (
                  <td key={c.id} className="px-5 py-3 text-right font-bold text-emerald-700">
                    ₨{(c.revenuePerAcre - c.costPerAcre).toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-slate-100">
            <ProvenanceBadge source="PARC / Punjab Agri. Dept. (Sample Benchmark)" unit="PKR / Acre" asOf="2026" status="sample" />
            <p className="text-xs text-slate-400 mt-1">* Revenue/cost figures are assumptions-based. Not guaranteed profits.</p>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      {crops.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Cost vs. Revenue Comparison (₨ thousands/acre)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}k`} />
              <Tooltip formatter={(v: any) => [`₨${v}k`, ""]} />
              <Legend />
              {crops.map((c, i) => (
                <Bar key={c.id} dataKey={c.nameEn} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <ProvenanceBadge source="Sample Benchmark Data" unit="PKR/Acre" asOf="2026" status="sample" />
        </div>
      )}
    </div>
  );
}
