# Roles & Permissions API

API documentation for the **Roles** and **Permissions** endpoints, plus related **user role/permission** operations. For frontend implementation.

**Base URL:** `{BASE_URL}/api/v1`

**Authentication:** All endpoints require a valid JWT. Send it in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

**Content-Type:** `application/json` for request bodies unless noted.

---

## Table of contents

1. [Roles](#roles)
2. [Permissions](#permissions)
3. [User roles & permissions](#user-roles--permissions)
4. [Data types](#data-types)
5. [Error responses](#error-responses)

---

## Roles

### Create role

Create a new role.

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/roles` |
| **Body** | [CreateRoleRequest](#createrolerequest) |

**Request body**

```json
{
  "name": "admin",
  "description": "Administrator role with full permissions"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique role name |
| `description` | string | No | Role description |

**Success response:** `201 Created`

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "name": "admin",
    "description": "Administrator role with full permissions"
  }
}
```

**Error responses:** `400` (validation), `401` (unauthorized), `500` (server error).

---

### List roles

Get a paginated list of roles.

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/roles` |
| **Query** | `page`, `limit` (optional) |

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | `1` | Page number (min 1) |
| `limit` | integer | `10` | Items per page (1–100) |

**Example:** `GET /roles?page=1&limit=10`

**Success response:** `200 OK`

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "name": "admin",
      "description": "Administrator role"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}
```

**Error responses:** `401`, `500`.

---

### Get role by ID

Get a single role by UUID.

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/roles/:id` |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | Role ID |

**Example:** `GET /roles/550e8400-e29b-41d4-a716-446655440001`

**Success response:** `200 OK`

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "name": "admin",
    "description": "Administrator role with full permissions"
  }
}
```

**Error responses:** `400` (invalid ID), `401`, `404` (role not found).

---

### Update role

Update a role’s name and/or description. Only sent fields are updated.

| | |
|---|---|
| **Method** | `PUT` |
| **Path** | `/roles/:id` |
| **Body** | [UpdateRoleRequest](#updaterolerequest) |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | Role ID |

**Request body**

```json
{
  "name": "super_admin",
  "description": "Super administrator role"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | New role name |
| `description` | string | No | New description |

**Success response:** `200 OK`

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "name": "super_admin",
    "description": "Super administrator role"
  }
}
```

**Error responses:** `400`, `401`, `404`, `500`.

---

### Delete role

Delete a role by ID.

| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/roles/:id` |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | Role ID |

**Success response:** `200 OK`

```json
{
  "message": "Role deleted successfully"
}
```

**Error responses:** `400`, `401`, `404`, `500`.

---

### Assign permission(s) to role

