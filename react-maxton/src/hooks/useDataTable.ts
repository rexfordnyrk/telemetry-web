import { useEffect, useRef } from "react";

interface DataTableOptions {
  responsive?: boolean;
  pageLength?: number;
  lengthChange?: boolean;
  searching?: boolean;
  ordering?: boolean;
  info?: boolean;
  autoWidth?: boolean;
  order?: Array<[number, string]>;
  columnDefs?: Array<{ orderable: boolean; targets: number | number[] }>;
}

export const useDataTable = (
  tableId: string,
  data: any[],
  options: DataTableOptions = {},
) => {
  const isInitializedRef = useRef(false);
  const tableInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Don't initialize if already done or if jQuery/DataTable isn't available
    if (isInitializedRef.current || !window.$ || !window.$.fn.DataTable) {
      return;
    }

    const selector = `#${tableId}`;

    const initializeDataTable = () => {
      try {
        // Double-check the table element exists
        const tableElement = document.getElementById(tableId);
        if (!tableElement) {
          console.warn(
            `DataTable: Table element with ID '${tableId}' not found`,
          );
          return;
        }

        // Destroy any existing DataTable instance
        if (window.$.fn.DataTable.isDataTable(selector)) {
          const existingTable = window.$(selector).DataTable();
          existingTable.destroy();
          // Clear the table HTML to reset state
          window.$(selector).empty();
        }

        // Wait a bit for DOM to settle
        setTimeout(() => {
          // Re-check element exists after timeout
          const tableEl = document.getElementById(tableId);
          if (!tableEl || isInitializedRef.current) return;

          // Initialize DataTable with default options
          const defaultOptions: DataTableOptions = {
            responsive: true,
            pageLength: 10,
            lengthChange: true,
            searching: true,
            ordering: true,
            info: true,
            autoWidth: false,
            order: [[0, "asc"]],
            columnDefs: [
              { orderable: false, targets: -1 }, // Disable ordering on last column (actions)
            ],
            ...options,
          };

          try {
            tableInstanceRef.current = window
              .$(selector)
              .DataTable(defaultOptions);
            isInitializedRef.current = true;
            console.log(`DataTable initialized for ${tableId}`);
          } catch (error) {
            console.error(
              `Error initializing DataTable for ${tableId}:`,
              error,
            );
          }
        }, 150);
      } catch (error) {
        console.error(`Error in DataTable setup for ${tableId}:`, error);
      }
    };

    // Initialize after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeDataTable, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);

      if (isInitializedRef.current && window.$ && window.$.fn.DataTable) {
        try {
          const selector = `#${tableId}`;
          if (window.$.fn.DataTable.isDataTable(selector)) {
            window.$(selector).DataTable().destroy();
            console.log(`DataTable destroyed for ${tableId}`);
          }
        } catch (error) {
          console.warn(`Error destroying DataTable for ${tableId}:`, error);
        }
      }

      isInitializedRef.current = false;
      tableInstanceRef.current = null;
    };
  }, []); // Empty dependency array - only run once

  // Effect to handle data changes (reinitialize if needed)
  useEffect(() => {
    if (
      isInitializedRef.current &&
      tableInstanceRef.current &&
      data.length > 0
    ) {
      try {
        // Clear and redraw the table with new data
        tableInstanceRef.current.clear().draw();
      } catch (error) {
        console.warn(`Error updating DataTable data for ${tableId}:`, error);
      }
    }
  }, [data, tableId]);

  return {
    isInitialized: isInitializedRef.current,
    tableInstance: tableInstanceRef.current,
  };
};
