import { escapeHtml } from "../escapeHtml";

describe("escapeHtml", () => {
  it("escapes <script> tags", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("a&b")).toBe("a&amp;b");
  });

  it("handles null safely", () => {
    expect(escapeHtml(null as any)).toBe("");
  });

  it("handles undefined safely", () => {
    expect(escapeHtml(undefined as any)).toBe("");
  });

  it("escapes both single and double quotes", () => {
    expect(escapeHtml(`'"`)).toBe("&#39;&quot;");
  });

  it("escapes all special characters together", () => {
    expect(escapeHtml('<script>alert("XSS\'s")</script>'));
    const result = escapeHtml('<script>alert("XSS\'s")</script>');
    expect(result).toBe(
      "&lt;script&gt;alert(&quot;XSS&#39;s&quot;)&lt;/script&gt;"
    );
  });

  it("handles normal text without escaping", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });

  it("escapes mixed content", () => {
    const result = escapeHtml("Test <img src=x onerror='alert(1)'> & danger");
    expect(result).toBe(
      "Test &lt;img src=x onerror=&#39;alert(1)&#39;&gt; &amp; danger"
    );
  });
});
