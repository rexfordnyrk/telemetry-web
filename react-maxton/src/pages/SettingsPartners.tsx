import React, { useEffect, useMemo, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import DataTableWrapper from "../components/DataTableWrapper";
import { District, Partner, Region } from "../types/settings";
import { initialDistricts, initialPartners, initialRegions } from "../data/settingsData";

interface PartnerFormState {
  partnerName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  regionID: number;
  districtID: number;
  locality: string;
}

const SettingsPartners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [availableRegions] = useState<Region[]>(initialRegions);
  const [availableDistricts] = useState<District[]>(initialDistricts);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const defaultRegionId = availableRegions[0]?.id ?? 0;
  const defaultDistrictId = useMemo(() => {
    const firstDistrict = availableDistricts.find((district) => district.regionID === defaultRegionId);
    return firstDistrict?.id ?? 0;
  }, [availableDistricts, defaultRegionId]);

  const [formState, setFormState] = useState<PartnerFormState>({
    partnerName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    regionID: defaultRegionId,
    districtID: defaultDistrictId,
    locality: "",
  });

  useEffect(() => {
    const regionMatches = availableDistricts.some((district) => district.regionID === formState.regionID);
    if (!regionMatches) {
      const firstDistrict = availableDistricts.find((district) => district.regionID === formState.regionID);
      if (firstDistrict) {
        setFormState((prev) => ({ ...prev, districtID: firstDistrict.id }));
      }
    }
  }, [availableDistricts, formState.regionID]);

  const regionNameById = useMemo(() => {
    const map = new Map<number, string>();
    availableRegions.forEach((region) => map.set(region.id, region.regionName));
    return map;
  }, [availableRegions]);

  const districtNameById = useMemo(() => {
    const map = new Map<number, string>();
    availableDistricts.forEach((district) => map.set(district.id, district.districtName));
    return map;
  }, [availableDistricts]);

  const tableData = useMemo(
    () =>
      partners.map((partner) => ({
        ...partner,
        regionName: regionNameById.get(partner.regionID) ?? "Unknown",
        districtName: districtNameById.get(partner.districtID) ?? "Unknown",
      })),
    [partners, regionNameById, districtNameById],
  );

  const columns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "Partner Name", data: "partnerName" },
      { title: "Contact Person", data: "contactPerson" },
      { title: "Phone Number", data: "phoneNumber" },
      { title: "Email", data: "email" },
      { title: "Region", data: "regionName" },
      { title: "District", data: "districtName" },
      { title: "Locality", data: "locality" },
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

  const availableDistrictOptions = useMemo(
    () => availableDistricts.filter((district) => district.regionID === formState.regionID),
    [availableDistricts, formState.regionID],
  );

  const openModal = () => {
    setFormError(null);
    setFormState({
      partnerName: "",
      contactPerson: "",
      phoneNumber: "",
      email: "",
      regionID: defaultRegionId,
      districtID: defaultDistrictId,
      locality: "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const validateForm = (state: PartnerFormState) => {
    if (!state.partnerName.trim()) return "Partner name is required.";
    if (!state.contactPerson.trim()) return "Contact person is required.";
    if (!state.phoneNumber.trim()) return "Phone number is required.";
    if (!state.email.trim()) return "Email is required.";
    if (!state.email.includes("@")) return "Please provide a valid email address.";
    if (!state.regionID) return "Region selection is required.";
    if (!state.districtID) return "District selection is required.";
    if (!state.locality.trim()) return "Locality is required.";
    return null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const validationError = validateForm(formState);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const nextId = partners.reduce((maxId, partner) => Math.max(maxId, partner.id), 0) + 1;
    const newPartner: Partner = {
      id: nextId,
      partnerName: formState.partnerName.trim(),
      contactPerson: formState.contactPerson.trim(),
      phoneNumber: formState.phoneNumber.trim(),
      email: formState.email.trim(),
      regionID: formState.regionID,
      districtID: formState.districtID,
      locality: formState.locality.trim(),
    };

    setPartners((prev) => [...prev, newPartner]);
    setShowModal(false);
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
                  Partners
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <button type="button" className="btn btn-grd-primary px-4" onClick={openModal}>
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
            <Modal.Title>Add Partner</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <Form.Group className="mb-3" controlId="partnerName">
              <Form.Label>Partner Name</Form.Label>
              <Form.Control
                type="text"
                value={formState.partnerName}
                placeholder="Enter partner name"
                onChange={(event) => setFormState((prev) => ({ ...prev, partnerName: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contactPerson">
              <Form.Label>Contact Person</Form.Label>
              <Form.Control
                type="text"
                value={formState.contactPerson}
                placeholder="Enter contact person"
                onChange={(event) => setFormState((prev) => ({ ...prev, contactPerson: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={formState.phoneNumber}
                placeholder="Enter phone number"
                onChange={(event) => setFormState((prev) => ({ ...prev, phoneNumber: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="partnerEmail">
              <Form.Label>Email</Form.Label>
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
                value={formState.regionID}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, regionID: Number(event.target.value) }))
                }
              >
                {availableRegions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.regionName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="partnerDistrict">
              <Form.Label>District</Form.Label>
              <Form.Select
                value={formState.districtID}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, districtID: Number(event.target.value) }))
                }
              >
                {availableDistrictOptions.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.districtName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-0" controlId="partnerLocality">
              <Form.Label>Locality</Form.Label>
              <Form.Control
                type="text"
                value={formState.locality}
                placeholder="Enter locality"
                onChange={(event) => setFormState((prev) => ({ ...prev, locality: event.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-grd-primary px-4">
              Add Partner
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default SettingsPartners;
