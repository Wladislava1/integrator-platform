import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Связь ID — Integrator Platform",
  description:
    "Платформа единого входа Связь ID для подключения внешних продуктов через единую учётную запись",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-theme="light">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
