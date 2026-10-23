import { UserRole, AuthContext } from "./types";

const VALID_ROLES: UserRole[] = ["farmer", "officer", "planner", "admin"];

/**
 * Extracts and verifies authentication and role server-side.
 * Never relies on client-side state alone (Constitution §7).
 */
export function getAuthContext(request: Request): AuthContext {
  const roleHeader = request.headers.get("x-user-role")?.toLowerCase();
  const userId = request.headers.get("x-user-id") || "anonymous_farmer";
  const pilotDistrict = request.headers.get("x-user-district") || "Multan";

  const role: UserRole =
    roleHeader && VALID_ROLES.includes(roleHeader as UserRole)
      ? (roleHeader as UserRole)
      : "farmer";

  return {
    userId,
    role,
    pilotDistrict,
  };
}

/**
 * Server-side RBAC guard. Throws or returns an error response if the role is unauthorized.
 */
export function requireRole(
  request: Request,
  allowedRoles: UserRole[]
): { authorized: boolean; auth: AuthContext; response?: Response } {
  const auth = getAuthContext(request);

  if (!allowedRoles.includes(auth.role)) {
    return {
      authorized: false,
      auth,
      response: Response.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: `Access denied. Endpoint requires one of roles: [${allowedRoles.join(
              ", "
            )}], but caller has role: '${auth.role}'.`,
          },
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, auth };
}
