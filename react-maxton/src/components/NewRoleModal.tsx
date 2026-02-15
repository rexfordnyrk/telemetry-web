import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createRole, updateRole, Role } from "../store/slices/rolesPermissionsSlice";
import { addAlert } from "../store/slices/alertSlice";

interface NewRoleModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editRole?: Role | null; // If provided, modal is in edit mode
}

const NewRoleModal: React.FC<NewRoleModalProps> = ({ show, onClose, onSuccess, editRole }) => {
  const dispatch = useAppDispatch();
  const { createLoading, updateLoading, rolesError } = useAppSelector(
    (state) => state.rolesPermissions
  );

  const isEditMode = !!editRole;
  const loading = isEditMode ? updateLoading : createLoading;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Populate form with edit data when editing
  useEffect(() => {
    if (editRole) {
      setFormData({
        name: editRole.name || "",
        description: editRole.description || "",
      });
    } else {
      handleReset();
    }
  }, [editRole, show]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Role name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Role name must be at least 2 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.name)) {
      errors.name = "Role name can only contain letters, numbers, underscores, and hyphens";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prevent multiple submissions
    if (loading) {
      return;
    }

    try {
      if (isEditMode && editRole) {
        // Update existing role
        await dispatch(
          updateRole({
            id: editRole.id,
            roleData: {
              name: formData.name,
              description: formData.description || undefined,
            },
          })
        ).unwrap();

        dispatch(
          addAlert({
            type: "success",
            title: "Success",
            message: `Role "${formData.name}" has been updated successfully!`,
          })
        );
      } else {
        // Create new role
        await dispatch(
          createRole({
            name: formData.name,
            description: formData.description || undefined,
          })
        ).unwrap();

        dispatch(
          addAlert({
            type: "success",
            title: "Success",
            message: `Role "${formData.name}" has been created successfully!`,
          })
        );
      }

      // Reset form and close modal
      handleReset();
      onClose();
      onSuccess?.();
    } catch (error) {
      // Error is already handled by the Redux slice
      console.error("Error saving role:", error);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
    });
    setValidationErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-top border-3 border-info"
          style={{ borderRadius: 0 }}
        >
          <div className="modal-header border-bottom-0 py-2">
            <h5 className="modal-title">
              {isEditMode ? "Edit Role" : "Create New Role"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            <div className="form-body">
              {/* Error Alert */}
              {rolesError && (
                <div
                  className="alert alert-danger alert-dismissible fade show mb-3"
                  role="alert"
                >
                  <strong>Error:</strong> {rolesError}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      dispatch({ type: "rolesPermissions/clearRolesError" })
                    }
                  ></button>
                </div>
              )}

              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-12">
                  <label htmlFor="name" className="form-label">
                    Role Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${validationErrors.name ? "is-invalid" : ""}`}
                    id="name"
                    name="name"
                    placeholder="e.g., admin, manager, viewer"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {validationErrors.name && (
                    <div className="invalid-feedback">{validationErrors.name}</div>
                  )}
                  <small className="text-muted">
                    Only letters, numbers, underscores, and hyphens allowed
                  </small>
                </div>

                <div className="col-md-12">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    placeholder="Brief description of what this role can do"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="col-md-12">
                  <div className="d-md-flex d-grid align-items-center gap-3">
                    <button
                      type="submit"
                      className="btn btn-grd-primary px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {isEditMode ? "Updating..." : "Creating..."}
                        </>
                      ) : isEditMode ? (
                        "Update Role"
                      ) : (
                        "Create Role"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-grd-info px-4"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoleModal;
