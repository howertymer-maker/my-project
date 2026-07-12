// Analytics + Error tracking scaffolds.
// These only activate when the corresponding env var is set.
// Add to your .env:
//   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  → Google Analytics
//
// For Sentry: bun add @sentry/nextjs, then run npx @sentry/wizard@latest -i nextjs
// Sentry is NOT included by default to avoid adding a heavy dependency.

import Script from "next/script";

/** Google Analytics 4 — only loads if GA_MEASUREMENT_ID is set. */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
