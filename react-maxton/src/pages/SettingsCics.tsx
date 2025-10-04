import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import DataTableWrapper from "../components/DataTableWrapper";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { cicService } from "../services/cicService";
import { regionService } from "../services/regionService";
import { districtService } from "../services/districtService";
import type {
  CicRecord,
  CreateCicPayload,
  DistrictRecord,
  RegionRecord,
} from "../types/settings";

interface CicFormState {
  name: string;
  region_id: string;
  district_id: string;
  locality: string;
  contact_person: string;
  phone_number: string;
  email: string;
  status: string;
}

interface CicTableRow {
  id: string;
  name: string;
  regionName: string;
  districtName: string;
  locality: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  statusLabel: string;
}

const CIC_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Maintenance" },
  { value: "closed", label: "Closed" },
];

const createInitialFormState = (): CicFormState => ({
  name: "",
  region_id: "",
  district_id: "",
  locality: "",
  contact_person: "",
  phone_number: "",
  email: "",
  status: "active",
});

const formatStatusLabel = (status?: string | null): string => {
  if (!status) {
    return "-";
  }
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const sanitizeOptionalField = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const SettingsCics: React.FC = () => {
  const dispatch = useAppDispatch();

  const [cics, setCics] = useState<CicRecord[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);

  const [regions, setRegions] = useState<RegionRecord[]>([]);
  const [districts, setDistricts] = useState<DistrictRecord[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeCic, setActiveCic] = useState<CicRecord | null>(null);
  const [formState, setFormState] = useState<CicFormState>(createInitialFormState());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CicRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const loadLookups = useCallback(async () => {
    try {
      setLookupLoading(true);
      setLookupError(null);
      const [regionsResponse, districtsResponse] = await Promise.all([
        regionService.list({ limit: 200 }),
        districtService.list({ limit: 500 }),
      ]);

      setRegions(Array.isArray(regionsResponse?.data) ? regionsResponse.data : []);
      setDistricts(Array.isArray(districtsResponse?.data) ? districtsResponse.data : []);
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : "Failed to load location data.");
    } finally {
      setLookupLoading(false);
    }
  }, []);

  const loadCics = useCallback(async () => {
    try {
      setTableLoading(true);
      setTableError(null);
      const response = await cicService.list({ limit: 100 });
      setCics(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setTableError(error instanceof Error ? error.message : "Failed to load CICs.");
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    loadCics();
  }, [loadCics]);

  const clearFormError = useCallback((field: string) => {
    setFormErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const { [field]: _omitted, ...rest } = prev;
      return rest;
    });
  }, []);

  const filteredDistricts = useMemo(() => {
    if (!formState.region_id) {
      return districts;
    }
    return districts.filter((district) => district.region_id === formState.region_id);
  }, [districts, formState.region_id]);

  const tableRows: CicTableRow[] = useMemo(
    () =>
      cics.map((cic) => ({
        id: cic.id,
        name: cic.name,
        regionName: cic.region?.name ?? "-",
        districtName: cic.district?.name ?? "-",
        locality: cic.locality ?? "-",
        contactPerson: cic.contact_person ?? "-",
        phoneNumber: cic.phone_number ?? "-",
        email: cic.email ?? "-",
        statusLabel: formatStatusLabel(cic.status),
      })),
    [cics],
  );

  const dtColumns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "CIC Name", data: "name" },
      { title: "Region", data: "regionName" },
      { title: "District", data: "districtName" },
      { title: "Locality", data: "locality" },
      { title: "Contact Person", data: "contactPerson" },
      { title: "Phone Number", data: "phoneNumber" },
      { title: "Email", data: "email" },
      { title: "Status", data: "statusLabel" },
      {
        title: "Actions",
        data: null,
        orderable: false,
        searchable: false,
        render: (_: unknown, __: unknown, row: CicTableRow) => `
          <div class="d-flex gap-1">
            <button class="btn btn-sm p-1" title="Edit CIC" data-action="edit" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-primary">edit</i>
            </button>
            <button class="btn btn-sm p-1" title="Delete CIC" data-action="delete" data-id="${row.id}" style="border:none;background:transparent;">
              <i class="material-icons-outlined text-danger">delete</i>
            </button>
          </div>
        `,
      },
    ],
    [],
  );

  const dtOptions = useMemo(
    () => ({
      columns: dtColumns,
      data: tableRows,
      pageLength: 10,
      autoWidth: false,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: true,
      responsive: true,
    }),
    [dtColumns, tableRows],
  );

  const handleOpenCreateModal = useCallback(() => {
    setFormMode("create");
    setActiveCic(null);
    setFormState(createInitialFormState());
    setFormErrors({});
    setFormGeneralError(null);
    setShowFormModal(true);
  }, []);

  const handleOpenEditModal = useCallback((record: CicRecord) => {
    setFormMode("edit");
    setActiveCic(record);
    setFormState({
      name: record.name ?? "",
      region_id: record.region_id ?? "",
      district_id: record.district_id ?? "",
      locality: record.locality ?? "",
      contact_person: record.contact_person ?? "",
      phone_number: record.phone_number ?? "",
      email: record.email ?? "",
      status: record.status ?? "active",
    });
    setFormErrors({});
    setFormGeneralError(null);
    setShowFormModal(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setShowFormModal(false);
    setActiveCic(null);
    setFormGeneralError(null);
    setFormErrors({});
    setFormState(createInitialFormState());
    setFormSubmitting(false);
  }, []);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => {
      if (name === "region_id") {
        return { ...prev, region_id: value, district_id: "" };
      }
      return { ...prev, [name]: value };
    });
    clearFormError(name);
    if (name === "region_id") {
      clearFormError("district_id");
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formState.name.trim()) {
      nextErrors.name = "CIC name is required.";
    }
    if (formState.email.trim().length > 0 && !/^\S+@\S+\.\S+$/.test(formState.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (
      formState.phone_number.trim().length > 0 &&
      !/^[0-9+\-()\s]+$/.test(formState.phone_number.trim())
    ) {
      nextErrors.phone_number = "Enter a valid phone number.";
    }
    if (!formState.status.trim()) {
      nextErrors.status = "Status is required.";
    }
    if (
      formState.district_id &&
      formState.region_id &&
      !districts.some((district) => district.id === formState.district_id && district.region_id === formState.region_id)
    ) {
      nextErrors.district_id = "Select a district that belongs to the chosen region.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): CreateCicPayload => ({
    name: formState.name.trim(),
    status: (sanitizeOptionalField(formState.status) ?? "active") as string,
    region_id: sanitizeOptionalField(formState.region_id),
    district_id: sanitizeOptionalField(formState.district_id),
    locality: sanitizeOptionalField(formState.locality),
    contact_person: sanitizeOptionalField(formState.contact_person),
    phone_number: sanitizeOptionalField(formState.phone_number),
    email: sanitizeOptionalField(formState.email),
  });

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormGeneralError(null);

    if (!validateForm()) {
      return;
    }

    const payload = buildPayload();

    try {
      setFormSubmitting(true);
      if (formMode === "create") {
        const response = await cicService.create(payload);
        if (response?.data) {
          setCics((prev) => [response.data, ...prev.filter((item) => item.id !== response.data.id)]);
          dispatch(
            addAlert({
              type: "success",
              title: "CIC Created",
              message: `CIC "${response.data.name}" created successfully.`,
            }),
          );
        }
      } else if (formMode === "edit" && activeCic) {
        const response = await cicService.update(activeCic.id, payload);
        if (response?.data) {
          setCics((prev) => prev.map((item) => (item.id === response.data.id ? response.data : item)));
          dispatch(
            addAlert({
              type: "success",
              title: "CIC Updated",
              message: `CIC "${response.data.name}" updated successfully.`,
            }),
          );
        }
      }
      handleCloseFormModal();
    } catch (error) {
      setFormGeneralError(error instanceof Error ? error.message : "Unable to save CIC details.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenDeleteModal = useCallback((record: CicRecord) => {
    setDeleteTarget(record);
    setDeleteError(null);
    setShowDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteError(null);
    setDeleteSubmitting(false);
  }, []);

  const handleDeleteCic = async () => {
    if (!deleteTarget) {
      return;
    }
    try {
      setDeleteSubmitting(true);
      await cicService.remove(deleteTarget.id);
      setCics((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      dispatch(
        addAlert({
          type: "success",
          title: "CIC Deleted",
          message: `CIC "${deleteTarget.name}" deleted successfully.`,
        }),
      );
      handleCloseDeleteModal();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete CIC.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  useEffect(() => {
    if (!window.$) {
      return;
    }
    const $table = window.$("#cics-datatable");
    if ($table.length === 0) {
      return;
    }

    const onEditClick = (event: any) => {
      event.preventDefault();
      const id = window.$(event.currentTarget).data("id");
      const record = cics.find((item) => item.id === id);
      if (record) {
        handleOpenEditModal(record);
      }
    };

    const onDeleteClick = (event: any) => {
      event.preventDefault();
      const id = window.$(event.currentTarget).data("id");
      const record = cics.find((item) => item.id === id);
      if (record) {
        handleOpenDeleteModal(record);
      }
    };

    $table.off(".cicsActions");
    $table.on("click.cicsActions", 'button[data-action="edit"]', onEditClick);
    $table.on("click.cicsActions", 'button[data-action="delete"]', onDeleteClick);

    return () => {
      $table.off(".cicsActions");
    };
  }, [cics, handleOpenDeleteModal, handleOpenEditModal]);

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
                    <i className="bx bx-home-alt" />
                  </a>
                </li>
                <li className="breadcrumb-item">Settings</li>
                <li className="breadcrumb-item active" aria-current="page">
                  CICs
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <button type="button" className="btn btn-grd-primary px-4" onClick={handleOpenCreateModal}>
              <i className="material-icons-outlined me-1">add</i>
              Add CIC
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Community Information Centres</h6>
        </div>
        <hr />

        {lookupError && (
          <div className="alert alert-warning" role="alert">
            {lookupError}
          </div>
        )}
        {tableError && (
          <div className="alert alert-danger" role="alert">
            {tableError}
          </div>
        )}

        <div className="card">
          <div className="card-body">
            {tableLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" />
                <p className="mt-3 text-muted">Loading CIC records...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <DataTableWrapper
                  id="cics-datatable"
                  data={tableRows}
                  options={dtOptions}
                  className="table table-striped table-bordered w-100"
                  shouldInitialize={!tableLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showFormModal} onHide={handleCloseFormModal} centered size="lg">
        <Form onSubmit={handleFormSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{formMode === "create" ? "Add CIC" : "Edit CIC"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formGeneralError && <div className="alert alert-danger">{formGeneralError}</div>}
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="cicName">
                  <Form.Label>
                    CIC Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleFormChange}
                    placeholder="Enter CIC name"
                    isInvalid={!!formErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cicStatus">
                  <Form.Label>
                    Status <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={formState.status}
                    onChange={handleFormChange}
                    disabled={formSubmitting}
                    isInvalid={!!formErrors.status}
                  >
                    <option value="">Select status</option>
                    {CIC_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.status}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cicRegion">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Region
                    {lookupLoading && <Spinner animation="border" size="sm" role="status" />}
                  </Form.Label>
                  <Form.Select
                    name="region_id"
                    value={formState.region_id}
                    onChange={handleFormChange}
                    disabled={lookupLoading || formSubmitting}
                    isInvalid={!!formErrors.region_id}
                  >
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.region_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cicDistrict">
                  <Form.Label>District</Form.Label>
                  <Form.Select
                    name="district_id"
                    value={formState.district_id}
                    onChange={handleFormChange}
                    disabled={lookupLoading || formSubmitting || (!formState.region_id && districts.length === 0)}
                    isInvalid={!!formErrors.district_id}
                  >
                    <option value="">Select district</option>
                    {filteredDistricts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formErrors.district_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cicLocality">
                  <Form.Label>Locality</Form.Label>
                  <Form.Control
                    type="text"
                    name="locality"
                    value={formState.locality}
                    onChange={handleFormChange}
                    placeholder="Enter locality"
                    disabled={formSubmitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cicContact">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_person"
                    value={formState.contact_person}
                    onChange={handleFormChange}
                    placeholder="Enter contact person"
                    disabled={formSubmitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cicPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    value={formState.phone_number}
                    onChange={handleFormChange}
                    placeholder="Enter phone number"
                    isInvalid={!!formErrors.phone_number}
                    disabled={formSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.phone_number}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleFormChange}
                    placeholder="Enter email address"
                    isInvalid={!!formErrors.email}
                    disabled={formSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCloseFormModal}
              disabled={formSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-grd-primary px-4" disabled={formSubmitting}>
              {formSubmitting ? (
                <span className="d-inline-flex align-items-center gap-2">
                  <Spinner animation="border" size="sm" role="status" />
                  Saving...
                </span>
              ) : (
                "Save CIC"
              )}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete CIC</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <div className="alert alert-danger">{deleteError}</div>}
          <p className="mb-1">You are about to delete the CIC:</p>
          <p className="fw-semibold mb-3">{deleteTarget?.name}</p>
          <p className="text-muted mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCloseDeleteModal}
            disabled={deleteSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-grd-danger px-4"
            onClick={handleDeleteCic}
            disabled={deleteSubmitting}
          >
            {deleteSubmitting ? (
              <span className="d-inline-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" role="status" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
};

export default SettingsCics;
