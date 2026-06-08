/**
 * Shared shape for CSV bulk-import responses.
 *
 * Both the beneficiary importer (§7.2) and the CIC visit importer (§7.3) use
 * this contract so the CsvImportReportModal can render either result without
 * caring which feature produced it.
 */

export interface CSVImportError {
  row: number;
  reason: string;
  fields?: Record<string, string>;
}

export interface CSVImportResult {
  created: number;
  skipped: number;
  errors: CSVImportError[];
}
