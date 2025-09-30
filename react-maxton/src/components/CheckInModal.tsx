import React, { useEffect, useRef, useState } from "react";
import { Modal, Form, Row, Col, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAlert } from "../store/slices/alertSlice";
import { createVisit, CreateVisitPayload } from "../store/slices/visitSlice";
import { API_CONFIG, buildApiUrl, getAuthHeaders } from "../config/api";
import { interventionService } from "../services/interventionService";
import { handleApiError } from "../utils/apiUtils";

interface CheckInModalProps {
  show: boolean;
  onHide: () => void;
}

interface BeneficiaryOption {
  id: string;
  name: string;
  intervention_id?: string | null;
  intervention_name?: string | null;
}

interface CicOption {
  id: string;
  name: string;
}

interface InterventionOption {
  id: string;
  name: string;
}

interface FormState {
  cic_id: string;
  cic_name: string;
  beneficiary_id: string;
  beneficiary_name: string;
  intervention_id: string | null;
  intervention_name: string;
  activity_name: string;
  assisted_by: string;
  notes: string;
  check_in_at: string;
}

const MIN_BENEFICIARY_QUERY_LENGTH = 2;
const BENEFICIARY_FETCH_LIMIT = 10;

const formatDateTimeLocal = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const createInitialFormState = (): FormState => ({
  cic_id: "",
  cic_name: "",
  beneficiary_id: "",
  beneficiary_name: "",
  intervention_id: null,
  intervention_name: "",
  activity_name: "",
  assisted_by: "",
  notes: "",
  check_in_at: formatDateTimeLocal(new Date()),
});

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

