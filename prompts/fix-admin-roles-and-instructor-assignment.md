# Goal

Fix and harden the existing role-based access control (RBAC), granular permissions, and dynamic Lead Instructor assignment in VibeLogic Studio without altering the visual design, payment flows, or system architecture.

# Target Files

- `convex/auth_helpers.ts` (To be modified)
- `convex/admin.ts` (To be modified)
- `convex/payments_admin.ts` (To be modified)
- `app/admin/layout.tsx` (To be modified)
- `components/admin/AdminSidebar.tsx` (To be modified)
- `components/admin/settings/BatchSettingsGeneral.tsx` (To be modified)
- `components/admin/settings/BatchSettingsToolbar.tsx` (To be modified)
- `app/admin/batches/[batchId]/settings/page.tsx` (To be modified)
- `app/admin/students/page.tsx` (To be modified)
- `lib/permissions.ts` (To be created)

# Requirements

- **Admin Panel Access**: Update `app/admin/layout.tsx` to allow `admin`, `superadmin`, `instructor`, and `staff` (or users with administrative permissions) to access `/admin/*`. Students without admin permissions are redirected to `/dashboard`.
- **Permission-Aware Navigation**: Update `components/admin/AdminSidebar.tsx` to conditionally display navigation links according to user role and granular permissions (`courses:write`, `payments:read`, `users:write`, `settings:write`).
- **Direct Route Protection**: Enforce route-level authorization so direct URL navigation to restricted pages (e.g. `/admin/payments`, `/admin/analytics`, `/admin/students`) is blocked and safely redirected if the user lacks the required permission.
- **Server-Side Operation Authorization**: Enforce permission checks in Convex backend queries and mutations (`auth_helpers.ts`, `admin.ts`, `payments_admin.ts`) matching the user's role and permissions.
- **Dynamic Lead Instructor Selection**: Replace hard-coded names ("Marcus Krenn", "Alex D'Souza", etc.) in `BatchSettingsGeneral.tsx` and batch settings with a dynamic query (`api.admin.getEligibleInstructors`) fetching real application users with instructor/admin roles.
- **User Management & Promotion Visibility**: Update `getAllStudents` query in `convex/admin.ts` to include all system users regardless of role so admins can view, search, and manage roles for any user.
- **Persistence & Revalidation**: Ensure role and permission updates via `updateStudentEnterprise` take immediate effect reactively without requiring manual database or session overrides.
- **Design & Flow Safety**: Preserve existing UI design tokens, off-white/orange aesthetics, payment flows, checkout logic, and student dashboard experience intact.

# Acceptance Criteria

- `admin`, `superadmin`, `instructor`, and `staff` users can log in and enter `/admin`.
- `student` users are redirected away from `/admin` to `/dashboard`.
- Admin sidebar items only appear if the user holds the required role or permission.
- Direct browser navigation to an unauthorized `/admin` sub-path redirects safely to `/admin/dashboard`.
- Server mutations/queries enforce permission rules and reject unauthorized attempts.
- Lead Instructor dropdown in Batch Settings dynamically lists real database users (instructors/admins) and saves/persists selections correctly.
- Admin dashboard and Student directory display all users for role promotion.
- Production build (`npm run build`), TypeScript (`npx tsc --noEmit`), and linting pass with zero errors.

# Validation & Checks

- [ ] `npx tsc --noEmit` passes cleanly
- [ ] `npm run lint` passes cleanly
- [ ] `npm run build` passes cleanly
- [ ] Convex backend changes deployed / validated

# Manual Testing Steps

1. Sign in as Admin (`adilmohdofficial@gmail.com`) and open `/admin/students`.
2. Select a user and promote them to `Instructor` or `Staff` with specific permissions (e.g., `courses:write` only).
3. Verify the role change persists and the user remains visible in the directory.
4. Sign in as the newly promoted `Instructor` or `Staff` user and verify access to `/admin`.
5. Verify sidebar shows only permitted items (e.g., Courses & Batches, but not Payments or Settings).
6. Attempt direct URL navigation to `/admin/payments` as `Instructor` and verify redirection to `/admin/dashboard`.
7. Navigate to Admin → Batches → [Batch] → Settings → Lead Instructor & Mentor.
8. Verify dropdown dynamically displays real instructors/admins instead of hard-coded mock names.
9. Select a real instructor, save batch settings, and refresh the page to verify persistence.
