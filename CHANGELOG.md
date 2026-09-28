# Changelog — سجل الإصدارات

Every version delivered is kept in this repository as its own commit on `main`, named
`v4 — …`, `v5 — …` and so on. Each of those commits is the complete project as it was
delivered on that date: open it from the commit list on GitHub and choose **Browse files**,
or run `git checkout <commit>` locally.

| Version | Commit | Date (Riyadh) | What changed |
| --- | --- | --- | --- |
| `v4` | `0f418ee` | 26 Sep 2026, 00:26 | Alignment and RTL polish: "I AM ALI" alignment, tool icons across the width, larger English skill names in Arabic, next-project preview on the left in Arabic, numbers on the Arabic reading edge, 3-post social rows, mobile rails, contact copy button order. Layout: `source/` + built `website/`. |
| `v5` | `530c181` | 26 Sep 2026, 03:52 | Ghams → Ghamsa / غمسة everywhere; CareInn social posts from the updated PDF (8 posts); Fully Charged and Trackulizer screens recut straight at iPhone proportions; updated PDF behind the download button. |
| `v5.1` | `0cbd779` | 26 Sep 2026, 04:00 | `source/build.ts` copies `../website/assets` and the PDF into `dist` (Vercel project with Root Directory `source`). |
| `v6` | `ce108b0` | 26 Sep 2026, 04:11 | Standalone project at the repository root (`src/`, `public/assets`, `build.ts`, `vercel.json`) — deploys as a new Vercel project with no outside folders. |
| `v7` | `fdb0182` | 27 Sep 2026, 10:27 | Phone screens clipped correctly on iPhone Safari; profiles headline "الملفات التعريفية للشركات"; white dot in the social marquee; external-link icon for WhatsApp / PDF; "تواصل معي" under the thank-you line; logos centred with transparent backgrounds; solid menu bar when the menu scrolls. |
| `v8` | `a36dee6` | 27 Sep 2026, 13:40 | Print headline: "قوائم طعام وبروشورات ومطويات". |

The first three deliveries (25 Sep 2026: first build, the file-opening fix, and the 23-point
refinement round) were not kept as separate source snapshots, so the history starts at `v4`,
which already contains all of that work.

From `v8` on, every change is committed and pushed here as soon as it is made, and Vercel
publishes each push to `main` automatically (connected 28 Sep 2026).
