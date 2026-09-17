// Copy to config.js (git-ignored) and fill real values before deploy.
// Shape consumed by analytics.js — see site/README.md.
window.SITE_CONFIG = {
  // Google Analytics 4 Measurement ID, e.g. "G-ABC1234567".
  // Enables: page_view (auto) + outbound click (Enhanced Measurement, auto)
  //          + click_buy_cta (manual backup, beacon transport).
  ga4Id: "<GA4_MEASUREMENT_ID>",

  // Meta Pixel ID — set when running Meta ads (Buzz phase).
  // Enables: PageView (= landing_page_view for Meta traffic) + ClickBuyCTA.
  pixelId: "",

  // Cloudflare Web Analytics token — independent, cookie-free view count.
  cfToken: "",

  // Payloadz buy link (GoLink). CTA buttons stay disabled until this is set.
  buyUrl: "<PAYLOADZ_GOLINK_URL>",

  // Email capture endpoint (free-sample form). Example: Buttondown embed
  // subscribe URL — "https://buttondown.email/api/emails/embed-subscribe/<user>".
  // The form stays disabled until a real URL is set.
  newsletterUrl: "",

  // Launch-week early bird banner (Vendy owns final code & price).
  earlyBird: {
    enabled: false,
    code: "EARLY35",
    deadlineNote: "first week only"
  }
};
