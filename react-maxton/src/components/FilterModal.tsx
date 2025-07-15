import React, { useState } from "react";

interface FilterModalProps {
  show: boolean;
  onClose: () => void;
  filterOptions: { [key: string]: any[] };
  onApplyFilters: (filters: { [key: string]: any }) => void;
  title: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  show,
  onClose,
  filterOptions,
  onApplyFilters,
  title,
}) => {
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    onApplyFilters({});
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-bottom-0 py-2 bg-grd-primary">
            <h5 className="modal-title">Filter {title}</h5>
            <a
              href="javascript:;"
              className="primaery-menu-close"
              onClick={onClose}
            >
              <i className="material-icons-outlined">close</i>
            </a>
          </div>
          <div className="modal-body">
            <div className="form-body">
              <div className="row g-3">
                {Object.entries(filterOptions).map(([field, options]) => (
                  <div key={field} className="col-12">
                    <label className="form-label text-capitalize">
                      {field.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                    </label>
                    {field.includes("date") || field.includes("created") ? (
                      <div className="row g-2">
                        <div className="col-6">
                          <input
                            type="date"
                            className="form-control"
                            placeholder="From Date"
                            onChange={(e) =>
                              handleFilterChange(
                                `${field}_from`,
                                e.target.value,
                              )
                            }
                          />
                          <small className="text-muted">From</small>
                        </div>
                        <div className="col-6">
                          <input
                            type="date"
                            className="form-control"
                            placeholder="To Date"
                            onChange={(e) =>
                              handleFilterChange(`${field}_to`, e.target.value)
                            }
                          />
                          <small className="text-muted">To</small>
                        </div>
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        onChange={(e) =>
                          handleFilterChange(field, e.target.value)
                        }
                        value={filters[field] || ""}
                      >
                        <option value="">All {field.replace(/_/g, " ")}</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer border-top-0">
            <button
              type="button"
              className="btn btn-grd-royal px-4"
              onClick={handleClear}
            >
              Clear All
            </button>
            <button
              type="button"
              className="btn btn-grd-primary px-4"
              onClick={handleApply}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
