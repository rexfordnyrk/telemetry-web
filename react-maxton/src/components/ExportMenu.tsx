import React from "react";
import { Dropdown } from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { downloadCsv } from "../utils/downloadCsv";

const DATASETS: { label: string; path: string }[] = [
  { label: "Dashboard Summary",    path: "/api/v1/analytics/export/summary.csv" },
  { label: "Beneficiary Activity", path: "/api/v1/analytics/export/beneficiary-activity.csv" },
  { label: "App Usage",            path: "/api/v1/analytics/export/app-usage.csv" },
  { label: "Programme Breakdown",  path: "/api/v1/analytics/export/programme-breakdown.csv" },
];

const ExportMenu: React.FC = () => {
  const g = useAppSelector((s) => s.globalFilters);
  const token = useAppSelector((s) => s.auth.token);

  const trigger = async (path: string) => {
    const params = new URLSearchParams({
      period: g.period,
      programme: g.programme,
      organisation: g.organisation,
      district: g.district,
    });
    try {
      await downloadCsv(path, params, token);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Export failed:", err);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-primary" size="sm">
        <i className="material-icons-outlined me-1" style={{ fontSize: 16 }}>download</i>
        Export
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {DATASETS.map((d) => (
          <Dropdown.Item key={d.path} onClick={() => trigger(d.path)}>{d.label}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExportMenu;