Attach one or more permissions to a role in one request. Send **either** `permission_id` (single UUID) **or** `permission_ids` (array of UUIDs); at least one must be provided. If both are sent, `permission_ids` takes precedence for determining how many are assigned.

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/roles/:id/permissions` |
| **Body** | [AssignPermissionRequest](#assignpermissionrequest) |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | Role ID |

**Request body (single)**

```json
{
  "permission_id": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Request body (multiple)**

```json
{
  "permission_ids": [
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `permission_id` | UUID | No* | Single permission ID |
| `permission_ids` | UUID[] | No* | Multiple permission IDs |

\* Either `permission_id` or `permission_ids` (non-empty) must be provided.

**400 error** when neither is provided: `"Either permission_id or permission_ids (non-empty) is required"`

**Success response:** `200 OK`

```json
{
  "message": "Permission assigned successfully"
}
```

For multiple: `"message": "2 permissions assigned successfully"` (number varies).

**Error responses:** `400`, `401`, `404` (one or more permissions not found), `500`.

---

### Remove permission from role (single, by path)

Detach **one** permission from a role. The permission ID is in the URL path; no request body. Use this when removing a single permission.

| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/roles/:id/permissions/:permission_id` |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | Role ID |
| `permission_id` | UUID | Permission ID |

**Example:** `DELETE /roles/550e8400-e29b-41d4-a716-446655440001/permissions/550e8400-e29b-41d4-a716-446655440002`

**Success response:** `200 OK`

```json
{
  "message": "Permission removed successfully"
}
```

**Error responses:** `400`, `401`, `404`, `500`.

---

### Remove permissions from role (bulk, by body)

Detach **multiple** permissions from a role in one request. Use `DELETE /roles/:id/permissions` **with a JSON body** (no `:permission_id` in the path). Use this when removing several permissions at once.

| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/roles/:id/permissions` |
| **Body** | [RemovePermissionsRequest](#removepermissionsrequest) |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | Role ID |

**Request body**

```json
{
  "permission_ids": [
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `permission_ids` | UUID[] | Yes | Permission IDs to remove (min 1) |

**Success response:** `200 OK`

```json
{
  "message": "2 permission(s) removed successfully"
}
```

**Error responses:** `400` (e.g. missing or empty `permission_ids`), `401`, `404` (one or more permissions not found), `500`.

---

## Permissions

Permissions are managed by migrations (seeded in the database). The API exposes **read-only** endpoints to list and fetch permissions for use in the UI (e.g. when assigning permissions to roles).

### List permissions

Get a paginated list of permissions.

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/permissions` |
| **Query** | `page`, `limit` (optional) |

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | `1` | Page number (min 1) |
| `limit` | integer | `10` | Items per page (1–100) |

**Example:** `GET /permissions?page=1&limit=20`

**Success response:** `200 OK`

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "name": "create_users",
      "description": "Permission to create new users"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

**Error responses:** `401`, `500`.

---

### Get permission by ID

Get a single permission by UUID.

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/permissions/:id` |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | Permission ID |

**Success response:** `200 OK`

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "name": "create_users",
    "description": "Permission to create new users"
  }
}
```

**Error responses:** `400`, `401`, `404`, `500`.

---

## User roles & permissions

These endpoints live under **Users** but are used to manage a user’s roles and to read their effective permissions.

### Assign role to user

Assign a role to a user (user can have multiple roles).

| | |
|---|---|
| **Method** | `POST` |
| **Path** | `/users/:id/roles` |
| **Body** | [AssignRoleRequest](#assignrolerequest) |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | User ID |

**Request body**

```json
{
  "role_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role_id` | UUID | Yes | Role ID to assign |

**Success response:** `200 OK`

```json
{
  "message": "Role assigned successfully"
}
```

**Error responses:** `400`, `401`, `404` (user or role not found), `500`.

---

### Remove role from user

Remove a role from a user.

| | |
|---|---|
| **Method** | `DELETE` |
| **Path** | `/users/:id/roles/:role_id` |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | User ID |
| `role_id` | UUID | Role ID to remove |

**Example:** `DELETE /users/550e8400-e29b-41d4-a716-446655440000/roles/550e8400-e29b-41d4-a716-446655440001`

**Success response:** `200 OK`

```json
{
  "message": "Role removed successfully"
}
```

**Error responses:** `400`, `401`, `404`, `500`.

---

### Get user permissions

Get all permission **names** effective for a user (from all their roles; direct user permissions if any are included). Useful for UI feature flags and client-side checks.

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/users/:id/permissions` |

**Path parameters**

| Param | Type | Description |
|-------|------|-------------|
| `id` | UUID | User ID |

**Success response:** `200 OK`

```json
{
  "data": [
    "create_users",
    "read_users",
    "update_users",
    "delete_users",
    "list_users",
    "create_roles",
    "read_roles"
  ]
}
```

`data` is an array of permission name strings. Use these to show/hide UI or call other APIs that enforce the same permission names.

**Error responses:** `400`, `401`, `500`.

---

## Data types

### Role (object)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Role ID |
| `created_at` | string (ISO 8601) | Creation time |
| `updated_at` | string (ISO 8601) | Last update time |
| `name` | string | Role name |
| `description` | string | Role description |

### Permission (object)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Permission ID |
| `created_at` | string (ISO 8601) | Creation time |
| `updated_at` | string (ISO 8601) | Last update time |
| `name` | string | Permission name (e.g. `create_users`) |
| `description` | string | Permission description |

### CreateRoleRequest

| Field | Type | Required |
|-------|------|----------|
| `name` | string | Yes |
| `description` | string | No |

### UpdateRoleRequest

| Field | Type | Required |
|-------|------|----------|
| `name` | string | No |
| `description` | string | No |

### AssignPermissionRequest

| Field | Type | Required |
|-------|------|----------|
| `permission_id` | UUID | No* |
| `permission_ids` | UUID[] | No* |

\* Either `permission_id` or `permission_ids` (non-empty) must be provided.

### RemovePermissionsRequest

| Field | Type | Required |
|-------|------|----------|
| `permission_ids` | UUID[] | Yes (min 1) |

### AssignRoleRequest

| Field | Type | Required |
|-------|------|----------|
| `role_id` | UUID | Yes |

---

## Error responses

Errors return JSON with an `error` message:

```json
{
  "error": "Human-readable error message"
}
```

| Status | Meaning |
|--------|--------|
| `400` | Bad request (e.g. invalid UUID, validation failure) |
| `401` | Unauthorized (missing or invalid JWT) |
| `403` | Forbidden (valid JWT but insufficient permissions) |
| `404` | Not found (role, permission, or user not found) |
| `409` | Conflict (e.g. duplicate name) |
| `500` | Internal server error |

Always send `Authorization: Bearer <token>` for these endpoints. Use the **Get user permissions** response to drive role/permission UI and to know which actions the current user is allowed to perform.
