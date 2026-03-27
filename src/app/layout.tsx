import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFEEL Company",
  description: "패션 스타마케팅 포트폴리오와 회사 소개를 제공하는 AFEEL Company 공식 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
