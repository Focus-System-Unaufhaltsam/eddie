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
