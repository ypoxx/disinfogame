import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprite Studio - Disinfo Game Assets",
  description: "KI-gestütztes Tool zur Erstellung von Spielgrafiken",
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
