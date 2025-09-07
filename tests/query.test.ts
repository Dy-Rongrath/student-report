import { describe, it, expect } from "vitest";
import { readSort, readPaging, readSearch } from "@/lib/query";

function u(input: string) {
  return new URL(input, "https://example.com");
}

describe("query utils", () => {
  it("parses paging with bounds", () => {
    const { page, pageSize } = readPaging(u("/?page=2&pageSize=500"));
    expect(page).toBe(2);
    expect(pageSize).toBe(100); // capped
  });

  it("parses search", () => {
    expect(readSearch(u("/?q= hello "))).toBe("hello");
  });

  it("reads sort with allowlist and fallback", () => {
    const { sortField, sortDir } = readSort(u("/?sortField=hacker&sortDir=asc"), ["date", "name"], "date");
    expect(sortField).toBe("date");
    expect(sortDir).toBe("asc");
  });
});
