import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], weight: ["300", "400", "500"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400"] });
// Nastaliq is only used for a couple of Urdu lines, so it isn't preloaded and never blocks first paint
const nastaliq = Noto_Nastaliq_Urdu({ variable: "--font-nastaliq", subsets: ["arabic"], weight: ["400"], display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Lath & Line · Wall panels, delivered all over Pakistan",
  description: "Fluted PVC panels, WPC acoustic slats, UV marble sheets and adhesive finishes. Walk into the house and try them on a real wall.",
};

export const viewport: Viewport = { themeColor: "#eeeae4", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${nastaliq.variable} antialiased`}>
      <body>
        <SmoothScroll>
          <Nav />
          <main className="overflow-x-clip">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
