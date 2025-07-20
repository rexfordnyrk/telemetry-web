import { useEffect, useRef, useCallback } from "react";

interface DataTableOptions {
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
    // Don't initialize if condition is false, already done, or if jQuery/DataTable isn't available
    if (!shouldInitialize || isInitializedRef.current || !window.$ || typeof window.$.fn.DataTable !== 'function') {
      return;
    }

    // Clean up any existing instance before initializing
    destroyDataTable();

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      try {
        // Initialize DataTable with DOM-based configuration
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
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [shouldInitialize, options, destroyDataTable]);

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

  // Effect to handle data changes - for React-rendered tables, we don't need to update data
  // since React handles the rendering and DataTable reads from the DOM
  useEffect(() => {
    if (isInitializedRef.current && tableInstanceRef.current && data.length > 0) {
      try {
        // Check if table still exists in DOM
        const tableElement = document.getElementById(tableId);
        if (!tableElement) {
          console.warn('Table element not found, destroying DataTable');
          destroyDataTable();
          return;
        }

        // For React-rendered tables, just redraw to pick up new DOM content
        tableInstanceRef.current.draw();
      } catch (error) {
        console.warn('Error updating DataTable data:', error);
        // If there's an error updating, reinitialize the table
        destroyDataTable();
        isInitializedRef.current = false;
      }
    }
  }, [data, destroyDataTable, tableId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyDataTable();
    };
  }, [destroyDataTable]);

  return {
    isInitialized: isInitializedRef.current,
    destroyDataTable,
  };
};
