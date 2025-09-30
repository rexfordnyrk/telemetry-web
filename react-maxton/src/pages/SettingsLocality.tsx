import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import DataTableWrapper from "../components/DataTableWrapper";
import { useAppDispatch } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { initialDistricts } from "../data/settingsData";
import { regionService } from "../services/regionService";
import type { RegionRecord } from "../types/settings";

type LocalityTab = "regions" | "districts";

interface DistrictRow {
  id: number;
  districtName: string;
  regionName: string;
  regionExternalId?: number;
}

interface RegionFormState {
  name: string;
  externalId: string;
}

interface DistrictFormState {
  districtName: string;
  regionId: string;
}

const applyRegionNamesToDistricts = (
  regions: RegionRecord[],
  districts: DistrictRow[],
): DistrictRow[] => {
  if (regions.length === 0) {
    return districts;
  }

  const externalMap = new Map<number, string>();
  regions.forEach((region) => {
    if (region.external_id !== null) {
      externalMap.set(region.external_id, region.name);
    }
  });

  return districts.map((district) => {
    if (district.regionExternalId !== undefined && district.regionExternalId !== null) {
      const matchedName = externalMap.get(district.regionExternalId);
      if (matchedName) {
        return { ...district, regionName: matchedName };
      }
    }
    return district;
  });
};

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

  const [regionForm, setRegionForm] = useState<RegionFormState>({ name: "", externalId: "" });
  const [districtForm, setDistrictForm] = useState<DistrictFormState>({ districtName: "", regionId: "" });

  const [districts, setDistricts] = useState<DistrictRow[]>(
    initialDistricts.map((district) => ({
      id: district.id,
      districtName: district.districtName,
      regionName: "Unassigned",
      regionExternalId: district.regionID,
    })),
  );

  const loadRegions = useCallback(async () => {
    setRegionsLoading(true);
    setRegionsError(null);
    try {
      const response = await regionService.list();
      const regionRecords = response.data ?? [];
      setRegions(regionRecords);
      setDistricts((prev) => applyRegionNamesToDistricts(regionRecords, prev));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load regions.";
      setRegionsError(message);
    } finally {
      setRegionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  useEffect(() => {
    setDistricts((prev) => applyRegionNamesToDistricts(regions, prev));
  }, [regions]);

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

  const openModal = (type: LocalityTab) => {
    setModalType(type);
    setFormError(null);
    setIsSubmitting(false);

    if (type === "regions") {
      setRegionForm({ name: "", externalId: "" });
    } else {
      setDistrictForm({ districtName: "", regionId: regions[0]?.id ?? "" });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsSubmitting(false);
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

  const districtsTableData = useMemo(
    () =>
      districts.map((district) => ({
        id: district.id,
        districtName: district.districtName,
        regionName: district.regionName,
      })),
    [districts],
  );

  const regionColumns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "Region Name", data: "name" },
      { title: "External ID", data: "externalId" },
      { title: "Created At", data: "createdAt" },
      { title: "Updated At", data: "updatedAt" },
    ],
    [],
  );

  const districtColumns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "District Name", data: "districtName" },
      { title: "Region", data: "regionName" },
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

    const duplicate = regions.some((region) => region.name.toLowerCase() === trimmedName.toLowerCase());
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
      const response = await regionService.create(payload);
      if (response.data) {
        setRegions((prev) => {
          const updated = [...prev, response.data];
          setDistricts((districtState) => applyRegionNamesToDistricts(updated, districtState));
          return updated;
        });
        dispatch(
          addAlert({
            type: "success",
            title: "Success",
            message: response.message ?? `Region "${response.data.name}" created successfully.`,
          }),
        );
        setShowModal(false);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create region.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDistrictSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = districtForm.districtName.trim();
    if (!trimmedName) {
      setFormError("District name is required.");
      return;
    }

    if (!districtForm.regionId) {
      setFormError("Please select a region.");
      return;
    }

    const selectedRegion = regions.find((region) => region.id === districtForm.regionId);
    if (!selectedRegion) {
      setFormError("Selected region is not available.");
      return;
    }

    const duplicate = districts.some(
      (district) =>
        district.districtName.toLowerCase() === trimmedName.toLowerCase() && district.regionName === selectedRegion.name,
    );

    if (duplicate) {
      setFormError("District already exists for the selected region.");
      return;
    }

    const nextId = districts.reduce((maxId, district) => Math.max(maxId, district.id), 0) + 1;
    const newDistrict: DistrictRow = {
      id: nextId,
      districtName: trimmedName.toUpperCase(),
      regionName: selectedRegion.name,
      regionExternalId: selectedRegion.external_id ?? undefined,
    };

    setDistricts((prev) => [...prev, newDistrict]);
    setShowModal(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (modalType === "regions") {
      void handleRegionSubmit(event);
    } else {
      handleDistrictSubmit(event);
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
                {regions.length === 0 && (
                  <div className="alert alert-info">
                    Add or sync regions before creating districts.
                  </div>
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
            <Modal.Title>{modalType === "regions" ? "Add Region" : "Add District"}</Modal.Title>
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
                    value={districtForm.districtName}
                    placeholder="Enter district name"
                    onChange={(event) => setDistrictForm((prev) => ({ ...prev, districtName: event.target.value }))}
                  />
                </Form.Group>
                <Form.Group className="mb-0" controlId="newDistrictRegion">
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
              {isSubmitting && modalType === "regions" ? "Saving..." : modalType === "regions" ? "Add Region" : "Add District"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default SettingsLocality;
