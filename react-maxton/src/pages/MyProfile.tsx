import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchUserById,
  updateUserAsync,
  type User,
} from "../store/slices/userSlice";
import { addAlert } from "../store/slices/alertSlice";
import { usePermissions } from "../hooks/usePermissions";
import { escapeHtml } from "../utils/escapeHtml";
import { validateSelfProfileUpdate } from "../utils/userValidation";

/**
 * MyProfile is the self-service profile page reachable from the navbar.
 *
 * It loads the authenticated user's full record and exposes:
 *  - the full system record as read-only fields (email, username, roles,
 *    organization, designation, status, created_at, updated_at)
 *  - an inline editor for first_name, last_name, phone, photo that is gated
 *    on the update_own_profile permission and persisted via updateUserAsync
 *  - quick links to the existing Security Settings page for password and MFA
 *
 * Backend guarantees: UpdateUser whitelists exactly these four fields when
 * the caller equals the target and has update_own_profile (see §7.4 Phase 3
 * backend guards). The form mirrors that whitelist so the server never sees
 * fields it would silently drop.
 */
const MyProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermissions();
  const authUser = useAppSelector((state) => state.auth.user);
  const users = useAppSelector((state) => state.users.users);
  const selectedUser = useAppSelector((state) => state.users.selectedUser);
  const loading = useAppSelector((state) => state.users.userDetailsLoading);
  const error = useAppSelector((state) => state.users.error);

  const user: User | undefined = useMemo(() => {
    if (!authUser?.id) return undefined;
    if (selectedUser && selectedUser.id === authUser.id) return selectedUser;
    return users.find((u) => u.id === authUser.id);
  }, [authUser?.id, selectedUser, users]);

  // Fetch the full user record once on mount (or when the auth user changes).
  useEffect(() => {
    if (authUser?.id && (!user || !user.email)) {
      dispatch(fetchUserById(authUser.id));
    }
  }, [authUser?.id, user, dispatch]);

  const canEditSelf = hasPermission("update_own_profile");

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        phone: user.phone ?? "",
      });
      setPhotoPreview(user.photo ?? null);
    }
  }, [user]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        phone: user.phone ?? "",
      });
      setPhotoPreview(user.photo ?? null);
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !canEditSelf || submitting) return;

    // Client mirror of backend ValidateSelfProfileUpdate.
    const localErrs = validateSelfProfileUpdate({
      firstName: formData.first_name,
      lastName: formData.last_name,
      phone: formData.phone,
    });
    if (Object.keys(localErrs).length > 0) {
      setFieldErrors(localErrs);
      return;
    }
    setFieldErrors({});

    const payload: Partial<User> = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.trim(),
    };
    if (photoPreview && photoPreview !== user.photo) {
      (payload as any).photo = photoPreview;
    }

    setSubmitting(true);
    try {
      await dispatch(updateUserAsync({ id: user.id, userData: payload })).unwrap();
      dispatch(
        addAlert({
          type: "success",
          title: "Profile Updated",
          message: "Your profile has been saved.",
        }),
      );
      setIsEditing(false);
    } catch (err) {
      dispatch(
        addAlert({
          type: "danger",
          title: "Update Failed",
          message:
            err instanceof Error ? err.message : "Failed to update profile.",
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !user) {
    return (
      <MainLayout>
        <div className="page-content py-5 text-center">
          <span className="spinner-border text-primary" role="status" aria-hidden="true" />
          <p className="mt-2 text-muted">Loading your profile…</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="page-content py-5">
          <div className="alert alert-danger">
            {error || "Unable to load your profile."}
          </div>
        </div>
      </MainLayout>
    );
  }

  const displayName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "—";
  const initials = `${(user.first_name?.[0] ?? "").toUpperCase()}${(user.last_name?.[0] ?? "").toUpperCase()}`;
  const statusBadgeClass: Record<string, string> = {
    active: "bg-success",
    disabled: "bg-danger",
    pending: "bg-warning text-dark",
  };

  return (
    <MainLayout>
      <div className="page-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">My Account</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  My Profile
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className="card rounded-4 mb-3 overflow-hidden">
          <div className="card-body p-4">
            <div className="d-flex flex-wrap align-items-center gap-3">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt=""
                  className="rounded-circle border"
                  width={84}
                  height={84}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 84, height: 84, fontSize: 28 }}
                  aria-hidden="true"
                >
                  {initials || "?"}
                </div>
              )}
              <div className="flex-grow-1 min-w-0">
                <h4
                  className="mb-1 fw-bold"
                  dangerouslySetInnerHTML={{ __html: escapeHtml(displayName) }}
                />
                <p
                  className="mb-1 text-muted"
                  dangerouslySetInnerHTML={{
                    __html:
                      [escapeHtml(user.designation ?? ""), escapeHtml(user.organization ?? "")]
                        .filter(Boolean)
                        .join(" · ") || "—",
                  }}
                />
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <span
                    className={`badge ${statusBadgeClass[user.status ?? ""] || "bg-secondary"}`}
                  >
                    {user.status ?? "unknown"}
                  </span>
                  {Array.isArray(user.roles) &&
                    user.roles.map((r) => (
                      <span key={r.id} className="badge bg-light text-dark border">
                        {r.name}
                      </span>
                    ))}
                </div>
              </div>
              {!isEditing && canEditSelf && (
                <button
                  type="button"
                  className="btn btn-grd-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="material-icons-outlined me-1">edit</i>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Permission banner */}
        {!canEditSelf && (
          <div className="alert alert-info" role="status">
            Profile editing is disabled for your account. Contact an
            administrator if you need to update your details.
          </div>
        )}

        {/* Profile details */}
        <div className="card rounded-4 mb-3">
          <div className="card-body p-4">
            <h6 className="text-uppercase mb-3">Profile Details</h6>
            <form id="my-profile-form" className="row g-3" onSubmit={handleSubmit}>
              {/* Editable fields */}
              <div className="col-md-6">
                <label htmlFor="myprofile-first-name" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="myprofile-first-name"
                  name="first_name"
                  className={`form-control ${fieldErrors.first_name ? "is-invalid" : ""}`}
                  value={formData.first_name}
                  onChange={handleFieldChange}
                  disabled={!isEditing || submitting}
                  maxLength={100}
                />
                {fieldErrors.first_name && (
                  <div className="invalid-feedback">{fieldErrors.first_name}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="myprofile-last-name" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="myprofile-last-name"
                  name="last_name"
                  className={`form-control ${fieldErrors.last_name ? "is-invalid" : ""}`}
                  value={formData.last_name}
                  onChange={handleFieldChange}
                  disabled={!isEditing || submitting}
                  maxLength={100}
                />
                {fieldErrors.last_name && (
                  <div className="invalid-feedback">{fieldErrors.last_name}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="myprofile-phone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="myprofile-phone"
                  name="phone"
                  className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`}
                  value={formData.phone}
                  onChange={handleFieldChange}
                  disabled={!isEditing || submitting}
                  maxLength={30}
                />
                {fieldErrors.phone && (
                  <div className="invalid-feedback">{fieldErrors.phone}</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="myprofile-photo" className="form-label">
                  Profile Photo
                </label>
                <input
                  type="file"
                  id="myprofile-photo"
                  className="form-control"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={!isEditing || submitting}
                />
              </div>

              {/* Read-only fields */}
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={user.email ?? ""} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" value={user.username ?? ""} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Designation</label>
                <input type="text" className="form-control" value={user.designation ?? ""} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Organization</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.organization ?? ""}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <input type="text" className="form-control" value={user.status ?? ""} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Member Since</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.created_at ? new Date(user.created_at).toLocaleString() : ""}
                  disabled
                />
              </div>

              {isEditing && (
                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-grd-primary"
                    disabled={submitting || !canEditSelf}
                  >
                    {submitting ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Security shortcut */}
        <div className="card rounded-4">
          <div className="card-body p-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <h6 className="text-uppercase mb-1">Security</h6>
              <p className="text-muted small mb-0">
                Change your password, manage email OTP, and enrol an authenticator app.
              </p>
            </div>
            <Link to="/profile/security" className="btn btn-outline-primary">
              Open Security Settings
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyProfile;
