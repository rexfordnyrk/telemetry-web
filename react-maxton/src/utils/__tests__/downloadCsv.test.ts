import { downloadCsv } from "../downloadCsv";

describe("downloadCsv", () => {
  beforeEach(() => {
    (global.fetch as any) = jest.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["a,b\n1,2\n"], { type: "text/csv" })),
      headers: new Headers({
        "content-disposition": `attachment; filename="beneficiary-activity-all-today-20260901-090000.csv"`,
      }),
    });
    (window.URL as any).createObjectURL = jest.fn(() => "blob:mock");
    (window.URL as any).revokeObjectURL = jest.fn();
  });

  it("fetches with auth headers and clicks a download link", async () => {
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    await downloadCsv("/analytics/export/beneficiary-activity.csv",
      new URLSearchParams({ period: "today" }));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("beneficiary-activity.csv?period=today"),
      expect.objectContaining({ headers: expect.any(Object) }),
    );
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("throws on a non-OK response", async () => {
    (global.fetch as any) = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    await expect(
      downloadCsv("/analytics/export/summary.csv", new URLSearchParams()),
    ).rejects.toThrow();
  });

  it("includes Authorization header when token is provided", async () => {
    await downloadCsv("/analytics/export/summary.csv", new URLSearchParams(), "abc123");
    const call = (global.fetch as jest.Mock).mock.calls[0];
    const headers = call[1].headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer abc123");
  });
});
