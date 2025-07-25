import React from "react";

interface ProgressWidgetProps {
  title: string;
  value: string;
  changePercentage: string;
  changeDirection: "up" | "down";
  progressLabel: string;
  progressPercentage: number;
  progressBarClass: string;
  leftToGoal?: string;
}

const defaultProps: Partial<ProgressWidgetProps> = {
  leftToGoal: "285 left to Goal",
};

const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  title,
  value,
  changePercentage,
  changeDirection,
  progressLabel,
  progressPercentage,
  progressBarClass,
  leftToGoal = defaultProps.leftToGoal!,
}) => {
  return (
    <div className="col">
      <div className="card rounded-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="">
              <h2 className="mb-0">{value}</h2>
            </div>
            <div className="">
              <p className={`dash-lable d-flex align-items-center gap-1 rounded mb-0 ${
                changeDirection === "up" 
                  ? "bg-success text-success" 
                  : "bg-danger text-danger"
                } bg-opacity-10`}>
                <span className="material-icons-outlined fs-6">
                  {changeDirection === "up" ? "arrow_upward" : "arrow_downward"}
                </span>
                {changePercentage}
              </p>
            </div>
          </div>
          <p className="mb-0">{title}</p>
          <div className="mt-4">
            <p className="mb-2 d-flex align-items-center justify-content-between">
              {leftToGoal}
              <span className="">{progressPercentage}%</span>
            </p>
            <div className="progress w-100" style={{ height: "6px" }}>
              <div
                className={`progress-bar ${progressBarClass}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressWidget;
