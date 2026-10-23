import { SCHEMES } from "@/lib/data";
import { ProvenanceBadge } from "@/components/provenance-badge";
import { ExternalLink, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function SchemesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🏦 Verified Finance Scheme Directory</h1>
        <p className="text-slate-500 mt-1">Authorized government programmes for Punjab farmers</p>
        <p className="text-slate-400 text-sm urdu mt-0.5">سرکاری سکیمیں · پنجاب</p>
      </div>

      {/* Integrity Notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
        <p>
          <strong>Verify directly with the provider.</strong> Eligibility, deadlines, and terms change. HarvestIQ does not guarantee approval, subsidy, or disbursement. Never share bank credentials or card numbers with unofficial sources.
        </p>
      </div>

      <div className="space-y-4">
        {SCHEMES.map((scheme) => (
          <div key={scheme.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-800">{scheme.title}</h2>
                  <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">Provider: <span className="font-medium text-slate-700">{scheme.provider}</span></p>
              </div>
              <a
                href={scheme.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium hover:underline border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-50 transition-colors"
              >
                Official Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Eligibility</p>
                <p className="text-sm text-slate-700">{scheme.eligibility}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Benefits</p>
                <p className="text-sm text-slate-700">{scheme.benefits}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Required Documents
              </p>
              <div className="flex flex-wrap gap-2">
                {scheme.documents.map((doc) => (
                  <span key={doc} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            <ProvenanceBadge source={`Verified · ${scheme.provider}`} asOf={scheme.verifiedAt} status="latest_reported" />
          </div>
        ))}
      </div>
    </div>
  );
}
