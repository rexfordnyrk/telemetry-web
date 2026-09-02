import { buildApiUrl, getAuthHeaders } from "../config/api";

export async function downloadCsv(
  path: string,
  params: URLSearchParams,
  token?: string | null,
): Promise<void> {
  const url = buildApiUrl(path) + "?" + params.toString();
  const res = await fetch(url, { headers: getAuthHeaders(token ?? undefined) });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const filename = parseFilename(res.headers.get("content-disposition")) ?? "export.csv";
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

function parseFilename(cd: string | null): string | undefined {
  if (!cd) return undefined;
  const m = /filename="?([^"]+)"?/.exec(cd);
  return m?.[1];
}
