export type SystemRole = "admin" | "superadmin" | "instructor" | "staff" | "student" | string;

export type GranularPermission =
  | "courses:write"
  | "payments:read"
  | "users:write"
  | "settings:write";

export interface UserPermissionProfile {
  role?: string;
  permissions?: string[];
}

/**
 * Determines whether a user has baseline access to the Admin panel (/admin/*).
 * Admin, Superadmin, Instructor, and Staff roles or users with non-empty permissions are allowed.
 */
export function hasAdminAccess(user: UserPermissionProfile | null | undefined): boolean {
  if (!user || !user.role) return false;
  const role = user.role.toLowerCase();
  
  if (role === "admin" || role === "superadmin" || role === "instructor" || role === "staff") {
    return true;
  }
  
  return Array.isArray(user.permissions) && user.permissions.length > 0;
}

/**
 * Checks whether a user has a specific granular permission or implicit admin role entitlement.
 */
export function hasPermission(
  user: UserPermissionProfile | null | undefined,
  permission: GranularPermission
): boolean {
  if (!user || !user.role) return false;
  const role = user.role.toLowerCase();

  // Admins & Superadmins implicitly hold all permissions
  if (role === "admin" || role === "superadmin") {
    return true;
  }

  // Check explicit permissions array first
  if (Array.isArray(user.permissions) && user.permissions.includes(permission)) {
    return true;
  }

  // Fallback to role-default entitlements if explicit permissions array is empty or undefined
  if (!user.permissions || user.permissions.length === 0) {
    switch (role) {
      case "instructor":
        // Instructors can manage courses, batches, announcements, reviews
        return permission === "courses:write";
      case "staff":
        // Staff can manage users, courses/batches support
        return permission === "users:write" || permission === "courses:write";
      default:
        return false;
    }
  }

  return false;
}
