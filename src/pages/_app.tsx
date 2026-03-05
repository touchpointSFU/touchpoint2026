import "@/styles/globals.css";
import ReactLenis from "lenis/react";
import { AnimatePresence } from "motion/react";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import Head from "next/head";
import Script from "next/script";
import { Fragment } from "react/jsx-runtime";
import { DM_Sans } from "next/font/google";
import { Nav } from "@/components/Nav/Nav";
import { ThemeContext } from "@/components/ThemeContext/ThemeContext";
import { useEffect, useState } from "react";

const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-dm",
  display: "swap",
});

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
  const [theme, setTheme] = useState<string>(pageProps.theme || "pink");
  const themes = {
    default: "var(--background)",
    pink: "var(--theme-pink)",
    green: "var(--theme-green)",
  };
  return (
    <Fragment>
      <Head>
        <title>Touchpoint 2026</title>
        <meta
          name="description"
          content="Your friendly neighbourhood design conference"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Touchpoint 2026" />
        <meta
          property="og:description"
          content="Your friendly neighbourhood design conference"
        />
        <meta property="og:url" content="https://touchpoint2026.com" />
        <meta property="og:image" content="/opengraph-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Touchpoint 2026" />
        <meta
          name="twitter:description"
          content="Your friendly neighbourhood design conference"
        />
        <meta name="twitter:image" content="/twitter-image.png" />
      </Head>
      <AnimatePresence>
        <ThemeContext value={{ theme, setTheme }}>
          <div
            className={`${dm.variable} ${clash.variable} ${HaasGroteskDSPro.variable} font-sans`}
            style={{
              background:
                themes[pageProps.theme as keyof typeof themes] ||
                themes.default,
              color:
                pageProps.theme === null ||
                pageProps.theme === "default" ||
                pageProps.theme === undefined
                  ? "var(--foreground)"
                  : "var(--background)",
            }}
          >
            <ReactLenis root />
            <Nav theme={pageProps.theme} page={router.route} />
            <Component key={router.route} {...pageProps} />

            {/* <Script src="https://greggman.github.io/webgl-lint/webgl-lint.js" /> */}
          </div>
        </ThemeContext>
      </AnimatePresence>
    </Fragment>
  );
}
