import type { Metadata } from "next";
import { DM_Sans, DM_Mono, DM_Serif_Display, Source_Serif_4, Teachers } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistProvider from "@/components/WaitlistProvider";
import { accentBootstrapScript } from "@/lib/accents";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
});

const teachers = Teachers({
  variable: "--font-teachers",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habacus — Make your habits count.",
  description:
    "Habacus is an abacus for your habits. Tap a bead each day, watch your week take shape, and let your friends cheer you on. On iOS.",
  metadataBase: new URL("https://habacus.app"),
  openGraph: {
    title: "Habacus — Make your habits count.",
    description:
      "An abacus for your habits. Tap a bead each day, watch your week take shape, and let your friends cheer you on. On iOS.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The accent bootstrap script writes the stored gem's CSS variables onto
      // <html> before React hydrates, which the server could not have known.
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmMono.variable} ${dmSerifDisplay.variable} ${sourceSerif4.variable} ${teachers.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{ __html: accentBootstrapScript() }}
        />
        <div className="ambient-top" aria-hidden="true" />
        <WaitlistProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </WaitlistProvider>
      </body>
    </html>
  );
}
