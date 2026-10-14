# Goal
Diagnose Diligence Live's website framing capability on `/ai-build-sprint`, verify origin security headers, enable consistent Live/Snapshot toggle interaction across all projects, and ensure truthful, elegant display of framing status with fallback to genuine 1280x800 desktop snapshot and direct link.

# Target Files
- `app/ai-build-sprint/_components/ProjectShowcase.tsx` (To be modified)
- `prompts/diagnose-fix-diligence-live-preview.md` (Created)

# Requirements
- Inspect Diligence Live (`https://www.diligencelive.com/`) HTTP response headers (`X-Frame-Options: DENY`).
- Verify whether the target site permits iframe embedding or strictly blocks it.
- Ensure the Live/Snapshot toggle is accessible and functional for every project.
- In Live mode for Diligence Live: if the browser blocks the iframe due to `X-Frame-Options: DENY`, present an honest, polished banner explaining the origin security policy, with a 1-click button to view the verified 1280x800 snapshot and an external link button to open the live site in a new tab.
- In Snapshot mode for Diligence Live: render the authentic 1280x800 desktop screenshot.
- Maintain the fixed 1280x800 desktop layout and uniform scaling for all projects.
- Preserve the active status badge and metadata labels truthfully.
- Do not modify other routes (`/`, `/build-software-with-ai`), checkout, or backend APIs.

# Acceptance Criteria
- Diligence Live has an accessible Live/Snapshot toggle just like TicketLelo, KBG, and Sherhan.
- Switching to Snapshot displays the genuine 1280x800 desktop snapshot.
- Switching to Live truthfully attempts the live embed or communicates origin framing restrictions clearly without showing an unhelpful blank iframe or pretending a snapshot is live.
- The external website link (`Open full website` / `Open diligencelive.com ↗`) works seamlessly.
- TicketLelo, KBG Advisory, and Sherhan Portfolio continue to work with live embeds and snapshots in 1280x800 desktop mode.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Automated tests pass (`npm test`)
- [ ] Production build succeeds (`npm run build`)

# Manual Testing Steps
1. Navigate to `http://localhost:3000/ai-build-sprint#showcase`.
2. Select Diligence Live.
3. Test toggling between "Snapshot" and "Live" modes.
4. Verify that Snapshot renders the authentic 1280x800 desktop screenshot.
5. Verify that Live mode either renders the live website or clearly and honestly indicates the origin framing restriction with the direct external link.
6. Select TicketLelo, KBG, and Sherhan, and verify both Live and Snapshot modes work as expected.
