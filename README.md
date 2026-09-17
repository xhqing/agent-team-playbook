# Landing Page — The Agent Team Playbook

Static single-page site for selling the Agent Team Playbook on Payloadz + PayPal.
No build step, no dependencies. Product info: `product_id: Team-Playbook-v3`.

## Files

| File | Role |
|---|---|
| `index.html` | Page content (EN) |
| `style.css` | Styling |
| `analytics.js` | GA4 / Meta Pixel / CF Web Analytics injection + CTA + email-capture events |
| `config.js` | **Local runtime config — git-ignored, never commit real values** |
| `config.example.js` | Placeholder template for `config.js` |

## Setup

```bash
cp config.example.js config.js   # then fill real values
```

- `ga4Id` — GA4 Measurement ID (page views + outbound clicks + CTA events)
- `pixelId` — Meta Pixel ID, only when running Meta ads
- `cfToken` — Cloudflare Web Analytics beacon token (independent view count)
- `buyUrl` — Payloadz GoLink; CTAs are disabled until it is set
- `earlyBird` — launch-week banner switch (code/price/deadline owned by Vendy)
- `newsletterUrl` — email capture endpoint for the free-sample form (e.g. Buttondown embed subscribe URL); form disabled until set

## Data flow (why no backend / database)

```
landing page load  -> GA4 page_view (+ Pixel PageView, + CF view)
CTA click          -> GA4 outbound click (auto) + click_buy_cta (beacon backup)
                   -> redirect to Payloadz GoLink -> PayPal
email capture      -> form POST to newsletterUrl (new tab) + GA4 generate_lead / Meta Lead
post-purchase      -> Payloadz "Download Page Text" field fires conversion code
```

All counts live in the analytics dashboards (GA4 / Meta / Cloudflare). Nothing is
stored on this site.

## Deploy

Any static host. GitHub Pages or Cloudflare Pages, free tier is enough:

```bash
# from repo root
python3 -m http.server 8000 --directory site   # local preview
```

Deploy = upload the `site/` directory (including the local `config.js`).
