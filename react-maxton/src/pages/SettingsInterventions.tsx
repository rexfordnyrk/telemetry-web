import React, { useMemo, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import DataTableWrapper from "../components/DataTableWrapper";
import { Intervention, Partner } from "../types/settings";
import { initialInterventions, initialPartners } from "../data/settingsData";

interface InterventionFormState {
  name: string;
  description: string;
  implementingPartnerID: number;
}

const SettingsInterventions: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>(initialInterventions);
  const [partners] = useState<Partner[]>(initialPartners);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const defaultPartnerId = partners[0]?.id ?? 0;
  const [formState, setFormState] = useState<InterventionFormState>({
    name: "",
    description: "",
    implementingPartnerID: defaultPartnerId,
  });

  const partnerNameById = useMemo(() => {
    const map = new Map<number, string>();
    partners.forEach((partner) => map.set(partner.id, partner.partnerName));
    return map;
  }, [partners]);

  const tableData = useMemo(
    () =>
      interventions.map((intervention) => ({
        ...intervention,
        partnerName: partnerNameById.get(intervention.implementingPartnerID) ?? "Unassigned",
        shortDescription:
          intervention.description.length > 180
            ? `${intervention.description.slice(0, 180)}...`
            : intervention.description,
      })),
    [interventions, partnerNameById],
  );

  const columns = useMemo(
    () => [
      { title: "ID", data: "id" },
      { title: "Intervention Name", data: "name" },
      { title: "Implementing Partner", data: "partnerName" },
      { title: "Description", data: "shortDescription" },
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

  const openModal = () => {
    setFormError(null);
    setFormState({ name: "", description: "", implementingPartnerID: defaultPartnerId });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const validateForm = (state: InterventionFormState) => {
    if (!state.name.trim()) return "Intervention name is required.";
    if (!state.description.trim()) return "Description is required.";
    if (!state.implementingPartnerID) return "Implementing partner selection is required.";
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

    const nextId = interventions.reduce((maxId, intervention) => Math.max(maxId, intervention.id), 0) + 1;
    const selectedPartner = partners.find((partner) => partner.id === formState.implementingPartnerID);

    const newIntervention: Intervention = {
      id: nextId,
      name: formState.name.trim(),
      description: formState.description.trim(),
      implementingPartnerID: formState.implementingPartnerID,
      implementingPartner: selectedPartner,
    };

    setInterventions((prev) => [...prev, newIntervention]);
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
                  Interventions
                </li>
              </ol>
            </nav>
          </div>
          <div className="ms-auto">
            <button type="button" className="btn btn-grd-primary px-4" onClick={openModal}>
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
            <Modal.Title>Add Intervention</Modal.Title>
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
                value={formState.implementingPartnerID}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, implementingPartnerID: Number(event.target.value) }))
                }
              >
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.partnerName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-0" controlId="interventionDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formState.description}
                placeholder="Provide a detailed description"
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-grd-primary px-4">
              Add Intervention
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default SettingsInterventions;
