import { useEffect, useRef, useCallback } from "react";

export interface DataTableOptions {
  responsive?: boolean;
  pageLength?: number;
  lengthChange?: boolean;
  searching?: boolean;
  ordering?: boolean;
  info?: boolean;
  autoWidth?: boolean;
  order?: Array<[number, string]>;
  columnDefs?: any[];
  columns?: any[];
  rowId?: string;
  data?: any[];
  processing?: boolean;
  serverSide?: boolean;
  deferRender?: boolean;
  dom?: string;
  /** When serverSide is true, custom ajax function (requestData, callback, settings) for fetching page data */
  ajax?: (data: any, callback: (json: { draw?: number; data: any[]; recordsTotal: number; recordsFiltered: number }) => void, settings: any) => void;
}

export const useDataTable = (
  tableId: string,
  data: any[],
  options: DataTableOptions = {},
  shouldInitialize: boolean = true,
) => {
  const isInitializedRef = useRef(false);
  const tableInstanceRef = useRef<any>(null);
  const isServerSide = options.serverSide === true;
  const manageDataInternally =
    !isServerSide && (options.data !== undefined || (Array.isArray(options.columns) && options.columns.length > 0));

  const destroyDataTable = useCallback(() => {
    if (tableInstanceRef.current && window.$ && typeof window.$.fn.DataTable === 'function') {
      try {
        const tableElement = document.getElementById(tableId);
        if (tableElement) {
          tableInstanceRef.current.destroy();
        }
      } catch (error) {
        console.warn('Error destroying DataTable:', error);
      }
      tableInstanceRef.current = null;
      isInitializedRef.current = false;
    }
  }, [tableId]);

  // Initialize once, with provided columns/options. Seed with initial data.
  useEffect(() => {
    if (!shouldInitialize || !window.$ || typeof window.$.fn.DataTable !== 'function') {
      return;
    }

    // Clean up any existing instance before initializing
    destroyDataTable();

    const timeoutId = setTimeout(() => {
      try {
        const $table = window.$(`#${tableId}`);
        if ($table.length > 0) {
          const defaultOptions: DataTableOptions = {
            processing: false,
            serverSide: false,
            deferRender: false,
            ...options,
          };

          if (manageDataInternally) {
            defaultOptions.data = options.data ?? data;
          } else if ("data" in defaultOptions) {
            delete (defaultOptions as Record<string, unknown>).data;
          }
          if (isServerSide && "data" in defaultOptions) {
            delete (defaultOptions as Record<string, unknown>).data;
          }

          tableInstanceRef.current = $table.DataTable(defaultOptions as any);
          isInitializedRef.current = true;
        }
      } catch (error) {
        console.error('Error initializing DataTable:', error);
        isInitializedRef.current = false;
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
    // Re-init only when structural options change (columns/dom/order/etc.) or shouldInitialize toggles
  }, [shouldInitialize, destroyDataTable, tableId, options, manageDataInternally]);

  // On data changes, update via DataTables API instead of destroying (skip for server-side; ajax drives data)
  useEffect(() => {
    if (!manageDataInternally || isServerSide) return;
    if (!isInitializedRef.current || !tableInstanceRef.current) return;
    try {
      const api = tableInstanceRef.current;
      api.rows().clear();
      if (Array.isArray(data) && data.length > 0) {
        api.rows.add(data);
      }
      api.draw(false);
    } catch (error) {
      console.warn('Error updating DataTable rows via API:', error);
    }
  }, [data, manageDataInternally]);

  useEffect(() => {
    return () => {
      destroyDataTable();
    };
  }, [destroyDataTable]);

  return {
    isInitialized: isInitializedRef.current,
    destroyDataTable,
    tableInstance: tableInstanceRef.current,
  };
};
