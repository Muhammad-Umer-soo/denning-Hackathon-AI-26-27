import Link from "next/link";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { PILOT_CROPS, MANDI_PRICES, WEATHER } from "@/lib/data";
import {
  CloudSun, Wind, Droplets, TrendingUp, TrendingDown,
  ArrowRight, Sprout, HandCoins, FlaskConical, AlertTriangle
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                🌾 HarvestIQ Dashboard
              </h1>
              <p className="text-emerald-100 mt-1 text-sm sm:text-base">
                Punjab Pilot · Multan / Faisalabad Agricultural Belt
              </p>
              <p className="text-emerald-200 text-sm mt-1 urdu">پنجاب پائلٹ · کاشتکار ڈیش بورڈ</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-sm">
              <p className="font-semibold">Rabi Season 2026–27</p>
              <p className="text-emerald-100">Oct – Apr</p>
            </div>
          </div>

          {/* Weather Card */}
          <div className="mt-6 bg-white/15 backdrop-blur rounded-xl p-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3">
              <CloudSun className="w-10 h-10 text-yellow-200" />
              <div>
                <p className="text-2xl font-bold">{WEATHER.temp}°C</p>
                <p className="text-emerald-100 text-sm">{WEATHER.condition}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-emerald-100 flex-wrap">
              <span className="flex items-center gap-1"><Droplets className="w-4 h-4" />{WEATHER.humidity}% humidity</span>
              <span className="flex items-center gap-1"><Wind className="w-4 h-4" />{WEATHER.wind}</span>
            </div>
            <div className="ml-auto bg-emerald-900/40 rounded-lg px-3 py-2 text-sm max-w-xs">
              <p className="font-medium text-yellow-200">📢 Advisory</p>
              <p className="text-emerald-100">{WEATHER.advisory}</p>
            </div>
          </div>
          <ProvenanceBadge source={WEATHER.source} asOf={WEATHER.asOf} status={WEATHER.status} className="mt-2 text-emerald-200 [&_span]:bg-orange-200/20 [&_span]:text-orange-100 [&_span]:border-orange-300/30" />
        </div>
      </section>

      {/* Sample Data Warning */}
      <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-orange-500" />
        <p>
          <strong>Demo Notice:</strong> All prices, yields, and data shown are <strong>sample/illustrative benchmarks</strong> for the hackathon demo. Verify with official sources (Punjab AMIS, PARC) before making farm decisions.
        </p>
      </div>

      {/* Quick Stats */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4">📊 Today&apos;s Mandi Snapshot</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MANDI_PRICES.map((item) => (
            <div key={item.crop} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.crop}</p>
                  <p className="text-xs text-slate-400 urdu">{item.nameUr}</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">₨{item.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{item.unit}</p>
                </div>
                <span className={`flex items-center gap-0.5 text-sm font-medium ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {item.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(item.change)}%
                </span>
              </div>
              <ProvenanceBadge source={item.source} unit={item.unit} asOf={item.asOf} status={item.status} />
            </div>
          ))}
        </div>
      </section>

      {/* Pilot Crops */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">🌿 Pilot Crops</h2>
          <Link href="/crops" className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:underline">
            View all guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILOT_CROPS.map((crop) => (
            <Link
              key={crop.id}
              href={`/crops/${crop.id}`}
              className={`bg-gradient-to-br ${crop.bg} border ${crop.border} rounded-xl p-4 card-hover block`}
            >
              <div className="text-3xl mb-2">{crop.icon}</div>
              <p className="font-bold text-slate-800">{crop.nameEn}</p>
              <p className="text-sm text-slate-500 urdu">{crop.nameUr}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full text-white ${crop.accentBg}`}>
                {crop.season}
              </span>
              <p className="text-sm text-slate-600 mt-2">{crop.description.slice(0, 60)}…</p>
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between text-xs text-slate-600">
                <span>₨{crop.pricePerMaund.toLocaleString()}/mnd</span>
                <span>{crop.yieldPerAcre}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid sm:grid-cols-3 gap-4">
        <Link href="/soil" className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-5 card-hover">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Soil AI Assistant</p>
            <p className="text-sm text-slate-500">Upload soil photo for observations</p>
            <p className="text-xs text-slate-400 urdu mt-0.5">مٹی تجزیہ</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
        </Link>
        <Link href="/schemes" className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-5 card-hover">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <HandCoins className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Finance Schemes</p>
            <p className="text-sm text-slate-500">Verified govt. programmes</p>
            <p className="text-xs text-slate-400 urdu mt-0.5">سرکاری سکیمیں</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
        </Link>
        <Link href="/crops" className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-5 card-hover">
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Crop Comparison</p>
            <p className="text-sm text-slate-500">Compare costs &amp; revenue</p>
            <p className="text-xs text-slate-400 urdu mt-0.5">فصل موازنہ</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
        </Link>
      </section>
    </div>
  );
}
