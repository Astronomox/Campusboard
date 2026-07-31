import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CampusBoard — UNILAG",
    template: "%s | CampusBoard",
  },
  description: "Anonymous, moderated discussion board for UNILAG students. Invite-only. One post at a time.",
  applicationName: "CampusBoard",
  keywords: ["UNILAG", "anonymous", "campus", "discussion", "board", "Nigeria", "student"],
  authors: [{ name: "CampusBoard" }],
  robots: "noindex,nofollow", // invite-only — don't index
  openGraph: {
    type: "website",
    siteName: "CampusBoard",
    title: "CampusBoard — UNILAG",
    description: "Anonymous campus discussion board for UNILAG students.",
  },
  twitter: {
    card: "summary",
    title: "CampusBoard — UNILAG",
    description: "Anonymous campus discussion board for UNILAG students.",
  },
};

export const viewport: Viewport = {
  themeColor: "#e4ddf2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
