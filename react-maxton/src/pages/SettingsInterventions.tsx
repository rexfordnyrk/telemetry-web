import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import DataTableWrapper from "../components/DataTableWrapper";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { implementingPartnerService } from "../services/implementingPartnerService";
import { interventionService } from "../services/interventionService";
import type {
  ImplementingPartnerRecord,
  InterventionRecord,
} from "../types/settings";

type InterventionFormState = {
  name: string;
  description: string;
  implementingPartnerId: string;
  externalId: string;
};

const SettingsInterventions: React.FC = () => {
  const dispatch = useAppDispatch();

  const [partners, setPartners] = useState<ImplementingPartnerRecord[]>([]);
  const [interventions, setInterventions] = useState<InterventionRecord[]>([]);

  const [partnersLoading, setPartnersLoading] = useState(false);
  const [interventionsLoading, setInterventionsLoading] = useState(false);

  const [partnersError, setPartnersError] = useState<string | null>(null);
  const [interventionsError, setInterventionsError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<InterventionFormState>({
    name: "",
    description: "",
    implementingPartnerId: "",
    externalId: "",
  });

  // Edit/Delete state management
  const [editingIntervention, setEditingIntervention] = useState<InterventionRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InterventionRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const partnerById = useMemo(() => new Map(partners.map((partner) => [partner.id, partner] as const)), [partners]);

  const loadPartners = useCallback(async () => {
    setPartnersLoading(true);
    setPartnersError(null);
    try {
      const response = await implementingPartnerService.list();
      setPartners(response.data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load partners.";
      setPartnersError(message);
    } finally {
      setPartnersLoading(false);
    }
  }, []);

  const loadInterventions = useCallback(async () => {
    setInterventionsLoading(true);
    setInterventionsError(null);
    try {
      const response = await interventionService.list();
      setInterventions(response.data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load interventions.";
      setInterventionsError(message);
    } finally {
      setInterventionsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPartners();
    void loadInterventions();
  }, [loadPartners, loadInterventions]);


  useEffect(() => {
    if (partners.length === 0) {
      setFormState((prev) => ({ ...prev, implementingPartnerId: "" }));
      return;
    }
    setFormState((prev) => {
      if (!prev.implementingPartnerId || !partners.some((partner) => partner.id === prev.implementingPartnerId)) {
        return { ...prev, implementingPartnerId: partners[0].id };
      }
      return prev;
    });
  }, [partners]);

  const tableData = useMemo(
    () =>
      interventions.map((intervention) => {
        const partnerRecord = intervention.implementing_partner ?? partnerById.get(intervention.implementing_partner_id);
        return {
          id: intervention.id,
          name: intervention.name,
          description: intervention.description ? intervention.description : "-",
          shortDescription:
            intervention.description && intervention.description.length > 160
              ? `${intervention.description.slice(0, 160)}...`
              : intervention.description || "-",
          partnerName: partnerRecord ? partnerRecord.name : "Unknown",
          externalId: intervention.external_id ?? "-",
          createdAt: intervention.created_at ? new Date(intervention.created_at).toLocaleString() : "-",
          updatedAt: intervention.updated_at ? new Date(intervention.updated_at).toLocaleString() : "-",
        };
      }),
    [interventions, partnerById],
  );

  const columns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "Intervention Name", data: "name" },
      { title: "Implementing Partner", data: "partnerName" },
      { title: "Description", data: "shortDescription" },
      { title: "External ID", data: "externalId" },
      { title: "Created At", data: "createdAt" },
      { title: "Updated At", data: "updatedAt" },
      {
        title: "Actions",
        data: null,
        orderable: false,
        searchable: false,
        render: (_: any, __: any, row: any) => {
          return `
            <div class="d-flex gap-1">
              <button class="btn btn-sm p-1" title="Edit Intervention" data-action="edit" data-id="${row.id}" style="border:none;background:transparent;">
                <i class="material-icons-outlined text-primary">edit</i>
              </button>
              <button class="btn btn-sm p-1" title="Delete Intervention" data-action="delete" data-id="${row.id}" style="border:none;background:transparent;">
                <i class="material-icons-outlined text-danger">delete</i>
              </button>
            </div>`;
        }
      },
    ],
    [],
  );

  const tableOptions = useMemo(
    () => ({
      columns,
      pageLength: 10,
      autoWidth: false,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: true,
    }),
    [columns],
  );

  const validateForm = (state: InterventionFormState) => {
    if (!state.name.trim()) return "Intervention name is required.";
    if (!state.implementingPartnerId) return "Implementing partner selection is required.";
    return null;
  };

  const openModal = useCallback((intervention?: InterventionRecord) => {
    if (intervention) {
      setEditingIntervention(intervention);
      setFormState({
        name: intervention.name,
        description: intervention.description ?? "",
        implementingPartnerId: intervention.implementing_partner_id,
        externalId: intervention.external_id?.toString() ?? "",
      });
    } else {
      setEditingIntervention(null);
      const defaultPartnerId = partners[0]?.id ?? "";
      setFormState({
        name: "",
        description: "",
        implementingPartnerId: defaultPartnerId,
        externalId: "",
      });
    }
    setFormError(null);
    setIsSubmitting(false);
    setShowModal(true);
  }, [partners]);

  const closeModal = () => {
    setShowModal(false);
    setIsSubmitting(false);
    setEditingIntervention(null);
  };

  const handleActionClick = useCallback((action: string, id: string) => {
    if (action === "edit") {
      const intervention = interventions.find(i => i.id === id);
      if (intervention) {
        openModal(intervention);
      }
    } else if (action === "delete") {
      const intervention = interventions.find(i => i.id === id);
      if (intervention) {
        setDeleteTarget(intervention);
        setShowDeleteModal(true);
      }
    }
  }, [interventions, openModal]);

  // Event delegation for action buttons
  useEffect(() => {
    if (!window.$) return;
    const $table = window.$('#interventions-datatable');
    if ($table.length === 0) return;

    const onEdit = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      if (id) handleActionClick('edit', id);
    };
    const onDelete = (e: any) => {
      e.preventDefault();
      const id = window.$(e.currentTarget).data('id');
      if (id) handleActionClick('delete', id);
    };

    $table.off('.dtActions');
    $table.on('click.dtActions', 'button[data-action="edit"]', onEdit);
    $table.on('click.dtActions', 'button[data-action="delete"]', onDelete);

    return () => {
      if ($table && $table.off) $table.off('.dtActions');
    };
  }, [handleActionClick]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleteSubmitting(true);
    setDeleteError(null);

    try {
      await interventionService.remove(deleteTarget.id);
      setInterventions(prev => prev.filter(i => i.id !== deleteTarget.id));
      dispatch(addAlert({
        type: "success",
        title: "Success",
        message: `Intervention "${deleteTarget.name}" deleted successfully.`,
      }));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete intervention.";
      setDeleteError(message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    const validationError = validateForm(formState);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const trimmedName = formState.name.trim();
    const trimmedDescription = formState.description.trim();
    const trimmedExternalId = formState.externalId.trim();

    if (!partnerById.get(formState.implementingPartnerId)) {
      setFormError("Selected implementing partner is not available.");
      return;
    }

    let externalIdValue: number | undefined;
    if (trimmedExternalId) {
      const parsedExternalId = Number(trimmedExternalId);
      if (!Number.isFinite(parsedExternalId)) {
        setFormError("External ID must be a valid number.");
        return;
      }
      externalIdValue = parsedExternalId;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: trimmedName,
        implementing_partner_id: formState.implementingPartnerId,
        description: trimmedDescription ? trimmedDescription : undefined,
        ...(externalIdValue !== undefined ? { external_id: externalIdValue } : {}),
      };

      if (editingIntervention) {
        // Update existing intervention
        const response = await interventionService.update(editingIntervention.id, payload);
        if (response.data) {
          setInterventions((prev) => prev.map(i => i.id === editingIntervention.id ? response.data : i));
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: response.message ?? `Intervention "${response.data.name}" updated successfully.`,
            }),
          );
          setShowModal(false);
        }
      } else {
        // Create new intervention
        const response = await interventionService.create(payload);
        if (response.data) {
          setInterventions((prev) => [...prev, response.data]);
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: response.message ?? `Intervention "${response.data.name}" created successfully.`,
            }),
          );
          setShowModal(false);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 
        editingIntervention ? "Failed to update intervention." : "Failed to create intervention.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addButtonDisabled = partners.length === 0;

  return (
    <MainLayout>
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Settings</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="bx bx-home-alt"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">Settings</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Interventions
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-grd-primary px-4"
              onClick={() => openModal()}
              disabled={addButtonDisabled}
            >
              <i className="material-icons-outlined me-1">add</i>
              Add Intervention
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Interventions</h6>
        </div>
        <hr />

        <div className="card">
          <div className="card-body">
            {interventionsError && <div className="alert alert-danger">{interventionsError}</div>}
            {partnersError && <div className="alert alert-warning mb-3">{partnersError}</div>}
            {(interventionsLoading || partnersLoading) && (
              <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                <Spinner animation="border" size="sm" />
                <span>Loading interventions...</span>
              </div>
            )}
            {partners.length === 0 && !partnersLoading && (
              <div className="alert alert-info">Add implementing partners before creating interventions.</div>
            )}
            {!interventionsLoading && interventions.length === 0 && (
              <div className="alert alert-info">No interventions found. Add a new intervention to get started.</div>
            )}
            <div className="table-responsive">
              <DataTableWrapper
                id="interventions-datatable"
                data={tableData}
                options={tableOptions}
                className="table table-striped table-bordered w-100"
              />
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingIntervention ? "Edit Intervention" : "Add Intervention"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <Form.Group className="mb-3" controlId="interventionName">
              <Form.Label>Intervention Name</Form.Label>
              <Form.Control
                type="text"
                value={formState.name}
                placeholder="Enter intervention name"
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="implementingPartner">
              <Form.Label>Implementing Partner</Form.Label>
              <Form.Select
                value={formState.implementingPartnerId}
                onChange={(event) => setFormState((prev) => ({ ...prev, implementingPartnerId: event.target.value }))}
                disabled={partners.length === 0}
              >
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="interventionDescription">
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formState.description}
                placeholder="Provide a detailed description"
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="interventionExternalId">
              <Form.Label>External ID (optional)</Form.Label>
              <Form.Control
                type="text"
                value={formState.externalId}
                placeholder="Enter external ID"
                onChange={(event) => setFormState((prev) => ({ ...prev, externalId: event.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-grd-primary px-4"
              disabled={isSubmitting || partners.length === 0}
            >
              {isSubmitting 
                ? "Saving..." 
                : editingIntervention ? "Update Intervention" : "Add Intervention"
              }
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <div className="alert alert-danger">{deleteError}</div>}
          <p>
            Are you sure you want to delete this intervention?
          </p>
          <p className="mb-0">
            <strong>{deleteTarget?.name}</strong>
          </p>
          <p className="text-muted small mt-2">
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={handleDeleteCancel}
            disabled={deleteSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteConfirm}
            disabled={deleteSubmitting}
          >
            {deleteSubmitting ? "Deleting..." : "Delete"}
          </button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
};

export default SettingsInterventions;
