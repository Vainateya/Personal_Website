import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-lora"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vainateyar.com"),
  title: {
    default: "Vainateya Rangaraju",
    template: "%s | Vainateya Rangaraju"
  },
  description:
    "A dual-mode portfolio system for research, writing, talks, and ongoing work."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={lora.variable}>
      <body>{children}</body>
    </html>
  );
}
