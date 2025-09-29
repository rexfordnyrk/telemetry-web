import React, { PropsWithChildren } from "react";
import { useDataTable } from "../hooks/useDataTable";
import type { DataTableOptions } from "../hooks/useDataTable";

interface DataTableWrapperProps extends React.TableHTMLAttributes<HTMLTableElement> {
  id: string;
  data: any[];
  options?: DataTableOptions;
  shouldInitialize?: boolean;
}

const DataTableWrapper: React.FC<PropsWithChildren<DataTableWrapperProps>> = ({
  id,
  data,
  options,
  shouldInitialize = true,
  children,
  className,
  style,
  ...rest
}) => {
  useDataTable(id, data, options, shouldInitialize);
  return (
    <table id={id} className={className} style={style} {...rest}>
      {children}
    </table>
  );
};

export default DataTableWrapper;
