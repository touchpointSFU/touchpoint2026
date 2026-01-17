import "@/styles/globals.css";
import ReactLenis from "lenis/react";
import { AnimatePresence } from "motion/react";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import Script from "next/script";

const clash = localFont({
  src: [
    {
      path: "../fonts/ClashDisplay-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

const HaasGroteskDSPro = localFont({
  src: [
    {
      path: "../fonts/NHaasGroteskDSPro-55Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/NHaasGroteskDSPro-65Md.woff2",
      weight: "500",
      style: "medium",
    },
  ],
  variable: "--font-Haas",
  display: "swap",
});

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <div className={`${clash.variable} ${HaasGroteskDSPro.variable} font-sans`}>
      <ReactLenis root />
      <AnimatePresence>
        <Component key={router.route} {...pageProps} />
        <Script src="https://greggman.github.io/webgl-lint/webgl-lint.js" />
      </AnimatePresence>
    </div>
  );
}
