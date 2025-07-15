interface JQueryStatic {
  fn: {
    DataTable: {
      (...args: any[]): any;
      isDataTable(selector: string): boolean;
    };
    peity?: any;
  };
  (...args: any[]): any;
}

interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
  PerfectScrollbar?: any;
}

declare var $: JQueryStatic;
declare var jQuery: JQueryStatic;
