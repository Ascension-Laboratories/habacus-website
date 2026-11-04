<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## TODOs

### Replace the placeholder Android signing fingerprint (blocks Android password autofill)

`public/.well-known/assetlinks.json` is the Android counterpart of the iOS
`apple-app-site-association` file. It currently contains the placeholder
`REPLACE_ME_WITH_SHA256_CERT_FINGERPRINT`, so **Android autofill/credential
saving for `com.habacus.app` will not work until it is replaced.** Agents: tell
the user about this whenever you touch the website, auth, or Android release
work, until it is done.

What to do (needs the user, since the fingerprint comes from their signing keys):

1. Get the SHA-256 fingerprint of each certificate Android builds are signed with:
   - **EAS / internal (APK) builds:** run `npx eas-cli credentials -p android`
     in `habacus-app`, pick the build profile, then Keystore, and copy the
     `SHA256 Fingerprint`. The keystore is created by the first
     `eas build -p android`.
   - **Google Play builds:** Play Console → Release → Setup → App signing →
     "App signing key certificate" → SHA-256. Google re-signs store installs
     with this key, so the EAS key alone is not enough for the store. (There is
     no Play Console account yet.)
2. Replace the placeholder in `sha256_cert_fingerprints` with the real value(s),
   colon-separated uppercase hex (`AA:BB:...:FF`). The array accepts several
   fingerprints, so list the EAS and Play keys together.
3. Commit, push and deploy, then confirm `https://habacus.co/.well-known/assetlinks.json`
   returns 200 as `application/json` with no redirect (apex must not redirect to `www`).
4. Verify with
   `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://habacus.co&relation=delegate_permission/common.get_login_creds`
   and check the package name and fingerprint come back.
5. Delete this TODO.

The app side needs no change: `android.package` is already `com.habacus.app`
and the login/signup fields already set `autoComplete`, which Android maps to
autofill hints.
