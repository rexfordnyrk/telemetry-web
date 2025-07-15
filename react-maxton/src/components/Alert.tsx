import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeAlert } from "../store/slices/alertSlice";

const Alert: React.FC = () => {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.alerts.alerts);

  const getAlertClasses = (type: string) => {
    const baseClasses =
      "alert alert-dismissible fade show d-flex align-items-center border-0";
    const typeClasses = {
      success: "bg-grd-success text-white",
      danger: "bg-grd-danger text-white",
      warning: "bg-grd-warning text-white",
      info: "bg-grd-info text-white",
    };
    return `${baseClasses} ${typeClasses[type as keyof typeof typeClasses] || typeClasses.info}`;
  };

  const getIcon = (type: string) => {
    const icons = {
      success: "check_circle",
      danger: "report_gmailerrorred",
      warning: "warning",
      info: "info",
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  const handleClose = (alertId: string) => {
    dispatch(removeAlert(alertId));
  };

  // Auto-remove alerts after 5 seconds
  useEffect(() => {
    alerts.forEach((alert) => {
      const timer = setTimeout(() => {
        dispatch(removeAlert(alert.id));
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [alerts, dispatch]);

  if (alerts.length === 0) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
      {alerts.map((alert) => (
        <div key={alert.id} className={getAlertClasses(alert.type)}>
          <span className="material-icons-outlined fs-2 me-3">
            {getIcon(alert.type)}
          </span>
          <div className="ms-3">
            <h6 className="mb-0 text-white">{alert.title}</h6>
            <div className="text-white">{alert.message}</div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => handleClose(alert.id)}
          ></button>
        </div>
      ))}
    </div>
  );
};

export default Alert;
