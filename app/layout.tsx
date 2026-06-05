import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "音波ラジオ - AI Radio",
  description: "AIが生成する日本語ラジオ放送 - 音波ラジオ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
