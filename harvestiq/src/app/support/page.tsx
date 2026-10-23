import { Phone, MapPin, Globe, Clock } from "lucide-react";

const CONTACTS = [
  {
    name: "PARC — Pakistan Agricultural Research Council",
    nameUr: "پاکستان زرعی تحقیق کونسل",
    type: "Research Authority",
    phone: "+92-51-9255055",
    address: "Islamabad, Pakistan",
    url: "https://parc.gov.pk",
    hours: "Mon–Fri, 8am–4pm",
    region: "Federal",
  },
  {
    name: "Punjab Agriculture Department",
    nameUr: "محکمہ زراعت پنجاب",
    type: "Provincial Extension",
    phone: "+92-42-99210140",
    address: "Lahore, Punjab",
    url: "https://agripunjab.gov.pk",
    hours: "Mon–Fri, 9am–5pm",
    region: "Punjab",
  },
  {
    name: "Multan Agriculture Office",
    nameUr: "ملتان زرعی دفتر",
    type: "District Extension",
    phone: "+92-61-9200080",
    address: "Multan District, Punjab",
    url: "https://agripunjab.gov.pk",
    hours: "Mon–Fri, 8am–4pm",
    region: "Multan",
  },
  {
    name: "Faisalabad Agriculture Office",
    nameUr: "فیصل آباد زرعی دفتر",
    type: "District Extension",
    phone: "+92-41-9220140",
    address: "Faisalabad District, Punjab",
    url: "https://agripunjab.gov.pk",
    hours: "Mon–Fri, 8am–4pm",
    region: "Faisalabad",
  },
  {
    name: "Zarai Tarqiati Bank (ZTBL)",
    nameUr: "زرعی ترقیاتی بینک",
    type: "Agricultural Finance",
    phone: "0800-79825",
    address: "Multiple branches across Punjab",
    url: "https://ztbl.com.pk",
    hours: "Mon–Sat, 9am–5pm",
    region: "Punjab",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">📞 Extension &amp; Support Directory</h1>
        <p className="text-slate-500 mt-1">Verified local extension offices and agricultural departments</p>
        <p className="text-slate-400 text-sm urdu mt-0.5">زرعی مدد · توسیع دفاتر</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {CONTACTS.map((c) => (
          <div key={c.name} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm card-hover">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{c.type}</span>
                <h2 className="font-bold text-slate-800 mt-1">{c.name}</h2>
                <p className="text-xs text-slate-400 urdu mt-0.5">{c.nameUr}</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">{c.region}</span>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                {c.phone}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                {c.address}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                {c.hours}
              </div>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-600 hover:underline"
              >
                <Globe className="w-4 h-4 shrink-0" />
                Official Website
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
