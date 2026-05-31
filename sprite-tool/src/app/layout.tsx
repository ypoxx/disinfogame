import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Studio — Disinfo Game",
  description: "Internes Werkzeug: KI-Grafik (Gemini) & Audio (ElevenLabs) für das Spiel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
