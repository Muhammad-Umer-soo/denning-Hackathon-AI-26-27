"use client";

import { useState, useRef } from "react";
import { AlertTriangle, Upload, X, FlaskConical, CheckCircle } from "lucide-react";

const DISCLAIMERS = [
  "A soil photo cannot measure NPK, pH, salinity, or moisture levels.",
  "Never apply specific fertilizer doses based on image analysis alone.",
  "Always conduct a certified laboratory soil test before applying inputs.",
  "Consult a local agronomist or PARC extension officer for prescriptions.",
];

const SAMPLE_OBSERVATIONS = [
  {
    label: "Color Observation",
    icon: "🟤",
    text: "The soil appears dark brown, which may suggest moderate organic matter content. However, color alone is not a reliable indicator of fertility.",
  },
  {
    label: "Texture Estimate",
    icon: "🖐️",
    text: "Visual texture appears loamy to clay-loam. Actual texture determination requires a field ribbon or lab test.",
  },
  {
    label: "Moisture Appearance",
    icon: "💧",
    text: "The sample appears moderately dry. Irrigation history and seasonal conditions are unknown from the image alone.",
  },
];

export default function SoilPage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [consented, setConsented] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be under 5 MB.");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!image || !consented) return;
    setSubmitted(true);
  }

  function reset() {
    setImage(null);
    setFileName("");
    setSubmitted(false);
    setConsented(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-amber-500" /> Soil AI Assistant
        </h1>
        <p className="text-slate-500 mt-1">Upload a soil photo for visual observations (not a diagnosis)</p>
        <p className="text-slate-400 text-sm urdu mt-0.5">مٹی تجزیہ · AI مددگار</p>
      </div>

      {/* Safety Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-2 font-semibold text-amber-800 mb-3">
          <AlertTriangle className="w-5 h-5" /> Important Limitations — Please Read
        </div>
        <ul className="space-y-1.5">
          {DISCLAIMERS.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-amber-900">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      {!submitted ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          {/* Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Soil Photo</label>
            {!image ? (
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Click to upload JPG/PNG/WEBP · Max 5 MB</p>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
              </div>
            ) : (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Soil sample" className="w-full h-48 object-cover rounded-xl" />
                <button onClick={reset} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-slate-400 mt-1 truncate">{fileName}</p>
              </div>
            )}
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} className="mt-0.5 w-4 h-4 accent-emerald-600" />
            <span className="text-sm text-slate-700">
              I consent to this image being processed for demonstration purposes. I understand this is a sample observation, not a certified soil test.
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!image || !consented}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold transition-colors"
          >
            Analyze Soil Photo
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <CheckCircle className="w-5 h-5" /> Sample AI Observations
          </div>
          <p className="text-xs bg-orange-100 text-orange-800 border border-orange-200 rounded-lg px-3 py-2">
            ⚠️ <strong>AI-generated output · Sample demo only.</strong> These are illustrative observations — not a soil diagnosis. Source: Demo AI Model · Oct 2026.
          </p>

          <div className="space-y-4">
            {SAMPLE_OBSERVATIONS.map((obs) => (
              <div key={obs.label} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                <p className="font-medium text-slate-700 mb-1">{obs.icon} {obs.label}</p>
                <p className="text-sm text-slate-600">{obs.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <p className="font-semibold mb-1">📋 Recommended Next Steps</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Conduct a certified soil test at a PARC or Punjab Soil Testing Lab.</li>
              <li>Share test results with a local extension officer before applying fertilizer.</li>
              <li>Do not use this observation as the basis for any input purchasing decisions.</li>
            </ol>
          </div>

          <button onClick={reset} className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Analyze Another Photo
          </button>
        </div>
      )}
    </div>
  );
}
