# UNAUFHALTSAM v2.2 Social / English UI

## Changed in this build

- All visible interface copy is English.
- `UNAUFHALTSAM` is intentionally kept as the only German word in the product language.
- Social-@ leaderboard entry remains active across TikTok, Instagram, YouTube, X, LinkedIn, Twitch and Other.
- Legacy legal URLs redirect to English pages: `privacy.html` and `legal.html`.
- Duplicate Firebase initialization line from the prior packaged build was removed.

## Deploy

1. Copy the contents of this folder into the GitHub Pages repository.
2. Commit and push.
3. Open Firebase Console → Firestore → Rules.
4. Replace the rules with the contents of `firestore.rules` and publish.
5. Hard-refresh the website after deployment.

## Test handles

- `@yourhandle`
- `https://www.tiktok.com/@yourhandle`
- `instagram.com/testname`
- `x.com/testname`

## Note

GitHub Pages plus a client-side Firebase app is not fully cheat-proof. The rules reduce low-effort manipulation. Strong verification would require a Cloud Function or server-side score validation. For the current challenge funnel, this build keeps the system lean.

## v2.2 One-Slot Ranking

This version enforces one visible ranking slot per player identity:

- Social handles are normalized to lowercase.
- The same social @ updates one existing rank instead of creating another row.
- The same browser/device is locked to the first saved ranking slot.
- The leaderboard display deduplicates legacy duplicates by social handle and display name.
- Firestore update rules lock identity fields; only a better score or same-score faster time can update a rank.

Client-only GitHub Pages cannot prove a human identity across different devices and completely different social handles. Full enforcement would require a backend identity check or verified social login.


## v2.3 Wall 30 Fix

- The top HUD wall indicator is now fixed at `30`.
- Wall 30 is the permanent target, not a countdown.
- Removed dynamic copy such as `28 Boxes to the wall` from the result hint.


## v2.4 No Wall HUD

- Removed the top HUD wall counter entirely.
- Top HUD now shows only `Boxes` and `Best`.
- Wall 30 remains a brand concept in the copy, not a status tile or countdown.


## v2.5 Link Guard

- Main game link must be the folder root: `/eddie/`, not `/eddie/legal.html` or `/eddie/privacy.html`.
- Footer legal links now open `legal.html?from=game` and `privacy.html?from=game`.
- Direct accidental hits on `legal.html`, `privacy.html`, `impressum.html` or `datenschutz.html` are bounced back to the game.
- Share output now always uses the clean game root URL, not the current subpage URL.
- Added a simple GitHub Pages `404.html` fallback to route unknown paths back to the game.
