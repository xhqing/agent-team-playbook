/* The Agent Team Playbook — analytics & CTA wiring.
 *
 * Reads window.SITE_CONFIG from config.js (git-ignored on each machine;
 * see config.example.js for the shape). Every integration is optional:
 * missing id / token => that integration is silently skipped.
 *
 *   ga4Id    -> Google Analytics 4 (page_view auto, outbound click auto via
 *               Enhanced Measurement, manual click_buy_cta backup with
 *               beacon transport so the event survives navigation)
 *   pixelId  -> Meta Pixel (PageView + ClickBuyCTA custom event)
 *   cfToken  -> Cloudflare Web Analytics beacon (independent view count)
 *   buyUrl   -> Payloadz buy link; CTA buttons stay disabled until it is set
 *   earlyBird{enabled,code,price,deadlineNote} -> launch-week banner
 *   newsletterUrl -> email capture endpoint (free-sample form, disabled until set)
 */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var PRODUCT_ID = "Team-Playbook-v3";

  /* ---------- 1. Google Analytics 4 ---------- */
  if (CFG.ga4Id) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CFG.ga4Id);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    // transport_type=beacon: hits are sent via navigator.sendBeacon on unload /
    // navigation, so the manual CTA event below survives the redirect.
    gtag("config", CFG.ga4Id, { transport_type: "beacon" });
  }

  /* ---------- 2. Meta Pixel ---------- */
  if (CFG.pixelId) {
    if (!window.fbq) {
      var n = (window.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!n._fbq) n._fbq = 1;
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      var fjs = document.createElement("script");
      fjs.async = true;
      fjs.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(fjs);
    }
    fbq("init", CFG.pixelId);
    fbq("track", "PageView"); // -> reported as landing_page_view for Meta traffic
  }

  /* ---------- 3. Cloudflare Web Analytics ---------- */
  if (CFG.cfToken) {
    var cfs = document.createElement("script");
    cfs.async = true;
    cfs.src = "https://static.cloudflareinsights.com/beacon.min.js";
    cfs.setAttribute("data-cf-beacon", JSON.stringify({ token: CFG.cfToken }));
    document.head.appendChild(cfs);
  }

  /* ---------- 4. CTA wiring ---------- */
  function fireCta(label) {
    if (window.gtag) {
      gtag("event", "click_buy_cta", {
        cta_label: label,
        product_id: PRODUCT_ID
      });
    }
    if (window.fbq) {
      fbq("trackCustom", "ClickBuyCTA", { cta_label: label, product_id: PRODUCT_ID });
    }
  }

  function ready() {
    var buttons = document.querySelectorAll(".buy-cta");

    // Early-bird banner (two slots share the same config)
    if (CFG.earlyBird && CFG.earlyBird.enabled) {
      ["earlybird", "earlybird-2"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.remove("hidden");
      });
      ["earlybird-code", "earlybird-code-2"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && CFG.earlyBird.code) el.textContent = CFG.earlyBird.code;
      });
      var dl = document.getElementById("earlybird-deadline");
      if (dl && CFG.earlyBird.deadlineNote) dl.textContent = "· " + CFG.earlyBird.deadlineNote;
    }

    Array.prototype.forEach.call(buttons, function (btn) {
      // guard: unset OR placeholder value keeps the button disabled
      if (!CFG.buyUrl || !/^https?:\/\//.test(CFG.buyUrl)) {
        btn.disabled = true;
        btn.title = "Checkout link not configured yet.";
        return;
      }
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        fireCta(btn.getAttribute("data-cta") || "cta");
        // small delay lets async beacons flush before navigation
        setTimeout(function () { window.location.href = CFG.buyUrl; }, 120);
      }, true);
    });

    // Email capture (free sample). The form POSTs to the configured
    // newsletter endpoint (e.g. Buttondown embed subscribe) in a new tab,
    // so visitors never leave the page. Tracks GA4 generate_lead + Meta Lead.
    var form = document.getElementById("email-form");
    if (form) {
      var submitBtn = form.querySelector(".email-cta");
      if (!CFG.newsletterUrl || !/^https?:\/\//.test(CFG.newsletterUrl)) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.title = "Email signup not configured yet.";
        }
      } else {
        form.action = CFG.newsletterUrl;
        form.addEventListener("submit", function () {
          if (window.gtag) {
            gtag("event", "generate_lead", {
              cta_label: form.getAttribute("data-cta") || "free-sample",
              product_id: PRODUCT_ID
            });
          }
          if (window.fbq) {
            fbq("track", "Lead", { content_name: PRODUCT_ID });
          }
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
