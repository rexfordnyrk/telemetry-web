import React, { useEffect, useMemo, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import DataTableWrapper from "../components/DataTableWrapper";
import { District, Region } from "../types/settings";
import { initialDistricts, initialRegions } from "../data/settingsData";

type LocalityTab = "regions" | "districts";

const SettingsLocality: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [activeTab, setActiveTab] = useState<LocalityTab>("regions");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<LocalityTab>("regions");
  const [formError, setFormError] = useState<string | null>(null);

  const [regionForm, setRegionForm] = useState({ regionName: "" });
  const [districtForm, setDistrictForm] = useState({ districtName: "", regionID: regions[0]?.id ?? 0 });

  useEffect(() => {
    if (!regions.some((region) => region.id === districtForm.regionID) && regions.length > 0) {
      setDistrictForm((prev) => ({ ...prev, regionID: regions[0].id }));
    }
  }, [regions, districtForm.regionID]);

  const regionNameById = useMemo(() => {
    const map = new Map<number, string>();
    regions.forEach((region) => map.set(region.id, region.regionName));
    return map;
  }, [regions]);

  const districtsTableData = useMemo(
    () =>
      districts.map((district) => ({
        ...district,
        regionName: regionNameById.get(district.regionID) ?? "Unassigned",
      })),
    [districts, regionNameById],
  );

  const regionColumns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "Region Name", data: "regionName" },
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

  const openModal = (type: LocalityTab) => {
    setModalType(type);
    setFormError(null);
    if (type === "regions") {
      setRegionForm({ regionName: "" });
    } else {
      setDistrictForm({ districtName: "", regionID: regions[0]?.id ?? 0 });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRegionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const trimmedName = regionForm.regionName.trim();
    if (!trimmedName) {
      setFormError("Region name is required.");
      return;
    }
    const exists = regions.some((region) => region.regionName.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      setFormError("Region already exists.");
      return;
    }
    const nextId = regions.reduce((maxId, region) => Math.max(maxId, region.id), 0) + 1;
    const newRegion: Region = {
      id: nextId,
      regionName: trimmedName.toUpperCase(),
    };
    setRegions((prev) => [...prev, newRegion]);
    setShowModal(false);
  };

  const handleDistrictSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = districtForm.districtName.trim();
    if (!trimmedName) {
      setFormError("District name is required.");
      return;
    }
    if (!districtForm.regionID) {
      setFormError("Please select a region.");
      return;
    }

    const exists = districts.some(
      (district) =>
        district.districtName.toLowerCase() === trimmedName.toLowerCase() && district.regionID === districtForm.regionID,
    );

    if (exists) {
      setFormError("District already exists for the selected region.");
      return;
    }

    const nextId = districts.reduce((maxId, district) => Math.max(maxId, district.id), 0) + 1;
    const newDistrict: District = {
      id: nextId,
      districtName: trimmedName.toUpperCase(),
      regionID: districtForm.regionID,
    };

    setDistricts((prev) => [...prev, newDistrict]);
    setShowModal(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (modalType === "regions") {
      handleRegionSubmit(event);
    } else {
      handleDistrictSubmit(event);
    }
  };

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
                <div className="table-responsive">
                  <DataTableWrapper
                    id="regions-datatable"
                    data={regions}
                    options={regionTableOptions}
                    className="table table-striped table-bordered w-100"
                  />
                </div>
              </div>
              <div className={`tab-pane fade${activeTab === "districts" ? " show active" : ""}`} role="tabpanel">
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
              <Form.Group className="mb-3" controlId="newRegionName">
                <Form.Label>Region Name</Form.Label>
                <Form.Control
                  type="text"
                  value={regionForm.regionName}
                  placeholder="Enter region name"
                  onChange={(event) => setRegionForm({ regionName: event.target.value })}
                />
              </Form.Group>
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
                <Form.Group className="mb-3" controlId="newDistrictRegion">
                  <Form.Label>Region</Form.Label>
                  <Form.Select
                    value={districtForm.regionID}
                    onChange={(event) =>
                      setDistrictForm((prev) => ({ ...prev, regionID: Number(event.target.value) }))
                    }
                  >
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.regionName}
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
            <button type="submit" className="btn btn-grd-primary px-4">
              {modalType === "regions" ? "Add Region" : "Add District"}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default SettingsLocality;
