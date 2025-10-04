import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import DataTableWrapper from "../components/DataTableWrapper";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { regionService } from "../services/regionService";
import { districtService } from "../services/districtService";
import type { DistrictRecord, RegionRecord } from "../types/settings";

type LocalityTab = "regions" | "districts";

interface RegionFormState {
  name: string;
  externalId: string;
}

interface DistrictFormState {
  name: string;
  regionId: string;
  externalId: string;
}

const SettingsLocality: React.FC = () => {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<LocalityTab>("regions");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<LocalityTab>("regions");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [regions, setRegions] = useState<RegionRecord[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(false);
  const [regionsError, setRegionsError] = useState<string | null>(null);

  const [districts, setDistricts] = useState<DistrictRecord[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [districtsError, setDistrictsError] = useState<string | null>(null);

  const [regionForm, setRegionForm] = useState<RegionFormState>({ name: "", externalId: "" });
  const [districtForm, setDistrictForm] = useState<DistrictFormState>({ name: "", regionId: "", externalId: "" });

  // Edit/Delete state management
  const [editingRegion, setEditingRegion] = useState<RegionRecord | null>(null);
  const [editingDistrict, setEditingDistrict] = useState<DistrictRecord | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: LocalityTab; record: RegionRecord | DistrictRecord } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const regionById = useMemo(() => {
    return new Map<string, RegionRecord>(regions.map((region) => [region.id, region] as const));
  }, [regions]);

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

  const openModal = useCallback((type: LocalityTab, record?: RegionRecord | DistrictRecord) => {
    setModalType(type);
    setFormError(null);
    setIsSubmitting(false);

    if (type === "regions") {
      if (record) {
        const region = record as RegionRecord;
        setEditingRegion(region);
        setRegionForm({ 
          name: region.name, 
          externalId: region.external_id?.toString() ?? "" 
        });
      } else {
        setEditingRegion(null);
        setRegionForm({ name: "", externalId: "" });
      }
    } else {
      if (record) {
        const district = record as DistrictRecord;
        setEditingDistrict(district);
        setDistrictForm({ 
          name: district.name, 
          regionId: district.region_id, 
          externalId: district.external_id?.toString() ?? "" 
        });
      } else {
        setEditingDistrict(null);
        setDistrictForm({ name: "", regionId: regions[0]?.id ?? "", externalId: "" });
      }
    }

    setShowModal(true);
  }, [regions]);

  const handleActionClick = useCallback((action: string, id: string) => {
    if (action === "edit") {
      if (activeTab === "regions") {
        const region = regions.find(r => r.id === id);
        if (region) {
          openModal("regions", region);
        }
      } else {
        const district = districts.find(d => d.id === id);
        if (district) {
          openModal("districts", district);
        }
      }
    } else if (action === "delete") {
      if (activeTab === "regions") {
        const region = regions.find(r => r.id === id);
        if (region) {
          setDeleteTarget({ type: "regions", record: region });
          setShowDeleteModal(true);
        }
      } else {
        const district = districts.find(d => d.id === id);
        if (district) {
          setDeleteTarget({ type: "districts", record: district });
          setShowDeleteModal(true);
        }
      }
    }
  }, [activeTab, regions, districts, openModal]);

  useEffect(() => {
    void loadRegions();
    void loadDistricts();
  }, [loadRegions, loadDistricts]);

  // Event delegation for action buttons
  useEffect(() => {
    const handleTableClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('button[data-action]') as HTMLButtonElement;
      
      if (button) {
        const action = button.getAttribute('data-action');
        const id = button.getAttribute('data-id');
        
        if (action && id) {
          event.preventDefault();
          handleActionClick(action, id);
        }
      }
    };

    // Add event listeners to both tables
    const regionsTable = document.getElementById('regions-datatable');
    const districtsTable = document.getElementById('districts-datatable');
    
    if (regionsTable) {
      regionsTable.addEventListener('click', handleTableClick);
    }
    if (districtsTable) {
      districtsTable.addEventListener('click', handleTableClick);
    }

    return () => {
      if (regionsTable) {
        regionsTable.removeEventListener('click', handleTableClick);
      }
      if (districtsTable) {
        districtsTable.removeEventListener('click', handleTableClick);
      }
    };
  }, [handleActionClick]);

  useEffect(() => {
    if (regions.length === 0) {
      setDistrictForm((prev) => ({ ...prev, regionId: "" }));
      return;
    }
    setDistrictForm((prev) => {
      if (!prev.regionId || !regions.some((region) => region.id === prev.regionId)) {
        return { ...prev, regionId: regions[0].id };
      }
      return prev;
    });
  }, [regions]);

  const closeModal = () => {
    setShowModal(false);
    setIsSubmitting(false);
    setEditingRegion(null);
    setEditingDistrict(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleteSubmitting(true);
    setDeleteError(null);

    try {
      if (deleteTarget.type === "regions") {
        await regionService.remove(deleteTarget.record.id);
        setRegions(prev => prev.filter(r => r.id !== deleteTarget.record.id));
        dispatch(addAlert({
          type: "success",
          title: "Success",
          message: `Region "${deleteTarget.record.name}" deleted successfully.`,
        }));
      } else {
        await districtService.remove(deleteTarget.record.id);
        setDistricts(prev => prev.filter(d => d.id !== deleteTarget.record.id));
        dispatch(addAlert({
          type: "success",
          title: "Success",
          message: `District "${deleteTarget.record.name}" deleted successfully.`,
        }));
      }
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete item.";
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

  const regionTableData = useMemo(
    () =>
      regions.map((region) => ({
        id: region.id,
        name: region.name,
        externalId: region.external_id ?? "-",
        createdAt: region.created_at ? new Date(region.created_at).toLocaleString() : "-",
        updatedAt: region.updated_at ? new Date(region.updated_at).toLocaleString() : "-",
      })),
    [regions],
  );

  const districtsTableData = useMemo(() => {
    return districts.map((district) => {
      const regionRecord = district.region ?? regionById.get(district.region_id);
      return {
        id: district.id,
        name: district.name,
        externalId: district.external_id ?? "-",
        regionName: regionRecord ? regionRecord.name : "Unassigned",
        createdAt: district.created_at ? new Date(district.created_at).toLocaleString() : "-",
        updatedAt: district.updated_at ? new Date(district.updated_at).toLocaleString() : "-",
      };
    });
  }, [districts, regionById]);

  const regionColumns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "Region Name", data: "name" },
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
              <button class="btn btn-sm p-1" title="Edit Region" data-action="edit" data-id="${row.id}" style="border:none;background:transparent;">
                <i class="material-icons-outlined text-primary">edit</i>
              </button>
              <button class="btn btn-sm p-1" title="Delete Region" data-action="delete" data-id="${row.id}" style="border:none;background:transparent;">
                <i class="material-icons-outlined text-danger">delete</i>
              </button>
            </div>`;
        }
      },
    ],
    [],
  );

  const districtColumns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "District Name", data: "name" },
      { title: "External ID", data: "externalId" },
      { title: "Region", data: "regionName" },
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
              <button class="btn btn-sm p-1" title="Edit District" data-action="edit" data-id="${row.id}" style="border:none;background:transparent;">
                <i class="material-icons-outlined text-primary">edit</i>
              </button>
              <button class="btn btn-sm p-1" title="Delete District" data-action="delete" data-id="${row.id}" style="border:none;background:transparent;">
                <i class="material-icons-outlined text-danger">delete</i>
              </button>
            </div>`;
        }
      },
    ],
    [],
  );

  const regionTableOptions = useMemo(
    () => ({
      columns: regionColumns,
      pageLength: 10,
      autoWidth: false,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: true,
    }),
    [regionColumns],
  );

  const districtTableOptions = useMemo(
    () => ({
      columns: districtColumns,
      pageLength: 10,
      autoWidth: false,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: true,
    }),
    [districtColumns],
  );

  const handleRegionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    const trimmedName = regionForm.name.trim();
    const trimmedExternalId = regionForm.externalId.trim();

    if (!trimmedName) {
      setFormError("Region name is required.");
      return;
    }

    // Check for duplicates (excluding current record if editing)
    const duplicate = regions.some((region) => 
      region.name.toLowerCase() === trimmedName.toLowerCase() && 
      (!editingRegion || region.id !== editingRegion.id)
    );
    if (duplicate) {
      setFormError("Region already exists.");
      return;
    }

    let externalIdValue: number | undefined;
    if (trimmedExternalId) {
      const parsed = Number(trimmedExternalId);
      if (!Number.isFinite(parsed)) {
        setFormError("External ID must be a valid number.");
        return;
      }
      externalIdValue = parsed;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: trimmedName.toUpperCase(),
        ...(externalIdValue !== undefined ? { external_id: externalIdValue } : {}),
      };

      if (editingRegion) {
        // Update existing region
        const response = await regionService.update(editingRegion.id, payload);
        if (response.data) {
          setRegions((prev) => prev.map(r => r.id === editingRegion.id ? response.data : r));
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: response.message ?? `Region "${response.data.name}" updated successfully.`,
            }),
          );
          setShowModal(false);
        }
      } else {
        // Create new region
        const response = await regionService.create(payload);
        if (response.data) {
          setRegions((prev) => [...prev, response.data]);
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: response.message ?? `Region "${response.data.name}" created successfully.`,
            }),
          );
          setShowModal(false);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 
        editingRegion ? "Failed to update region." : "Failed to create region.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDistrictSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    const trimmedName = districtForm.name.trim();
    const trimmedExternalId = districtForm.externalId.trim();
    const selectedRegionId = districtForm.regionId;

    if (!trimmedName) {
      setFormError("District name is required.");
      return;
    }

    if (!selectedRegionId) {
      setFormError("Please select a region.");
      return;
    }

    const selectedRegion = regionById.get(selectedRegionId);
    if (!selectedRegion) {
      setFormError("Selected region is not available.");
      return;
    }

    // Check for duplicates (excluding current record if editing)
    const duplicate = districts.some(
      (district) =>
        district.name.toLowerCase() === trimmedName.toLowerCase() && 
        district.region_id === selectedRegionId &&
        (!editingDistrict || district.id !== editingDistrict.id)
    );

    if (duplicate) {
      setFormError("District already exists for the selected region.");
      return;
    }

    let externalIdValue: number | undefined;
    if (trimmedExternalId) {
      const parsed = Number(trimmedExternalId);
      if (!Number.isFinite(parsed)) {
        setFormError("External ID must be a valid number.");
        return;
      }
      externalIdValue = parsed;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: trimmedName.toUpperCase(),
        region_id: selectedRegionId,
        ...(externalIdValue !== undefined ? { external_id: externalIdValue } : {}),
      };

      if (editingDistrict) {
        // Update existing district
        const response = await districtService.update(editingDistrict.id, payload);
        if (response.data) {
          setDistricts((prev) => prev.map(d => d.id === editingDistrict.id ? response.data : d));
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: response.message ?? `District "${response.data.name}" updated successfully.`,
            }),
          );
          setShowModal(false);
        }
      } else {
        // Create new district
        const response = await districtService.create(payload);
        if (response.data) {
          setDistricts((prev) => [...prev, response.data]);
          dispatch(
            addAlert({
              type: "success",
              title: "Success",
              message: response.message ?? `District "${response.data.name}" created successfully.`,
            }),
          );
          setShowModal(false);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 
        editingDistrict ? "Failed to update district." : "Failed to create district.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (modalType === "regions") {
      void handleRegionSubmit(event);
    } else {
      void handleDistrictSubmit(event);
    }
  };

  const addButtonDisabled = activeTab === "districts" && regions.length === 0;

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
                  Locality
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-grd-primary px-4"
              onClick={() => openModal(activeTab)}
              disabled={addButtonDisabled}
            >
              <i className="material-icons-outlined me-1">add</i>
              {activeTab === "regions" ? "Add Region" : "Add District"}
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Locality Settings</h6>
        </div>
        <hr />

        <div className="card">
          <div className="card-body">
            <ul className="nav nav-tabs nav-primary" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link${activeTab === "regions" ? " active" : ""}`}
                  onClick={() => setActiveTab("regions")}
                  role="tab"
                >
                  Regions
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  type="button"
                  className={`nav-link${activeTab === "districts" ? " active" : ""}`}
                  onClick={() => setActiveTab("districts")}
                  role="tab"
                >
                  Districts
                </button>
              </li>
            </ul>

            <div className="tab-content pt-3">
              <div className={`tab-pane fade${activeTab === "regions" ? " show active" : ""}`} role="tabpanel">
                {regionsError && <div className="alert alert-danger">{regionsError}</div>}
                {regionsLoading && (
                  <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                    <Spinner animation="border" size="sm" />
                    <span>Loading regions...</span>
                  </div>
                )}
                <div className="table-responsive">
                  <DataTableWrapper
                    id="regions-datatable"
                    data={regionTableData}
                    options={regionTableOptions}
                    className="table table-striped table-bordered w-100"
                  />
                </div>
              </div>
              <div className={`tab-pane fade${activeTab === "districts" ? " show active" : ""}`} role="tabpanel">
                {districtsError && <div className="alert alert-danger">{districtsError}</div>}
                {districtsLoading && (
                  <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                    <Spinner animation="border" size="sm" />
                    <span>Loading districts...</span>
                  </div>
                )}
                {regions.length === 0 && !regionsLoading && (
                  <div className="alert alert-info">Add or sync regions before creating districts.</div>
                )}
                <div className="table-responsive">
                  <DataTableWrapper
                    id="districts-datatable"
                    data={districtsTableData}
                    options={districtTableOptions}
                    className="table table-striped table-bordered w-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === "regions" 
                ? (editingRegion ? "Edit Region" : "Add Region")
                : (editingDistrict ? "Edit District" : "Add District")
              }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <div className="alert alert-danger">{formError}</div>}
            {modalType === "regions" ? (
              <>
                <Form.Group className="mb-3" controlId="newRegionName">
                  <Form.Label>Region Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={regionForm.name}
                    placeholder="Enter region name"
                    onChange={(event) => setRegionForm((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </Form.Group>
                <Form.Group className="mb-0" controlId="newRegionExternalId">
                  <Form.Label>External ID (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={regionForm.externalId}
                    placeholder="Enter external ID"
                    onChange={(event) => setRegionForm((prev) => ({ ...prev, externalId: event.target.value }))}
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group className="mb-3" controlId="newDistrictName">
                  <Form.Label>District Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={districtForm.name}
                    placeholder="Enter district name"
                    onChange={(event) => setDistrictForm((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="newDistrictRegion">
                  <Form.Label>Region</Form.Label>
                  <Form.Select
                    value={districtForm.regionId}
                    onChange={(event) => setDistrictForm((prev) => ({ ...prev, regionId: event.target.value }))}
                    disabled={regions.length === 0}
                  >
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-0" controlId="newDistrictExternalId">
                  <Form.Label>External ID (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={districtForm.externalId}
                    placeholder="Enter external ID"
                    onChange={(event) => setDistrictForm((prev) => ({ ...prev, externalId: event.target.value }))}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-grd-primary px-4"
              disabled={isSubmitting || (modalType === "districts" && regions.length === 0)}
            >
              {isSubmitting 
                ? "Saving..." 
                : modalType === "regions" 
                  ? (editingRegion ? "Update Region" : "Add Region")
                  : (editingDistrict ? "Update District" : "Add District")
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
            Are you sure you want to delete this {deleteTarget?.type === "regions" ? "region" : "district"}?
          </p>
          <p className="mb-0">
            <strong>{deleteTarget?.record.name}</strong>
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

export default SettingsLocality;
