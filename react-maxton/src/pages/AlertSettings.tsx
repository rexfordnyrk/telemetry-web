import React, { useEffect, useState } from "react";
import { Card, Form, Button, Table } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchRules, fetchEvents, updateRule } from "../store/slices/alertsSlice";

const bytesToMB = (bytes: number) => Math.round((bytes / (1024 * 1024)) * 100) / 100;
const mbToBytes = (mb: number) => Math.round(mb * 1024 * 1024);

interface OfflineDraft {
  is_enabled: boolean;
  offline_hours: number;
}

interface SpikeDraft {
  is_enabled: boolean;
  multiplier: number;
  floor_mb: number;
  lookback_days: number;
}

const AlertSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { rules, events, loading, error } = useAppSelector((state) => state.alerts);

  const deviceOfflineRule = rules.find((rule) => rule.rule_type === "device_offline");
  const usageSpikeRule = rules.find((rule) => rule.rule_type === "usage_spike");

  const [offlineDraft, setOfflineDraft] = useState<OfflineDraft | null>(null);
  const [spikeDraft, setSpikeDraft] = useState<SpikeDraft | null>(null);

  useEffect(() => {
    dispatch(fetchRules());
    dispatch(fetchEvents(100));
  }, [dispatch]);

  const offlineValue: OfflineDraft | null =
    offlineDraft ??
    (deviceOfflineRule
      ? {
          is_enabled: deviceOfflineRule.is_enabled,
          offline_hours: Number(deviceOfflineRule.params?.offline_hours ?? 24),
        }
      : null);

  const spikeValue: SpikeDraft | null =
    spikeDraft ??
    (usageSpikeRule
      ? {
          is_enabled: usageSpikeRule.is_enabled,
          multiplier: Number(usageSpikeRule.params?.multiplier ?? 3),
          floor_mb: bytesToMB(Number(usageSpikeRule.params?.floor_bytes ?? 0)),
          lookback_days: Number(usageSpikeRule.params?.lookback_days ?? 7),
        }
      : null);

  const handleSaveOffline = () => {
    if (!offlineValue) return;
    dispatch(
      updateRule({
        ruleType: "device_offline",
        is_enabled: offlineValue.is_enabled,
        params: { offline_hours: offlineValue.offline_hours },
      })
    );
  };

  const handleSaveSpike = () => {
    if (!spikeValue) return;
    dispatch(
      updateRule({
        ruleType: "usage_spike",
        is_enabled: spikeValue.is_enabled,
        params: {
          multiplier: spikeValue.multiplier,
          floor_bytes: mbToBytes(spikeValue.floor_mb),
          lookback_days: spikeValue.lookback_days,
        },
      })
    );
  };

  return (
    <MainLayout>
      <div className="page-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Settings</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Alert Settings
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Card className="rounded-4 mb-4">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Device offline</h5>
            {offlineValue ? (
              <>
                <Form.Check
                  type="switch"
                  id="deviceOfflineEnabled"
                  label="Enabled"
                  className="mb-3"
                  checked={offlineValue.is_enabled}
                  onChange={(e) =>
                    setOfflineDraft({ ...offlineValue, is_enabled: e.target.checked })
                  }
                />
                <Form.Group className="mb-3" controlId="offlineHours">
                  <Form.Label>Offline hours</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={168}
                    value={offlineValue.offline_hours}
                    onChange={(e) =>
                      setOfflineDraft({
                        ...offlineValue,
                        offline_hours: Number(e.target.value),
                      })
                    }
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSaveOffline} disabled={loading}>
                  Save
                </Button>
              </>
            ) : (
              <p className="text-muted mb-0">Loading…</p>
            )}
          </Card.Body>
        </Card>

        <Card className="rounded-4 mb-4">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Usage spike</h5>
            {spikeValue ? (
              <>
                <Form.Check
                  type="switch"
                  id="usageSpikeEnabled"
                  label="Enabled"
                  className="mb-3"
                  checked={spikeValue.is_enabled}
                  onChange={(e) =>
                    setSpikeDraft({ ...spikeValue, is_enabled: e.target.checked })
                  }
                />
                <Form.Group className="mb-3" controlId="multiplier">
                  <Form.Label>Multiplier</Form.Label>
                  <Form.Control
                    type="number"
                    min={2}
                    max={10}
                    value={spikeValue.multiplier}
                    onChange={(e) =>
                      setSpikeDraft({ ...spikeValue, multiplier: Number(e.target.value) })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="floorMB">
                  <Form.Label>Floor MB</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={spikeValue.floor_mb}
                    onChange={(e) =>
                      setSpikeDraft({ ...spikeValue, floor_mb: Number(e.target.value) })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lookbackDays">
                  <Form.Label>Lookback days</Form.Label>
                  <Form.Control
                    type="number"
                    min={3}
                    max={30}
                    value={spikeValue.lookback_days}
                    onChange={(e) =>
                      setSpikeDraft({ ...spikeValue, lookback_days: Number(e.target.value) })
                    }
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSaveSpike} disabled={loading}>
                  Save
                </Button>
              </>
            ) : (
              <p className="text-muted mb-0">Loading…</p>
            )}
          </Card.Body>
        </Card>

        <Card className="rounded-4">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Recent alert events</h5>
            <div className="table-responsive">
              <Table striped>
                <thead>
                  <tr>
                    <th>Fired at</th>
                    <th>Rule</th>
                    <th>Device</th>
                    <th>Programme</th>
                    <th>Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>{new Date(event.fired_at).toLocaleString()}</td>
                      <td>{event.rule_type}</td>
                      <td>{event.device_id || "—"}</td>
                      <td>{event.programme || "—"}</td>
                      <td>
                        {event.delivered_at
                          ? "Delivered"
                          : event.delivery_error
                          ? "Error"
                          : "Pending"}
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        No events found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AlertSettings;
