import { notFound } from "next/navigation";
import { PILOT_CROPS } from "@/lib/data";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { AlertTriangle, Droplets, Sun, Leaf, Calendar, DollarSign, TrendingUp } from "lucide-react";

export function generateStaticParams() {
  return PILOT_CROPS.map((c) => ({ id: c.id }));
}

export default async function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const crop = PILOT_CROPS.find((c) => c.id === id);
  if (!crop) notFound();

  const roi = Math.round(((crop.revenuePerAcre - crop.costPerAcre) / crop.costPerAcre) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className={`bg-gradient-to-br ${crop.bg} border ${crop.border} rounded-2xl p-6`}>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{crop.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-800">{crop.nameEn}</h1>
              <span className="text-slate-500 urdu text-lg">{crop.nameUr}</span>
              <span className={`text-xs px-2 py-1 rounded-full text-white ${crop.accentBg}`}>{crop.season}</span>
            </div>
            <p className="text-slate-700 mt-2">{crop.description}</p>
            <ProvenanceBadge source="PARC / Punjab Agri. Dept." asOf="2026 Season" status="sample" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Price / Maund", value: `₨${crop.pricePerMaund.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600" },
          { label: "Yield / Acre", value: crop.yieldPerAcre, icon: TrendingUp, color: "text-blue-600" },
          { label: "Cost / Acre", value: `₨${crop.costPerAcre.toLocaleString()}`, icon: DollarSign, color: "text-orange-600" },
          { label: "Est. ROI", value: `~${roi}%`, icon: TrendingUp, color: "text-violet-600" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
            <m.icon className={`w-5 h-5 mx-auto mb-1 ${m.color}`} />
            <p className="text-xl font-bold text-slate-800">{m.value}</p>
            <p className="text-xs text-slate-500">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Agronomy Guide */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-3"><Sun className="w-4 h-4 text-yellow-500" /> Climate &amp; Soil</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p><span className="font-medium">Climate:</span> {crop.climate}</p>
            <p><span className="font-medium">Soil:</span> {crop.soil}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-3"><Calendar className="w-4 h-4 text-emerald-500" /> Planting Calendar</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p><span className="font-medium">Sowing Window:</span> {crop.plantingWindow}</p>
            <p><span className="font-medium">Season:</span> {crop.season}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-3"><Droplets className="w-4 h-4 text-blue-500" /> Water &amp; Irrigation</h2>
          <p className="text-sm text-slate-700">{crop.waterReq}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-3"><Leaf className="w-4 h-4 text-green-500" /> Revenue Estimate</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><span>Revenue / Acre:</span><span className="font-semibold text-emerald-600">₨{crop.revenuePerAcre.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Cost / Acre:</span><span className="font-semibold text-red-500">₨{crop.costPerAcre.toLocaleString()}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-medium">Net Estimate:</span><span className="font-bold text-slate-800">₨{(crop.revenuePerAcre - crop.costPerAcre).toLocaleString()}</span></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">* Assumptions-based estimate. Not a guaranteed profit.</p>
        </div>
      </div>

      {/* Fertilizer Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
        <p>
          <strong>Fertilizer &amp; Dosage:</strong> Specific NPK doses are not prescribed here. Always conduct a soil test and consult a local agronomist or PARC extension officer before applying fertilizers. Guides without soil-test data cannot reliably recommend exact quantities.
        </p>
      </div>

      <ProvenanceBadge source="PARC / Punjab Agriculture Dept. (Sample Benchmark)" unit="PKR / Acre" asOf="2026" status="sample" />
    </div>
  );
}
