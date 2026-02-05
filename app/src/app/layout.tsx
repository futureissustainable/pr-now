import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PR Now — AI-Powered PR Outreach",
  description:
    "Automate your PR outreach with AI. Discover outlets, craft personalized pitches, and manage campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
