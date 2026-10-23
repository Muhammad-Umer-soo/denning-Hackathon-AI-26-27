import Link from "next/link";
import { PILOT_CROPS } from "@/lib/data";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { ArrowRight, Droplets, Calendar, DollarSign, Wheat } from "lucide-react";

export default function CropsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🌿 Crop Catalog</h1>
        <p className="text-slate-500 mt-1">Agronomy guides for Punjab pilot crops · Rabi &amp; Kharif seasons</p>
        <p className="text-slate-400 text-sm urdu mt-0.5">فصل معلومات · پنجاب پائلٹ</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {PILOT_CROPS.map((crop) => (
          <div key={crop.id} className={`bg-gradient-to-br ${crop.bg} border ${crop.border} rounded-2xl overflow-hidden card-hover`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-4xl">{crop.icon}</span>
                  <h2 className="text-xl font-bold text-slate-800 mt-2">{crop.nameEn}</h2>
                  <p className="text-slate-600 urdu">{crop.nameUr}</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full text-white ${crop.accentBg}`}>
                    {crop.season} Season
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">₨{crop.pricePerMaund.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">per 40kg (maund)</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 mb-4">{crop.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1"><Wheat className="w-3.5 h-3.5" /> Yield</div>
                  <p className="font-semibold text-slate-800">{crop.yieldPerAcre}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1"><Droplets className="w-3.5 h-3.5" /> Water</div>
                  <p className="font-semibold text-slate-800">{crop.waterReq}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1"><DollarSign className="w-3.5 h-3.5" /> Cost/Acre</div>
                  <p className="font-semibold text-slate-800">₨{crop.costPerAcre.toLocaleString()}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1"><Calendar className="w-3.5 h-3.5" /> Sowing</div>
                  <p className="font-semibold text-slate-800 text-xs">{crop.plantingWindow}</p>
                </div>
              </div>

              <ProvenanceBadge source="PARC / Punjab Agri. Dept." asOf="2026 Season" status="sample" className="mt-4" />

              <Link
                href={`/crops/${crop.id}`}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/70 hover:bg-white border border-white/80 text-slate-700 font-medium text-sm transition-colors"
              >
                Full Agronomy Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
