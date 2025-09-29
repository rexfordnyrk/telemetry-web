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
  processing?: boolean;
  serverSide?: boolean;
  deferRender?: boolean;
  dom?: string;
}

export const useDataTable = (
  tableId: string,
  data: any[],
  options: DataTableOptions = {},
  shouldInitialize: boolean = true,
) => {
  const isInitializedRef = useRef(false);
  const tableInstanceRef = useRef<any>(null);

  // Cleanup function to destroy DataTable instance
  const destroyDataTable = useCallback(() => {
    if (tableInstanceRef.current && window.$ && typeof window.$.fn.DataTable === 'function') {
      try {
        // Check if the table still exists in DOM before destroying
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

  useEffect(() => {
    // Don't initialize if condition is false or if jQuery/DataTable isn't available
    if (!shouldInitialize || !window.$ || typeof window.$.fn.DataTable !== 'function') {
      return;
    }

    // Clean up any existing instance before initializing
    destroyDataTable();

    // Small delay to ensure DOM is ready
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
          tableInstanceRef.current = $table.DataTable(defaultOptions);
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
  }, [shouldInitialize, options, destroyDataTable, tableId, data]);

  // Reset initialization flag when shouldInitialize changes
  useEffect(() => {
    if (!shouldInitialize) {
      destroyDataTable();
    } else if (shouldInitialize && !isInitializedRef.current) {
      // If shouldInitialize becomes true and we're not initialized, 
      // the main initialization effect will handle it
      // This is just to ensure we don't have stale state
    }
  }, [shouldInitialize, destroyDataTable]);

  // On data changes, destroy the DataTable so it can be re-initialized cleanly in the init effect above.
  useEffect(() => {
    if (isInitializedRef.current) {
      destroyDataTable();
    }
    // Re-init happens via dependency on `data` in the init effect
  }, [data, destroyDataTable]);

  // Cleanup on unmount
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