const toIso = (local: string) => {
  if (!local) return new Date().toISOString();
  const parsed = new Date(local);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

const CheckInModal: React.FC<CheckInModalProps> = ({ show, onHide }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const [formData, setFormData] = useState<FormState>(() => createInitialFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [cicOptions, setCicOptions] = useState<CicOption[]>([]);
  const [cicLoading, setCicLoading] = useState(false);
  const [cicError, setCicError] = useState<string | null>(null);

  const [interventionOptions, setInterventionOptions] = useState<InterventionOption[]>([]);
  const [interventionsLoading, setInterventionsLoading] = useState(false);
  const [interventionsError, setInterventionsError] = useState<string | null>(null);

  const [beneficiaryQuery, setBeneficiaryQuery] = useState("");
  const [beneficiaryResults, setBeneficiaryResults] = useState<BeneficiaryOption[]>([]);
  const [beneficiaryLoading, setBeneficiaryLoading] = useState(false);
  const [beneficiaryFetchError, setBeneficiaryFetchError] = useState<string | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<BeneficiaryOption | null>(null);
  const [showBeneficiarySuggestions, setShowBeneficiarySuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const beneficiaryContainerRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedCics = useRef(false);
  const hasLoadedInterventions = useRef(false);

  const debouncedBeneficiaryQuery = useDebouncedValue(beneficiaryQuery, 400);

  useEffect(() => {
    if (!show) {
      return;
    }

    setFormData(createInitialFormState());
    setErrors({});
    setBeneficiaryQuery("");
    setBeneficiaryResults([]);
    setSelectedBeneficiary(null);
    setBeneficiaryFetchError(null);
    setShowBeneficiarySuggestions(false);
    setHighlightedIndex(-1);
  }, [show]);

  useEffect(() => {
    if (!show) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (beneficiaryContainerRef.current && !beneficiaryContainerRef.current.contains(event.target as Node)) {
        setShowBeneficiarySuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  useEffect(() => {
    if (!show || hasLoadedCics.current) {
      return;
    }

    if (!token) {
      setCicError("Authentication is required to load CIC options.");
      return;
    }

    const controller = new AbortController();

    const loadCics = async () => {
      try {
        setCicLoading(true);
        setCicError(null);
        const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CICS.LIST), {
          method: "GET",
          headers: getAuthHeaders(token),
          signal: controller.signal,
        });

        if (!response.ok) {
          const message = await handleApiError(response, "Failed to load CIC list", dispatch);
          throw new Error(message);
        }

        const payload = await response.json();
        const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

        const mapped: CicOption[] = items
          .map((item: Record<string, unknown>) => {
            const name = item?.name ?? item?.cic_name ?? item?.title ?? "";
            const id = item?.id ?? item?.uuid ?? item?.code ?? name;
            return {
              id: String(id),
              name: String(name),
            } as CicOption;
          })
          .filter((item: CicOption) => item.name.trim().length > 0);

        const uniqueByName = new Map<string, CicOption>();
        mapped.forEach((item: CicOption) => {
          if (!uniqueByName.has(item.name)) {
            uniqueByName.set(item.name, item);
          }
        });

        const sorted = Array.from(uniqueByName.values()).sort((a, b) => a.name.localeCompare(b.name));
        setCicOptions(sorted);
        hasLoadedCics.current = true;
      } catch (error) {
        if ((error as DOMException).name === "AbortError") {
          return;
        }
        setCicError(error instanceof Error ? error.message : "Failed to load CIC list");
      } finally {
        setCicLoading(false);
      }
    };

    loadCics();

    return () => {
      controller.abort();
    };
  }, [show, token, dispatch]);

  useEffect(() => {
    if (!show || hasLoadedInterventions.current) {
      return;
    }

    const loadInterventions = async () => {
      try {
        setInterventionsLoading(true);
        setInterventionsError(null);
        const response = await interventionService.list({ limit: 200 });
        const items = Array.isArray(response?.data) ? response.data : [];
        const mapped: InterventionOption[] = items
          .map((item: any) => {
            const id = item?.id ?? item?.uuid ?? null;
            const name = item?.name ?? item?.title ?? "";
            if (!id || !name) return null;
            return { id: String(id), name: String(name) };
          })
          .filter((item: InterventionOption | null): item is InterventionOption => Boolean(item && item.name.trim().length > 0));

        const unique = new Map<string, InterventionOption>();
        mapped.forEach((item) => {
          if (!unique.has(item.id)) {
            unique.set(item.id, item);
          }
        });

        const sorted = Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
        setInterventionOptions(sorted);
        hasLoadedInterventions.current = true;
      } catch (error) {
        setInterventionsError(error instanceof Error ? error.message : "Failed to load interventions");
      } finally {
        setInterventionsLoading(false);
      }
    };

    loadInterventions();
  }, [show]);

  useEffect(() => {
    if (!show) {
      return;
    }

    if (debouncedBeneficiaryQuery.trim().length < MIN_BENEFICIARY_QUERY_LENGTH) {
      setBeneficiaryResults([]);
      setBeneficiaryFetchError(null);
      setBeneficiaryLoading(false);
      return;
    }

    if (!token) {
      setBeneficiaryFetchError("Authentication is required to search beneficiaries.");
      setBeneficiaryLoading(false);
      return;
    }

    const controller = new AbortController();

    const searchBeneficiaries = async () => {
      try {
        setBeneficiaryLoading(true);
        setBeneficiaryFetchError(null);
        const params = new URLSearchParams();
        params.append("search", debouncedBeneficiaryQuery.trim());
        params.append("limit", String(BENEFICIARY_FETCH_LIMIT));

        const response = await fetch(
          buildApiUrl(`${API_CONFIG.ENDPOINTS.BENEFICIARIES.LIST}?${params.toString()}`),
          {
            method: "GET",
            headers: getAuthHeaders(token),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          const message = await handleApiError(response, "Failed to search beneficiaries", dispatch);
          throw new Error(message);
        }

        const payload = await response.json();
        const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

        const mapped: BeneficiaryOption[] = items
          .map((item: any) => {
            const name = item?.name ?? item?.full_name ?? item?.beneficiary_name ?? "";
            const id = item?.id ?? item?.uuid ?? item?.beneficiary_id ?? null;
            if (!id || !name) {
              return null;
            }
            const interventionId = item?.intervention_id ?? item?.programme_id ?? item?.intervention?.id ?? null;
            const interventionName = item?.intervention?.name ?? item?.programme ?? item?.programme_name ?? null;
            return {
              id: String(id),
              name: String(name),
              intervention_id: interventionId ? String(interventionId) : null,
              intervention_name: interventionName ? String(interventionName) : null,
            } as BeneficiaryOption;
          })
          .filter((item: BeneficiaryOption | null): item is BeneficiaryOption => Boolean(item && item.name.trim().length > 0));

        const unique = new Map<string, BeneficiaryOption>();
        mapped.forEach((item: BeneficiaryOption) => {
          if (!unique.has(item.id)) {
            unique.set(item.id, item);
          }
        });

        setBeneficiaryResults(Array.from(unique.values()));
      } catch (error) {
        if ((error as DOMException).name === "AbortError") {
          return;
        }
        setBeneficiaryFetchError(error instanceof Error ? error.message : "Failed to search beneficiaries");
        setBeneficiaryResults([]);
      } finally {
        setBeneficiaryLoading(false);
      }
    };

    searchBeneficiaries();

    return () => {
      controller.abort();
    };
  }, [debouncedBeneficiaryQuery, show, token, dispatch]);

  useEffect(() => {
    if (!show) {
      return;
    }

    if (beneficiaryResults.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [beneficiaryResults, show]);

  const handleStandardInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBeneficiaryInputChange = (value: string) => {
    const differsFromSelected = !selectedBeneficiary || value !== selectedBeneficiary.name;
    setBeneficiaryQuery(value);
    setShowBeneficiarySuggestions(true);
    setFormData((prev) => ({
      ...prev,
      beneficiary_name: value,
      beneficiary_id: differsFromSelected ? "" : prev.beneficiary_id,
      intervention_id: differsFromSelected ? null : prev.intervention_id,
      intervention_name: differsFromSelected ? "" : prev.intervention_name,
    }));

    if (differsFromSelected) {
      setSelectedBeneficiary(null);
    }

    if (errors.beneficiary_id) {
      setErrors((prev) => ({ ...prev, beneficiary_id: "" }));
    }
  };

  const handleBeneficiarySelect = (option: BeneficiaryOption) => {
    setSelectedBeneficiary(option);
    setBeneficiaryQuery(option.name);
    setShowBeneficiarySuggestions(false);

    let resolvedInterventionId: string | null = option.intervention_id ?? null;
    let resolvedInterventionName: string = option.intervention_name ?? "";

    if (resolvedInterventionId) {
      const match = interventionOptions.find((item) => item.id === resolvedInterventionId);
      if (match) {
        resolvedInterventionName = match.name;
      } else if (resolvedInterventionName) {
        setInterventionOptions((prev) => {
          if (prev.some((item) => item.id === resolvedInterventionId)) {
            return prev;
          }
          return [...prev, { id: resolvedInterventionId!, name: resolvedInterventionName }];
        });
      }
    } else if (resolvedInterventionName) {
      const matchByName = interventionOptions.find((item) => item.name.toLowerCase() === resolvedInterventionName.toLowerCase());
      if (matchByName) {
        resolvedInterventionId = matchByName.id;
        resolvedInterventionName = matchByName.name;
      }
    }

    setFormData((prev) => ({
      ...prev,
      beneficiary_id: option.id,
      beneficiary_name: option.name,
      intervention_id: resolvedInterventionId,
      intervention_name: resolvedInterventionName,
    }));

    if (errors.beneficiary_id) {
      setErrors((prev) => ({ ...prev, beneficiary_id: "" }));
    }
  };

  const handleBeneficiaryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!showBeneficiarySuggestions && beneficiaryResults.length > 0) {
        setShowBeneficiarySuggestions(true);
        return;
      }
      if (beneficiaryResults.length > 0) {
        setHighlightedIndex((prev) => {
          const next = prev + 1;
          if (next >= beneficiaryResults.length) {
            return 0;
          }
          return next;
        });
      }
    } else if (event.key === "ArrowUp" && beneficiaryResults.length > 0) {
      event.preventDefault();
      setHighlightedIndex((prev) => {
        if (prev <= 0) {
          return beneficiaryResults.length - 1;
        }
        return prev - 1;
      });
    } else if (event.key === "Enter" && beneficiaryResults.length > 0 && highlightedIndex >= 0) {
      event.preventDefault();
      const option = beneficiaryResults[highlightedIndex];
      if (option) {
        handleBeneficiarySelect(option);
      }
    } else if (event.key === "Escape") {
      setShowBeneficiarySuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.cic_id.trim()) nextErrors.cic_id = "CIC is required";
    if (!formData.beneficiary_id.trim()) nextErrors.beneficiary_id = "Beneficiary is required";
    if (!formData.activity_name.trim()) nextErrors.activity_name = "Activity is required";
    if (!formData.check_in_at.trim()) nextErrors.check_in_at = "Check-In is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): CreateVisitPayload => {
    const payload: CreateVisitPayload = {
      cic_id: formData.cic_id,
      beneficiary_id: formData.beneficiary_id,
      check_in_at: toIso(formData.check_in_at),
    };

    if (formData.intervention_id) {
      payload.intervention_id = formData.intervention_id;
    }
    if (formData.activity_name.trim()) {
      payload.activity_name = formData.activity_name.trim();
    }
    if (formData.assisted_by.trim()) {
      payload.assisted_by = formData.assisted_by.trim();
    }
    if (formData.notes.trim()) {
      payload.notes = formData.notes.trim();
    }

    return payload;
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormGeneralError(null);

    if (!validate()) {
      return;
    }

    const payload = buildPayload();

    try {
      setFormSubmitting(true);
      const visit = await dispatch(createVisit(payload)).unwrap();
      dispatch(
        addAlert({
          type: "success",
          title: "Checked In",
          message: `${visit.beneficiary_name || "Beneficiary"} checked in at ${new Date(visit.check_in_at).toLocaleString()}.`,
        })
      );
      onHide();
    } catch (error) {
      setFormGeneralError(error instanceof Error ? error.message : "Unable to save CIC visit.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleClose = () => {
    onHide();
  };

  const canSearchBeneficiaries = beneficiaryQuery.trim().length >= MIN_BENEFICIARY_QUERY_LENGTH;
  const hasCicOptions = cicOptions.length > 0;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdropClassName="checkin-modal-backdrop"
      contentClassName="checkin-modal-content"
    >
      <Modal.Header closeButton className="checkin-modal-header border-top border-3 border-primary">
        <Modal.Title>
          <i className="bx bx-log-in me-2"></i>
          Check-In
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="d-flex align-items-center gap-2">
                  CIC <span className="text-danger">*</span>
                  {cicLoading && <Spinner animation="border" size="sm" role="status" className="ms-1" />}
                </Form.Label>
                {hasCicOptions ? (
                  <Form.Select
                    name="cic"
                    value={formData.cic}
                    onChange={handleStandardInputChange}
                    isInvalid={!!errors.cic}
                    disabled={cicLoading}
                  >
                    <option value="">Select CIC</option>
                    {cicOptions.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type="text"
                    name="cic"
                    value={formData.cic}
                    onChange={handleStandardInputChange}
                    placeholder="Enter CIC name"
                    isInvalid={!!errors.cic}
                  />
                )}
                <Form.Control.Feedback type="invalid">{errors.cic}</Form.Control.Feedback>
                {cicError && !errors.cic && <div className="invalid-feedback d-block">{cicError}</div>}
                {!hasCicOptions && !cicLoading && !cicError && (
                  <Form.Text className="text-muted">CIC list will appear here once available. Enter the name manually for now.</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Beneficiary Name <span className="text-danger">*</span>
                </Form.Label>
                <div className="beneficiary-autocomplete" ref={beneficiaryContainerRef}>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(event) => handleBeneficiaryInputChange(event.target.value)}
                    onFocus={() => {
                      if (beneficiaryResults.length > 0 || canSearchBeneficiaries) {
                        setShowBeneficiarySuggestions(true);
                      }
                    }}
                    onKeyDown={handleBeneficiaryKeyDown}
                    placeholder="Search beneficiary name"
                    autoComplete="off"
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  {beneficiaryFetchError && <div className="invalid-feedback d-block">{beneficiaryFetchError}</div>}
                  {showBeneficiarySuggestions && (
                    <div className="beneficiary-suggestion-list shadow-sm" role="listbox">
                      {beneficiaryLoading ? (
                        <div className="beneficiary-suggestion-loading d-flex align-items-center">
                          <Spinner animation="border" size="sm" role="status" />
                          <span className="ms-2">Searching beneficiaries...</span>
                        </div>
                      ) : beneficiaryFetchError ? (
                        <div className="beneficiary-suggestion-empty text-danger">{beneficiaryFetchError}</div>
                      ) : !canSearchBeneficiaries ? (
                        <div className="beneficiary-suggestion-empty">
                          Type at least {MIN_BENEFICIARY_QUERY_LENGTH} characters to search beneficiaries.
                        </div>
                      ) : beneficiaryResults.length === 0 ? (
                        <div className="beneficiary-suggestion-empty">No beneficiaries found.</div>
                      ) : (
                        <ul className="list-unstyled mb-0">
                          {beneficiaryResults.map((option, index) => (
                            <li
                              key={`${option.id}-${option.name}`}
                              className={`beneficiary-suggestion-item${index === highlightedIndex ? " active" : ""}`}
                              role="option"
                              aria-selected={index === highlightedIndex}
                              onMouseEnter={() => setHighlightedIndex(index)}
                              onMouseDown={(event) => {
                                event.preventDefault();
                                handleBeneficiarySelect(option);
                              }}
                            >
                              <div className="fw-medium">{option.name}</div>
                              {option.programme && (
                                <div className="beneficiary-suggestion-programme">{option.programme}</div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Intervention <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="programme"
                  value={formData.programme}
                  onChange={handleStandardInputChange}
                  placeholder="Enter intervention"
                  isInvalid={!!errors.programme}
                />
                <Form.Control.Feedback type="invalid">{errors.programme}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Activity <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="activity"
                  value={formData.activity}
                  onChange={handleStandardInputChange}
                  placeholder="Enter activity"
                  isInvalid={!!errors.activity}
                />
                <Form.Control.Feedback type="invalid">{errors.activity}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assisted By</Form.Label>
                <Form.Control
                  type="text"
                  name="assisted_by"
                  value={formData.assisted_by}
                  onChange={handleStandardInputChange}
                  placeholder="Enter staff name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Check-In <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleStandardInputChange}
                  isInvalid={!!errors.check_in}
                />
                <Form.Control.Feedback type="invalid">{errors.check_in}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Notes / Follow Up</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleStandardInputChange}
                  placeholder="Enter notes or follow up details"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-light" onClick={handleClose}>
              <i className="bx bx-x me-2"></i>
              Cancel
            </button>
            <button type="submit" className="btn btn-grd-primary">
              <i className="material-icons-outlined me-1">login</i>
              Check-In
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CheckInModal;
