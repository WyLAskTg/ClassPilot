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

function getCourseTitleParts(value) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  const codePattern = "([A-Za-z]{2,}\\s*\\d{2,}[A-Za-z0-9-]*|[A-Za-z]+\\d+[A-Za-z0-9-]*|\\d+[A-Za-z]+[A-Za-z0-9-]*)";
  const separatedMatch = text.match(new RegExp(`^${codePattern}(?:\\s*[:\\uFF1A\\-\\u2013\\u2014]\\s*|\\s+)(.+)$`));
  const codeOnlyMatch = text.match(new RegExp(`^${codePattern}$`));

  if (separatedMatch) {
    return {
      code: separatedMatch[1].replace(/\s+/g, ""),
      name: separatedMatch[2].trim(),
    };
  }

  if (codeOnlyMatch) {
    return {
      code: codeOnlyMatch[1].replace(/\s+/g, ""),
      name: "",
    };
  }

  return { code: "", name: text };
}

function normalizeCourseIdentity(course) {
  const code = String(course.code || "").trim();
  const name = String(course.name || "").trim().replace(/\s+/g, " ");

  if (code) {
    return {
      code,
      name: name || code || "Untitled",
    };
  }

  const legacy = getCourseTitleParts(name);
  if (legacy.code && legacy.name) return legacy;
  if (legacy.code) return { code: legacy.code, name: legacy.code };
  return { code: "", name: legacy.name || "Untitled" };
}

function normalizeCourseType(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeCourse(course) {
  const recurrence = ["weekly", "biweekly", "monthly", "dates"].includes(course.recurrence)
    ? course.recurrence
    : "weekly";
  const days = Array.isArray(course.days)
    ? course.days.map(String).filter((day) => ["1", "2", "3", "4", "5", "6", "7"].includes(day))
    : [course.day].filter(Boolean).map(String);

  const identity = normalizeCourseIdentity(course);

  return {
    id: course.id || "generated",
    code: identity.code,
    name: identity.name,
    type: normalizeCourseType(course.type),
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

assert.strictEqual(packageJson.version, "2.0.1", "package version should match this release");
assert.deepStrictEqual(normalizeCourse({ name: " CS101 ", days: [3, "1", "3"], link: "https://example.com" }).days, [
  "1",
  "3",
]);
assert.deepStrictEqual(
  {
    code: normalizeCourse({ name: "CS101 Algorithms" }).code,
    name: normalizeCourse({ name: "CS101 Algorithms" }).name,
  },
  { code: "CS101", name: "Algorithms" },
);
assert.deepStrictEqual(
  {
    code: normalizeCourse({ code: " MATH301 ", name: " Quiz " }).code,
    name: normalizeCourse({ code: " MATH301 ", name: " Quiz " }).name,
  },
  { code: "MATH301", name: "Quiz" },
);
assert.strictEqual(normalizeCourse({ name: "", type: "bad", recurrence: "bad" }).name, "Untitled");
assert.strictEqual(normalizeCourse({ name: "STAT 230", type: " LEC 001 " }).type, "LEC 001");
assert.strictEqual(normalizeCourse({ link: "javascript:alert(1)" }).link, "");
assert.strictEqual(normalizeCourse({ link: "mailto:teacher@example.com" }).link, "mailto:teacher@example.com");
assert.deepStrictEqual(normalizeCourse({ recurrence: "dates", dates: ["2026-05-20", "not-a-date"] }).dates, [
  "2026-05-20",
]);

console.log("State tests passed");
