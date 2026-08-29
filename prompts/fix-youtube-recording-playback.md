# Goal
Fix YouTube recording playback end-to-end so that administrators can paste standard YouTube share URLs, recordings are normalized with canonical video IDs in the database, and students can watch embedded 16:9 YouTube videos inside the LMS without runtime exceptions or external redirects.

# Target Files
- `lib/youtube.ts` (To be updated)
- `convex/admin.ts` (To be updated)
- `convex/student.ts` (To be updated)
- `lib/student-service.ts` (To be updated)
- `components/dashboard/RecordingPlayerClient.tsx` (To be updated)
- `components/dashboard/CourseRecordingsClient.tsx` (To be updated)
- `components/dashboard/WatchRecordingButton.tsx` (To be updated)
- `components/admin/UploadBatchRecordingModal.tsx` (To be updated)
- `components/admin/ConnectYouTubeModal.tsx` (To be updated)
- `components/admin/ReplaceRecordingModal.tsx` (To be updated)

# Requirements
- Robust YouTube parser supporting all share links (`youtu.be/...`, `youtube.com/watch?v=...`, `youtube.com/live/...`, `youtube.com/shorts/...`, `youtube.com/embed/...`, raw IDs, iframe embeds) with query parameters stripped.
- Canonical database storage (`youtubeVideoId`, `videoSource: "YouTube"`, embed `recordingUrl`).
- Backwards compatibility for legacy recordings without requiring re-upload.
- Embedded responsive 16:9 player on student watch page (`/dashboard/courses/[batchId]/recordings/[recordingId]`).
- Elimination of runtime exceptions causing `"Something went wrong. An unexpected issue occurred while rendering this view."`.
- Attendance and watch tracking preservation (`markSessionAttendance` with `recording_watch`).
- Graceful error states ("Video unavailable", embedding disabled) instead of application crashes.

# Acceptance Criteria
- [ ] Admin can paste `https://youtu.be/fvSM3UWwZTQ?si=3E7CQfstyHyZDq0` and save successfully.
- [ ] Recording appears in student dashboard with derived thumbnail.
- [ ] Clicking "Watch" navigates to `/dashboard/courses/[batchId]/recordings/[recordingId]`.
- [ ] Video plays embedded directly inside the webpage (16:9).
- [ ] Refreshing the watch page works cleanly.
- [ ] No external redirects to YouTube.
- [ ] Legacy and invalid URLs do not crash the view.

# Validation & Checks
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)

# Manual Testing Steps
1. Navigate to `/admin/batches/[batchId]/recordings` and publish a recording with `https://youtu.be/fvSM3UWwZTQ?si=3E7CQfstyHyZDq0`.
2. Navigate to `/dashboard/courses/[batchId]/recordings` as student/admin.
3. Click "Watch" and verify internal player embedded playback.
4. Refresh the page to verify persistence.
