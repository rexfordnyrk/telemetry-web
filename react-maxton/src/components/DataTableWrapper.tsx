import React from "react";
import { useDataTable } from "../hooks/useDataTable";
import type { DataTableOptions } from "../hooks/useDataTable";

interface DataTableWrapperProps extends React.TableHTMLAttributes<HTMLTableElement> {
  id: string;
  data: any[];
  options?: DataTableOptions;
  shouldInitialize?: boolean;
}

const DataTableWrapper: React.FC<DataTableWrapperProps> = ({
  id,
  data,
  options,
  shouldInitialize = true,
  className,
  style,
  ...rest
}) => {
  useDataTable(id, data, options, shouldInitialize);
  // Intentionally render no children so DataTables fully owns the DOM subtree
  return <table id={id} className={className} style={style} {...rest} />;
};

export default DataTableWrapper;
