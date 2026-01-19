import type { Metadata } from "next";
import "./globals.css";
import LenisWrapper from "@/components/layout/LenisWrapper";

// replace the below metadata according to your project

export const metadata: Metadata = {
  metadataBase: new URL('https://maybetarun.in'),
  title: "revo",
  description: "Built with revo",
  keywords: ["revo", "next.js", "npm", "package"],
  authors: [{ name: "maybetarun.in" }],
  creator: "MaybeTarun.in",
  publisher: "MaybeTarun.in",
  robots: "index, follow",
  icons: "/revo.svg",

  // For Facebook, LinkedIn, etc.
  openGraph: {
    title: "revo",
    description: "Built with revo",
    type: "website",
    url: "https://maybetarun.in",
    images: [
      {
        url: "/websiteCard.svg",
        width: 1200,
        height: 630,
        alt: "revo",
      },
    ],
  },

  // for Twitter
  twitter: {
    card: "summary_large_image",
    title: "revo",
    description: "Built with revo",
    images: [
      {
        url: "/websiteCard.svg",
        width: 1200,
        height: 630,
        alt: "revo",
      },
    ],
    creator: "@maybetarun",
  },  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LenisWrapper>{children}</LenisWrapper>
      </body>
    </html>
  );
}
