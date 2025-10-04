import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import DataTableWrapper from "../components/DataTableWrapper";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { regionService } from "../services/regionService";
import { districtService } from "../services/districtService";
import { implementingPartnerService } from "../services/implementingPartnerService";
import type {
  DistrictRecord,
  ImplementingPartnerRecord,
  RegionRecord,
} from "../types/settings";

type PartnerFormState = {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  regionId: string;
  districtId: string;
  locality: string;
  externalId: string;
};

const SettingsPartners: React.FC = () => {
  const dispatch = useAppDispatch();

  const [partners, setPartners] = useState<ImplementingPartnerRecord[]>([]);
  const [regions, setRegions] = useState<RegionRecord[]>([]);
  const [districts, setDistricts] = useState<DistrictRecord[]>([]);

  const [partnersLoading, setPartnersLoading] = useState(false);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  const [partnersError, setPartnersError] = useState<string | null>(null);
  const [regionsError, setRegionsError] = useState<string | null>(null);
  const [districtsError, setDistrictsError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<PartnerFormState>({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    regionId: "",
    districtId: "",
    locality: "",
    externalId: "",
  });

  // Edit/Delete state management
  const [editingPartner, setEditingPartner] = useState<ImplementingPartnerRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ImplementingPartnerRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const regionById = useMemo(() => new Map(regions.map((region) => [region.id, region] as const)), [regions]);
  const districtById = useMemo(() => new Map(districts.map((district) => [district.id, district] as const)), [districts]);

  const loadRegions = useCallback(async () => {
    setRegionsLoading(true);
    setRegionsError(null);
    try {
      const response = await regionService.list();
      setRegions(response.data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load regions.";
      setRegionsError(message);
    } finally {
      setRegionsLoading(false);
    }
  }, []);

  const loadDistricts = useCallback(async () => {
    setDistrictsLoading(true);
    setDistrictsError(null);
    try {
      const response = await districtService.list();
      setDistricts(response.data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load districts.";
      setDistrictsError(message);
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

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

  useEffect(() => {
    void loadRegions();
    void loadDistricts();
    void loadPartners();
  }, [loadRegions, loadDistricts, loadPartners]);

  useEffect(() => {
    if (regions.length === 0) {
      setFormState((prev) => ({ ...prev, regionId: "", districtId: "" }));
      return;
    }

    setFormState((prev) => {
      const currentRegionExists = prev.regionId && regions.some((region) => region.id === prev.regionId);
      const nextRegionId = currentRegionExists ? prev.regionId : regions[0].id;
      const matchingDistricts = districts.filter((district) => district.region_id === nextRegionId);
      const currentDistrictExists = prev.districtId && matchingDistricts.some((district) => district.id === prev.districtId);
      const nextDistrictId = currentDistrictExists ? prev.districtId : matchingDistricts[0]?.id ?? "";
      return { ...prev, regionId: nextRegionId, districtId: nextDistrictId };
    });
  }, [regions, districts]);

  const filteredDistrictOptions = useMemo(() => {
    if (!formState.regionId) return [] as DistrictRecord[];
    return districts.filter((district) => district.region_id === formState.regionId);
  }, [districts, formState.regionId]);

  // Handle region changes - update district selection
  useEffect(() => {
    if (!formState.regionId) return;
    
    const availableDistricts = districts.filter((district) => district.region_id === formState.regionId);
    const currentDistrictExists = availableDistricts.some((district) => district.id === formState.districtId);
    
    if (!currentDistrictExists) {
      const newDistrictId = availableDistricts.length > 0 ? availableDistricts[0].id : "";
      setFormState((prev) => ({ ...prev, districtId: newDistrictId }));
    }
  }, [formState.regionId, formState.districtId, districts]);

  const openModal = useCallback((partner?: ImplementingPartnerRecord) => {
    if (partner) {
      setEditingPartner(partner);
      setFormState({
        name: partner.name,
        contactPerson: partner.contact_person ?? "",
        phone: partner.phone ?? "",
        email: partner.email ?? "",
        regionId: partner.region_id,
        districtId: partner.district_id,
        locality: partner.locality ?? "",
        externalId: partner.external_id?.toString() ?? "",
      });
    } else {
      setEditingPartner(null);
      const defaultRegionId = regions[0]?.id ?? "";
      const availableDistricts = districts.filter((district) => district.region_id === defaultRegionId);
      const defaultDistrictId = availableDistricts.length > 0 ? availableDistricts[0].id : "";
      setFormState({
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        regionId: defaultRegionId,
        districtId: defaultDistrictId,
        locality: "",
        externalId: "",
      });
    }
    setFormError(null);
    setIsSubmitting(false);
    setShowModal(true);
  }, [regions, districts]);

  const handleActionClick = useCallback((action: string, id: string) => {
    if (action === "edit") {
      const partner = partners.find(p => p.id === id);
      if (partner) {
        openModal(partner);
      }
    } else if (action === "delete") {
      const partner = partners.find(p => p.id === id);
      if (partner) {
        setDeleteTarget(partner);
        setShowDeleteModal(true);
      }
    }
  }, [partners, openModal]);

  // Event delegation for action buttons
  useEffect(() => {
    if (!window.$) return;
    const $table = window.$('#partners-datatable');
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

  const closeModal = () => {
    setShowModal(false);
    setIsSubmitting(false);
    setEditingPartner(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleteSubmitting(true);
    setDeleteError(null);

    try {
      await implementingPartnerService.remove(deleteTarget.id);
      setPartners(prev => prev.filter(p => p.id !== deleteTarget.id));
      dispatch(addAlert({
        type: "success",
        title: "Success",
        message: `Partner "${deleteTarget.name}" deleted successfully.`,
      }));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete partner.";
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

  const tableData = useMemo(
    () =>
      partners.map((partner) => {
        const regionRecord = partner.region ?? regionById.get(partner.region_id);
        const districtRecord = partner.district ?? districtById.get(partner.district_id);
        return {
          id: partner.id,
          name: partner.name,
          contactPerson: partner.contact_person ?? "-",
          phone: partner.phone ?? "-",
          email: partner.email ?? "-",
          regionName: regionRecord ? regionRecord.name : "Unknown",
          districtName: districtRecord ? districtRecord.name : "Unknown",
          locality: partner.locality ?? "-",
          externalId: partner.external_id ?? "-",
          createdAt: partner.created_at ? new Date(partner.created_at).toLocaleString() : "-",
          updatedAt: partner.updated_at ? new Date(partner.updated_at).toLocaleString() : "-",
        };
      }),
    [partners, regionById, districtById],
  );

  const columns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "Partner Name", data: "name" },
      { title: "Contact Person", data: "contactPerson" },
      { title: "Phone", data: "phone" },
      { title: "Email", data: "email" },
      { title: "Region", data: "regionName" },
      { title: "District", data: "districtName" },
      { title: "Locality", data: "locality" },
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
              <button class="btn btn-sm p-1" title="Edit Partner" data-action="edit" data-id="${row.id}" style="border:none;background:transparent;">
                <i class="material-icons-outlined text-primary">edit</i>
              </button>
              <button class="btn btn-sm p-1" title="Delete Partner" data-action="delete" data-id="${row.id}" style="border:none;background:transparent;">
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

  const validateForm = (state: PartnerFormState) => {
    if (!state.name.trim()) return "Partner name is required.";
    if (!state.regionId) return "Region selection is required.";
    
    // Check if there are districts available for the selected region
    const availableDistricts = districts.filter((district) => district.region_id === state.regionId);
    if (availableDistricts.length === 0) {
      return "No districts are available for the selected region.";
    }
    
    if (!state.districtId) return "District selection is required.";
    if (state.email.trim() && !state.email.includes("@")) return "Please provide a valid email address.";
    return null;
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
    const trimmedContact = formState.contactPerson.trim();
    const trimmedPhone = formState.phone.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedLocality = formState.locality.trim();
    const trimmedExternalId = formState.externalId.trim();

    let externalIdValue: number | undefined;
    if (trimmedExternalId) {
      const parsedExternalId = Number(trimmedExternalId);
      if (!Number.isFinite(parsedExternalId)) {
        setFormError("External ID must be a valid number.");
        return;
      }
      externalIdValue = parsedExternalId;
    }

    if (!regionById.get(formState.regionId)) {
      setFormError("Selected region is not available.");
      return;
    }
    if (!districtById.get(formState.districtId)) {
      setFormError("Selected district is not available.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: trimmedName,
        region_id: formState.regionId,
        district_id: formState.districtId,
        contact_person: trimmedContact || undefined,
        phone: trimmedPhone || undefined,
        email: trimmedEmail || undefined,
        locality: trimmedLocality || undefined,
        ...(externalIdValue !== undefined ? { external_id: externalIdValue } : {}),
      };

      if (editingPartner) {
        // Update existing partner
        const response = await implementingPartnerService.update(editingPartner.id, payload);
        if (response.data) {
          setPartners((prev) => prev.map(p => p.id === editingPartner.id ? response.data : p));
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: response.message ?? `Partner "${response.data.name}" updated successfully.`,
            }),
          );
          setShowModal(false);
        }
      } else {
        // Create new partner
        const response = await implementingPartnerService.create(payload);
        if (response.data) {
          setPartners((prev) => [...prev, response.data]);
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: response.message ?? `Partner "${response.data.name}" created successfully.`,
            }),
          );
          setShowModal(false);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 
        editingPartner ? "Failed to update partner." : "Failed to create partner.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addButtonDisabled = regions.length === 0 || districts.length === 0;

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
                  Partners
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
              Add Partner
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Partners</h6>
        </div>
        <hr />

        <div className="card">
          <div className="card-body">
            {partnersError && <div className="alert alert-danger">{partnersError}</div>}
            {(regionsError || districtsError) && (
              <div className="alert alert-warning mb-3">
                {regionsError && <div>{regionsError}</div>}
                {districtsError && <div>{districtsError}</div>}
              </div>
            )}
            {(partnersLoading || regionsLoading || districtsLoading) && (
              <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                <Spinner animation="border" size="sm" />
                <span>Loading partners...</span>
              </div>
            )}
            {!partnersLoading && partners.length === 0 && (
              <div className="alert alert-info">No partners found. Add a new partner to get started.</div>
            )}
            <div className="table-responsive">
              <DataTableWrapper
                id="partners-datatable"
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
            <Modal.Title>{editingPartner ? "Edit Partner" : "Add Partner"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <Form.Group className="mb-3" controlId="partnerName">
              <Form.Label>Partner Name</Form.Label>
              <Form.Control
                type="text"
                value={formState.name}
                placeholder="Enter partner name"
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactPerson">
              <Form.Label>Contact Person (optional)</Form.Label>
              <Form.Control
                type="text"
                value={formState.contactPerson}
                placeholder="Enter contact person"
                onChange={(event) => setFormState((prev) => ({ ...prev, contactPerson: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone (optional)</Form.Label>
              <Form.Control
                type="tel"
                value={formState.phone}
                placeholder="Enter phone number"
                onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="partnerEmail">
              <Form.Label>Email (optional)</Form.Label>
              <Form.Control
                type="email"
                value={formState.email}
                placeholder="Enter email address"
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="partnerRegion">
              <Form.Label>Region</Form.Label>
              <Form.Select
                value={formState.regionId}
                onChange={(event) => setFormState((prev) => ({ ...prev, regionId: event.target.value }))}
                disabled={regions.length === 0}
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="partnerDistrict">
              <Form.Label>District</Form.Label>
              <Form.Select
                value={formState.districtId}
                onChange={(event) => setFormState((prev) => ({ ...prev, districtId: event.target.value }))}
                disabled={filteredDistrictOptions.length === 0}
              >
                {filteredDistrictOptions.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </Form.Select>
              {formState.regionId && filteredDistrictOptions.length === 0 && (
                <div className="form-text text-warning">No districts available for the selected region.</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="partnerLocality">
              <Form.Label>Locality (optional)</Form.Label>
              <Form.Control
                type="text"
                value={formState.locality}
                placeholder="Enter locality"
                onChange={(event) => setFormState((prev) => ({ ...prev, locality: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="partnerExternalId">
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
              disabled={isSubmitting || regions.length === 0 || filteredDistrictOptions.length === 0}
            >
              {isSubmitting 
                ? "Saving..." 
                : editingPartner ? "Update Partner" : "Add Partner"
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
            Are you sure you want to delete this partner?
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

export default SettingsPartners;
