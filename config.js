// Copy to config.js (git-ignored) and fill real values before deploy.
// Shape consumed by analytics.js — see site/README.md.
window.SITE_CONFIG = {
  // Google Analytics 4 Measurement ID, e.g. "G-ABC1234567".
  // Enables: page_view (auto) + outbound click (Enhanced Measurement, auto)
  //          + click_buy_cta (manual backup, beacon transport).
  ga4Id: "",

  // Meta Pixel ID — set when running Meta ads (Buzz phase).
  // Enables: PageView (= landing_page_view for Meta traffic) + ClickBuyCTA.
  pixelId: "",

  // Cloudflare Web Analytics token — independent, cookie-free view count.
  cfToken: "",

  // Payloadz buy link (GoLink). CTA buttons stay disabled until this is set.
  buyUrl: "https://store.payloadz.com/go?id=2722311",

  // Launch-week early bird banner (Vendy owns final code & price).
  newsletterUrl: "https://buttondown.email/api/emails/embed-subscribe/xhqing",
  earlyBird: {
    enabled: false,
    code: "EARLY35",
    deadlineNote: "first week only"
  }
};
