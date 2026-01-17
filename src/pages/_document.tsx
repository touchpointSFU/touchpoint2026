import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
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
      <body className="antialiased bg-background">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
