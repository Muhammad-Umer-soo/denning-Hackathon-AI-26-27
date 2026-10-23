import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "HarvestIQ — AgriWise Punjab",
  description:
    "AI-powered agriculture decision support for Punjab farmers. Crop guides, mandi prices, soil assistant, and verified scheme directory.",
  keywords: ["agriculture", "pakistan", "punjab", "crops", "mandi prices", "farming", "kissan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 mt-16 py-8 text-center text-sm text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-medium text-slate-700 mb-1">HarvestIQ (AgriWise) — Punjab Pilot MVP</p>
            <p>Data shown is <span className="font-semibold text-orange-600">sample/illustrative</span> for demo purposes. Always verify with local extension officers and official sources before making farm decisions.</p>
            <p className="mt-2">© 2026 HarvestIQ · <a href="https://agripunjab.gov.pk" className="underline" target="_blank" rel="noopener noreferrer">Punjab Agriculture Dept.</a></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
