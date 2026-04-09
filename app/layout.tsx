import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Playoff",
  description: "Compare two LLM agents using a judge LLM."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
