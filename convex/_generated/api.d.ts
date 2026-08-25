/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as admin_setup from "../admin_setup.js";
import type * as analytics_admin from "../analytics_admin.js";
import type * as auth_helpers from "../auth_helpers.js";
import type * as courses from "../courses.js";
import type * as metrics from "../metrics.js";
import type * as payments from "../payments.js";
import type * as payments_admin from "../payments_admin.js";
import type * as reviews_admin from "../reviews_admin.js";
import type * as seed from "../seed.js";
import type * as student from "../student.js";
import type * as student_auth from "../student_auth.js";
import type * as students from "../students.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  admin_setup: typeof admin_setup;
  analytics_admin: typeof analytics_admin;
  auth_helpers: typeof auth_helpers;
  courses: typeof courses;
  metrics: typeof metrics;
  payments: typeof payments;
  payments_admin: typeof payments_admin;
  reviews_admin: typeof reviews_admin;
  seed: typeof seed;
  student: typeof student;
  student_auth: typeof student_auth;
  students: typeof students;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
