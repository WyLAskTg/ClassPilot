const assert = require("assert");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

function normalizeOptionalUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? trimmed : "";
  } catch {
    return "";
  }
}

function normalizeCourse(course) {
  const recurrence = ["weekly", "biweekly", "monthly", "dates"].includes(course.recurrence)
    ? course.recurrence
    : "weekly";
  const days = Array.isArray(course.days)
    ? course.days.map(String).filter((day) => ["1", "2", "3", "4", "5", "6", "7"].includes(day))
    : [course.day].filter(Boolean).map(String);

  return {
    id: course.id || "generated",
    name: String(course.name || "").trim() || "Untitled",
    type: ["lecture", "tutorial", "lab", "seminar", "exam", "other"].includes(course.type)
      ? course.type
      : "lecture",
    recurrence,
    days: [...new Set(days)].sort((a, b) => Number(a) - Number(b)),
    anchorDate: isValidDateString(course.anchorDate) ? course.anchorDate : "",
    dates: Array.isArray(course.dates) ? course.dates.filter(isValidDateString).sort() : [],
    start: String(course.start || "08:00"),
    end: String(course.end || "09:00"),
    location: String(course.location || ""),
    link: normalizeOptionalUrl(course.link),
    notes: String(course.notes || ""),
  };
}

assert.strictEqual(packageJson.version, "1.0.0", "package version should stay at 1.0.0 for this release");
assert.deepStrictEqual(normalizeCourse({ name: " CS101 ", days: [3, "1", "3"], link: "https://example.com" }).days, [
  "1",
  "3",
]);
assert.strictEqual(normalizeCourse({ name: "", type: "bad", recurrence: "bad" }).name, "Untitled");
assert.strictEqual(normalizeCourse({ link: "javascript:alert(1)" }).link, "");
assert.strictEqual(normalizeCourse({ link: "mailto:teacher@example.com" }).link, "mailto:teacher@example.com");
assert.deepStrictEqual(normalizeCourse({ recurrence: "dates", dates: ["2026-05-20", "not-a-date"] }).dates, [
  "2026-05-20",
]);

console.log("State tests passed");
