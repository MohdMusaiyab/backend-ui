import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://backend-journal.vercel.app"),
  title: {
    template: "%s | Musaiyab - Backend Engineer",
    default: "Backend Architecture Gallery | Mohd Musaiyab",
  },
  description: "A curated collection of backend systems, distributed queues, and highly concurrent architectures built by Mohd Musaiyab.",
  keywords: ["Backend Developer", "Go", "Node.js", "Distributed Systems", "Microservices", "System Architecture", "Mohd Musaiyab", "Redis", "PostgreSQL"],
  authors: [{ name: "Mohd Musaiyab" }],
  creator: "Mohd Musaiyab",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://backend-journal.vercel.app",
    title: "Backend Architecture Gallery | Mohd Musaiyab",
    description: "A curated collection of backend systems, distributed queues, and highly concurrent architectures.",
    siteName: "Backend Architecture Gallery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backend Architecture Gallery | Mohd Musaiyab",
    description: "A curated collection of backend systems, distributed queues, and highly concurrent architectures.",
    creator: "@mohd_musaiyab",
  },
  verification: {
    google: "tZEIXbvD5UYrx3nodRLPoBvTizs8JtiI0uhBxmyLM4M",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mohd Musaiyab",
    "url": "https://itsmusaiyab.in",
    "jobTitle": "Backend Engineer",
    "sameAs": [
      "https://github.com/MohdMusaiyab",
      "https://x.com/mohd_musaiyab",
      "https://www.linkedin.com/in/mohd-musaiyab/"
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#121210] text-[#EDE7D8] font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
