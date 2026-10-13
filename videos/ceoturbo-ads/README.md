# CEO Turbo ads (HyperFrames)

Three 9:16 (1080x1920) ads built with HyperFrames. Edit the HTML, run `./stage.sh <name> <audio>`, then `npx hyperframes render` inside `.build/<name>`.

| File | Length | Angle | CTA |
| --- | --- | --- | --- |
| `ad1-review-card.html` | 24s | Google review NFC card: "one tap" | ceoturbo.com/google-review-cards |
| `ad2-lead-gen.html` | 24s | Real Meta lead results ($4.89/lead, 147 leads) | ceoturbo.com/free-audit |
| `ad3-artist-growth.html` | 16s | Artist profile visits $0.32 vs $0.85 peer median | ceoturbo.com/artist |

All numbers come from `src/content/results.ts` (real Meta dashboards, Jul-Aug 2026). Ad 1's review counter is labeled "Illustrative example".
Music beds are generated (120 BPM) so cuts land on beats; renders are in `renders/`.
