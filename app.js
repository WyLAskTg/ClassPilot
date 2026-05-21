const APP_STORAGE_KEY = "course-schedule-tool:v2";
const LEGACY_STORAGE_KEY = "course-schedule-tool:courses";
const START_MINUTES = 8 * 60;
const END_MINUTES = 22 * 60;
const TOTAL_MINUTES = END_MINUTES - START_MINUTES;
const DENSITIES = ["compact", "standard", "spacious"];
const THEMES = ["light", "dark", "system"];
const COURSE_TYPES = ["lecture", "tutorial", "lab", "seminar", "exam", "other"];
const COLOR_PALETTE = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#db2777",
  "#4f46e5",
  "#65a30d",
  "#ca8a04",
];

const I18N = {
  zh: {
    appTitle: "ClassPilot",
    language: "语言",
    density: "显示密度",
    densityCompact: "紧凑",
    densityStandard: "标准",
    densitySpacious: "宽松",
    theme: "主题",
    themeLight: "浅色",
    themeDark: "深色",
    themeSystem: "跟随系统",
    semesterSettings: "学期设置",
    activeSemester: "当前学期",
    semesterName: "学期名称",
    semesterStart: "开始日期",
    semesterEnd: "结束日期",
    saveSemester: "保存学期",
    newSemester: "新建学期",
    dataManagement: "数据管理",
    exportData: "导出数据",
    importData: "导入数据",
    exportDone: "数据已导出。",
    importDone: "数据已导入。",
    importInvalid: "导入文件格式不正确。",
    preferences: "偏好设置",
    reminderLead: "上课提醒",
    reminderOff: "关闭",
    reminder5: "提前 5 分钟",
    reminder10: "提前 10 分钟",
    reminder15: "提前 15 分钟",
    reminder30: "提前 30 分钟",
    reminder60: "提前 60 分钟",
    notificationEnabled: "桌面提醒已开启。",
    notificationDenied: "系统拒绝了通知权限，请在系统设置里允许 ClassPilot 通知。",
    notificationUnsupported: "当前环境不支持桌面通知。",
    notificationTitle: "{name} 即将上课",
    notificationBody: "{time} · {location}",
    blockDisplay: "课程块显示",
    showLocation: "地点",
    showType: "类型",
    showRecurrence: "重复规则",
    showActions: "按钮",
    search: "搜索",
    searchPlaceholder: "课程、地点或类型",
    filterType: "课程类型",
    allTypes: "全部类型",
    undo: "撤销",
    deletedCourse: "已删除 {name}",
    deleteUndone: "已恢复。",
    active: "进行中",
    archived: "已归档",
    addCourseTitle: "添加课程",
    courseCode: "课程代码",
    courseCodePlaceholder: "例如 CS101",
    courseName: "课程名称",
    courseNamePlaceholder: "例如 算法导论",
    courseType: "课程类型",
    typeLecture: "Lecture",
    typeTutorial: "Tutorial",
    typeLab: "Lab",
    typeSeminar: "Seminar",
    typeExam: "Exam",
    typeOther: "Other",
    recurrence: "重复方式",
    recurrenceWeekly: "每周",
    recurrenceBiweekly: "每两周",
    recurrenceMonthly: "每月",
    recurrenceDates: "指定日期",
    weekdays: "上课日",
    anchorDate: "首次上课日期",
    exactDates: "确切日期",
    exactDatesPlaceholder: "每行一个日期，例如 2026-09-14",
    exactDatesHelp: "每行输入一个日期，适合不固定的 tutorial/lab。",
    startTime: "开始时间",
    endTime: "结束时间",
    location: "地点",
    locationPlaceholder: "例如 A101",
    courseLink: "课程链接",
    courseLinkPlaceholder: "https://...",
    courseNotes: "备注",
    courseNotesPlaceholder: "Zoom 链接、老师邮箱、作业要求等",
    color: "颜色",
    autoColorHelp: "添加课程时会自动从 10 种颜色中分配。",
    addCourse: "添加课程",
    conflicts: "时间冲突",
    previousWeek: "上一周",
    thisWeek: "本周",
    nextWeek: "下一周",
    jumpDate: "跳转日期",
    time: "时间",
    editCourse: "编辑课程",
    courseDetails: "课程详情",
    closeDialog: "关闭窗口",
    openLink: "打开链接",
    noLink: "暂无链接",
    noNotes: "暂无备注",
    liveConflictWarning: "可能与 {count} 节课冲突",
    liveConflictMore: "另有 {count} 个冲突",
    cancel: "取消",
    saveChanges: "保存修改",
    edit: "编辑",
    duplicate: "复制",
    delete: "删除",
    noCourses: "这一周暂无课程",
    noSemester: "没有可用学期",
    conflictBadge: "冲突",
    conflictCount: "{count} 处",
    conflictMore: "另有 {count} 处冲突",
    courseStats: "课程统计",
    weekHours: "本周课时",
    classesThisWeek: "本周课程",
    totalCourses: "课程总数",
    conflictStat: "冲突",
    busiestDay: "最忙一天",
    typeBreakdown: "类型分布",
    hoursShort: "{count} 小时",
    classesShort: "{count} 节",
    noStats: "暂无本周课程",
    datesCount: "{count} 个日期",
    importedSemester: "当前学期",
    defaultSemester: "新学期",
    dayShort1: "周一",
    dayShort2: "周二",
    dayShort3: "周三",
    dayShort4: "周四",
    dayShort5: "周五",
    dayShort6: "周六",
    dayShort7: "周日",
    dayLong1: "星期一",
    dayLong2: "星期二",
    dayLong3: "星期三",
    dayLong4: "星期四",
    dayLong5: "星期五",
    dayLong6: "星期六",
    dayLong7: "星期日",
    unsetLocation: "未填写地点",
    errorCourseName: "课程名称不能为空。",
    errorNoDays: "必须选择至少一个上课日。",
    errorAnchorDate: "请填写首次上课日期。",
    errorExactDates: "请填写至少一个确切日期。",
    errorInvalidDates: "日期格式无效，请使用 YYYY-MM-DD。",
    errorTimeRequired: "请填写开始时间和结束时间。",
    errorTimeRange: "时间需要在 08:00 到 22:00 之间。",
    errorEndAfterStart: "结束时间必须晚于开始时间。",
    errorInvalidLink: "课程链接格式无效。",
    errorSemesterName: "学期名称不能为空。",
    errorSemesterDates: "学期结束日期必须晚于或等于开始日期。",
  },
  en: {
    appTitle: "ClassPilot",
    language: "Language",
    density: "Density",
    densityCompact: "Compact",
    densityStandard: "Standard",
    densitySpacious: "Spacious",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    semesterSettings: "Semester Settings",
    activeSemester: "Current Semester",
    semesterName: "Semester Name",
    semesterStart: "Start Date",
    semesterEnd: "End Date",
    saveSemester: "Save Semester",
    newSemester: "New Semester",
    dataManagement: "Data",
    exportData: "Export",
    importData: "Import",
    exportDone: "Data exported.",
    importDone: "Data imported.",
    importInvalid: "Invalid import file.",
    preferences: "Preferences",
    reminderLead: "Class Reminder",
    reminderOff: "Off",
    reminder5: "5 minutes before",
    reminder10: "10 minutes before",
    reminder15: "15 minutes before",
    reminder30: "30 minutes before",
    reminder60: "60 minutes before",
    notificationEnabled: "Desktop reminders are on.",
    notificationDenied: "Notifications are blocked. Allow ClassPilot notifications in system settings.",
    notificationUnsupported: "Desktop notifications are not supported here.",
    notificationTitle: "{name} starts soon",
    notificationBody: "{time} · {location}",
    blockDisplay: "Course Block",
    showLocation: "Location",
    showType: "Type",
    showRecurrence: "Repeat",
    showActions: "Buttons",
    search: "Search",
    searchPlaceholder: "Course, location, or type",
    filterType: "Course Type",
    allTypes: "All Types",
    undo: "Undo",
    deletedCourse: "Deleted {name}",
    deleteUndone: "Restored.",
    active: "Active",
    archived: "Archived",
    addCourseTitle: "Add Course",
    courseCode: "Course Code",
    courseCodePlaceholder: "e.g. CS101",
    courseName: "Course Name",
    courseNamePlaceholder: "e.g. Algorithms",
    courseType: "Course Type",
    typeLecture: "Lecture",
    typeTutorial: "Tutorial",
    typeLab: "Lab",
    typeSeminar: "Seminar",
    typeExam: "Exam",
    typeOther: "Other",
    recurrence: "Repeat",
    recurrenceWeekly: "Weekly",
    recurrenceBiweekly: "Every 2 Weeks",
    recurrenceMonthly: "Monthly",
    recurrenceDates: "Specific Dates",
    weekdays: "Weekdays",
    anchorDate: "First Class Date",
    exactDates: "Exact Dates",
    exactDatesPlaceholder: "One date per line, e.g. 2026-09-14",
    exactDatesHelp: "Use one date per line for irregular tutorials/labs.",
    startTime: "Start Time",
    endTime: "End Time",
    location: "Location",
    locationPlaceholder: "e.g. A101",
    courseLink: "Course Link",
    courseLinkPlaceholder: "https://...",
    courseNotes: "Notes",
    courseNotesPlaceholder: "Zoom link, instructor email, assignment notes",
    color: "Color",
    autoColorHelp: "New courses automatically use one of 10 distinct colors.",
    addCourse: "Add Course",
    conflicts: "Time Conflicts",
    previousWeek: "Previous",
    thisWeek: "This Week",
    nextWeek: "Next",
    jumpDate: "Jump To",
    time: "Time",
    editCourse: "Edit Course",
    courseDetails: "Course Details",
    closeDialog: "Close dialog",
    openLink: "Open Link",
    noLink: "No link",
    noNotes: "No notes",
    liveConflictWarning: "May conflict with {count} class(es)",
    liveConflictMore: "{count} more conflicts",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    edit: "Edit",
    duplicate: "Duplicate",
    delete: "Delete",
    noCourses: "No courses this week",
    noSemester: "No semester available",
    conflictBadge: "Conflict",
    conflictCount: "{count}",
    conflictMore: "{count} more conflicts",
    courseStats: "Course Stats",
    weekHours: "Weekly Hours",
    classesThisWeek: "Classes This Week",
    totalCourses: "Total Courses",
    conflictStat: "Conflicts",
    busiestDay: "Busiest Day",
    typeBreakdown: "Type Breakdown",
    hoursShort: "{count}h",
    classesShort: "{count} classes",
    noStats: "No classes this week",
    datesCount: "{count} dates",
    importedSemester: "Current Semester",
    defaultSemester: "New Semester",
    dayShort1: "Mon",
    dayShort2: "Tue",
    dayShort3: "Wed",
    dayShort4: "Thu",
    dayShort5: "Fri",
    dayShort6: "Sat",
    dayShort7: "Sun",
    dayLong1: "Monday",
    dayLong2: "Tuesday",
    dayLong3: "Wednesday",
    dayLong4: "Thursday",
    dayLong5: "Friday",
    dayLong6: "Saturday",
    dayLong7: "Sunday",
    unsetLocation: "No location",
    errorCourseName: "Course name is required.",
    errorNoDays: "Select at least one weekday.",
    errorAnchorDate: "Enter the first class date.",
    errorExactDates: "Enter at least one exact date.",
    errorInvalidDates: "Invalid date format. Use YYYY-MM-DD.",
    errorTimeRequired: "Enter both start and end times.",
    errorTimeRange: "Time must be between 08:00 and 22:00.",
    errorEndAfterStart: "End time must be later than start time.",
    errorInvalidLink: "Course link is not a valid URL.",
    errorSemesterName: "Semester name is required.",
    errorSemesterDates: "Semester end date must be on or after the start date.",
  },
};

const form = document.querySelector("#course-form");
const editForm = document.querySelector("#edit-form");
const semesterForm = document.querySelector("#semester-form");
const errorEl = document.querySelector("#form-error");
const editErrorEl = document.querySelector("#edit-error");
const semesterErrorEl = document.querySelector("#semester-error");
const weekHeader = document.querySelector("#week-header");
const timeColumn = document.querySelector("#time-column");
const daysGrid = document.querySelector("#days-grid");
const detailModal = document.querySelector("#detail-modal");
const detailTitle = document.querySelector("#detail-title");
const detailContent = document.querySelector("#detail-content");
const detailEditButton = document.querySelector("#detail-edit-button");
const detailDuplicateButton = document.querySelector("#detail-duplicate-button");
const detailDeleteButton = document.querySelector("#detail-delete-button");
const editModal = document.querySelector("#edit-modal");
const conflictPanel = document.querySelector("#conflict-panel");
const conflictCount = document.querySelector("#conflict-count");
const conflictList = document.querySelector("#conflict-list");
const semesterSelect = document.querySelector("#semester-select");
const semesterStatus = document.querySelector("#semester-status");
const newSemesterButton = document.querySelector("#new-semester-button");
const languageSelect = document.querySelector("#language-select");
const densitySelect = document.querySelector("#density-select");
const themeSelect = document.querySelector("#theme-select");
const exportButton = document.querySelector("#export-button");
const importButton = document.querySelector("#import-button");
const importFileInput = document.querySelector("#import-file");
const dataMessage = document.querySelector("#data-message");
const coursePalettePreview = document.querySelector("#course-palette-preview");
const editColorOptions = document.querySelector("#edit-color-options");
const reminderSelect = document.querySelector("#reminder-select");
const notificationStatus = document.querySelector("#notification-status");
const searchInput = document.querySelector("#search-input");
const typeFilter = document.querySelector("#type-filter");
const statsPanel = document.querySelector("#stats-panel");
const showLocationCheckbox = document.querySelector("#show-location");
const showTypeCheckbox = document.querySelector("#show-type");
const showRecurrenceCheckbox = document.querySelector("#show-recurrence");
const showActionsCheckbox = document.querySelector("#show-actions");
const undoToast = document.querySelector("#undo-toast");
const undoMessage = document.querySelector("#undo-message");
const undoButton = document.querySelector("#undo-button");
const formConflictPreview = document.querySelector("#form-conflict-preview");
const editConflictPreview = document.querySelector("#edit-conflict-preview");
const weekRange = document.querySelector("#week-range");
const weekDateInput = document.querySelector("#week-date");
const prevWeekButton = document.querySelector("#prev-week-button");
const todayWeekButton = document.querySelector("#today-week-button");
const nextWeekButton = document.querySelector("#next-week-button");

let state = loadState();
let editingCourseId = null;
let detailCourseId = null;
let lastFocusedElement = null;
let lastDeletedCourse = null;
let undoTimer = null;
const sentNotifications = new Set();

archivePastSemesters();
ensureActiveSemester();
saveState();

function t(key, values = {}) {
  const text = I18N[state.language]?.[key] || I18N.zh[key] || key;

  return Object.entries(values).reduce(
    (current, [name, value]) => current.replaceAll(`{${name}}`, String(value)),
    text,
  );
}

function getSemesterDisplayName(semester) {
  const name = String(semester?.name || "");
  const builtInNames = {
    importedSemester: [I18N.zh.importedSemester, I18N.en.importedSemester],
    defaultSemester: [I18N.zh.defaultSemester, I18N.en.defaultSemester],
  };

  for (const [key, names] of Object.entries(builtInNames)) {
    if (names.includes(name)) {
      return t(key);
    }
  }

  return name;
}

function loadState() {
  try {
    const stored = window.classPilotStorage?.loadSync?.();
    if (stored?.version === 2 && Array.isArray(stored.semesters)) {
      return sanitizeState(stored);
    }
  } catch {
    // Fall through to browser storage migration.
  }

  try {
    const stored = JSON.parse(localStorage.getItem(APP_STORAGE_KEY));
    if (stored?.version === 2 && Array.isArray(stored.semesters)) {
      return sanitizeState(stored);
    }
  } catch {
    // Fall through to legacy migration.
  }

  return migrateLegacyState();
}

function sanitizeState(stored) {
  const language = stored.language === "en" ? "en" : "zh";
  const semesters = stored.semesters.map((semester) => ({
    id: semester.id || uid(),
    name: String(semester.name || I18N[language].defaultSemester),
    startDate: isValidDateString(semester.startDate) ? semester.startDate : todayISO(),
    endDate: isValidDateString(semester.endDate) ? semester.endDate : formatISODate(addDays(parseDate(todayISO()), 110)),
    archived: Boolean(semester.archived),
    courses: Array.isArray(semester.courses) ? semester.courses.map(normalizeCourse).filter(Boolean) : [],
  }));

  return {
    version: 2,
    language,
    density: DENSITIES.includes(stored.density) ? stored.density : "standard",
    theme: THEMES.includes(stored.theme) ? stored.theme : "light",
    reminderLeadMinutes: normalizeReminderLead(stored.reminderLeadMinutes),
    displayOptions: normalizeDisplayOptions(stored.displayOptions),
    filters: normalizeFilters(stored.filters),
    activeSemesterId: stored.activeSemesterId || semesters[0]?.id || "",
    viewWeekStart: isValidDateString(stored.viewWeekStart) ? startOfWeekISO(stored.viewWeekStart) : startOfWeekISO(todayISO()),
    semesters,
  };
}

function migrateLegacyState() {
  let legacyCourses = [];

  try {
    const stored = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY));
    legacyCourses = Array.isArray(stored) ? stored : [];
  } catch {
    legacyCourses = [];
  }

  const startDate = startOfWeekISO(todayISO());
  const endDate = formatISODate(addDays(parseDate(startDate), 7 * 16 - 1));
  const semester = {
    id: uid(),
    name: I18N.zh.importedSemester,
    startDate,
    endDate,
    archived: false,
    courses: migrateLegacyCourses(legacyCourses),
  };

  return {
    version: 2,
    language: "zh",
    density: "standard",
    theme: "light",
    reminderLeadMinutes: 0,
    displayOptions: normalizeDisplayOptions(),
    filters: normalizeFilters(),
    activeSemesterId: semester.id,
    viewWeekStart: startDate,
    semesters: [semester],
  };
}

function normalizeReminderLead(value) {
  const minutes = Number(value);
  return [0, 5, 10, 15, 30, 60].includes(minutes) ? minutes : 0;
}

function normalizeDisplayOptions(options = {}) {
  return {
    location: options.location !== false,
    type: options.type !== false,
    recurrence: options.recurrence !== false,
    actions: options.actions !== false,
  };
}

function normalizeFilters(filters = {}) {
  return {
    query: String(filters.query || ""),
    type: COURSE_TYPES.includes(filters.type) ? filters.type : "all",
  };
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
  if (legacy.code && legacy.name) {
    return legacy;
  }

  if (legacy.code) {
    return {
      code: legacy.code,
      name: legacy.code,
    };
  }

  return {
    code: "",
    name: legacy.name || "Untitled",
  };
}

function migrateLegacyCourses(legacyCourses) {
  const grouped = new Map();

  legacyCourses.forEach((course) => {
    const key = course.groupId || `${course.id || uid()}`;
    const existing = grouped.get(key) || { ...course, days: [] };
    if (course.day) {
      existing.days.push(String(course.day));
    }
    grouped.set(key, existing);
  });

  return [...grouped.values()].map((course) => {
    const identity = normalizeCourseIdentity(course);

    return {
      id: uid(),
      code: identity.code,
      name: identity.name,
      type: COURSE_TYPES.includes(course.type) ? course.type : "lecture",
      recurrence: "weekly",
      days: [...new Set(course.days.map(String))].sort((a, b) => Number(a) - Number(b)),
      anchorDate: "",
      dates: [],
      start: String(course.start || "08:00"),
      end: String(course.end || "09:00"),
      location: String(course.location || ""),
      link: normalizeOptionalUrl(String(course.link || "")),
      notes: String(course.notes || ""),
      color: normalizePaletteColor(String(course.color || "")),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
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
    id: course.id || uid(),
    code: identity.code,
    name: identity.name,
    type: COURSE_TYPES.includes(course.type) ? course.type : "lecture",
    recurrence,
    days: [...new Set(days)].sort((a, b) => Number(a) - Number(b)),
    anchorDate: isValidDateString(course.anchorDate) ? course.anchorDate : "",
    dates: Array.isArray(course.dates) ? course.dates.filter(isValidDateString).sort() : [],
    start: String(course.start || "08:00"),
    end: String(course.end || "09:00"),
    location: String(course.location || ""),
    link: normalizeOptionalUrl(String(course.link || "")),
    notes: String(course.notes || ""),
    color: normalizePaletteColor(String(course.color || "")),
    createdAt: course.createdAt || new Date().toISOString(),
    updatedAt: course.updatedAt || new Date().toISOString(),
  };
}

function saveState() {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
  window.classPilotStorage?.save?.(state).catch((error) => {
    console.error("Failed to save ClassPilot data:", error);
  });
}

function archivePastSemesters() {
  const today = todayISO();
  state.semesters.forEach((semester) => {
    semester.archived = semester.endDate < today;
  });
}

function ensureActiveSemester() {
  if (state.semesters.length === 0) {
    const startDate = startOfWeekISO(todayISO());
    state.semesters.push({
      id: uid(),
      name: t("defaultSemester"),
      startDate,
      endDate: formatISODate(addDays(parseDate(startDate), 7 * 16 - 1)),
      archived: false,
      courses: [],
    });
  }

  if (!getActiveSemester()) {
    const active = state.semesters.find((semester) => !semester.archived) || state.semesters[0];
    state.activeSemesterId = active.id;
  }

  if (!isValidDateString(state.viewWeekStart)) {
    state.viewWeekStart = getInitialWeekForSemester(getActiveSemester());
  }
}

function getActiveSemester() {
  return state.semesters.find((semester) => semester.id === state.activeSemesterId) || null;
}

function getInitialWeekForSemester(semester) {
  if (!semester) return startOfWeekISO(todayISO());

  const today = todayISO();
  if (today >= semester.startDate && today <= semester.endDate) {
    return startOfWeekISO(today);
  }

  return startOfWeekISO(semester.startDate);
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function formatISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayISO() {
  return formatISODate(new Date());
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function diffDays(a, b) {
  const start = parseDate(a);
  const end = parseDate(b);
  return Math.round((end - start) / 86400000);
}

function startOfWeekISO(value) {
  const date = parseDate(value);
  const day = date.getDay() || 7;
  return formatISODate(addDays(date, 1 - day));
}

function getWeekDates() {
  const start = parseDate(state.viewWeekStart);
  return Array.from({ length: 7 }, (_, index) => formatISODate(addDays(start, index)));
}

function getDayValue(value) {
  const day = parseDate(value).getDay();
  return String(day === 0 ? 7 : day);
}

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
  return formatISODate(parseDate(value)) === value;
}

function timeToMinutes(time) {
  const [hours, minutes] = String(time).split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

function formatDisplayDate(value) {
  const date = parseDate(value);
  if (state.language === "en") {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function parseDateList(value) {
  const entries = String(value || "")
    .split(/[\s,;，；]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    dates: [...new Set(entries.filter(isValidDateString))].sort(),
    invalid: entries.filter((item) => !isValidDateString(item)),
  };
}

function applyTranslations() {
  document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";
  document.documentElement.dataset.density = state.density || "standard";
  document.documentElement.dataset.theme = getResolvedTheme();
  document.title = t("appTitle");
  languageSelect.value = state.language;
  densitySelect.value = state.density || "standard";
  themeSelect.value = state.theme || "light";
  reminderSelect.value = String(state.reminderLeadMinutes || 0);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-close-modal].icon-button, [data-close-detail].icon-button").forEach((button) => {
    button.setAttribute("aria-label", t("closeDialog"));
  });
}

function getResolvedTheme() {
  if (state.theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return THEMES.includes(state.theme) ? state.theme : "light";
}

function renderAll() {
  archivePastSemesters();
  ensureActiveSemester();
  applyTranslations();
  renderSemesterControls();
  renderPalettePreview();
  renderSettingsControls();
  renderWeekControls();
  updateRecurrenceFields(form);
  updateRecurrenceFields(editForm);
  renderDraftConflictPreview(form, formConflictPreview);
  if (!editModal.hidden) {
    renderDraftConflictPreview(editForm, editConflictPreview, editingCourseId);
  }
  renderHeader();
  renderTimeColumn();
  renderDayColumns();
  renderCurrentTimeLine();
  renderCourses();
  renderStatistics();
  saveState();
}

function renderSemesterControls() {
  const activeSemester = getActiveSemester();
  semesterSelect.innerHTML = state.semesters
    .map((semester) => {
      const status = semester.archived ? t("archived") : t("active");
      return `<option value="${semester.id}">${escapeHtml(getSemesterDisplayName(semester))} · ${status}</option>`;
    })
    .join("");
  semesterSelect.value = activeSemester?.id || "";

  if (!activeSemester) {
    semesterStatus.textContent = t("noSemester");
    return;
  }

  semesterStatus.textContent = activeSemester.archived ? t("archived") : t("active");
  semesterStatus.classList.toggle("is-archived", activeSemester.archived);
  semesterForm.elements.name.value = getSemesterDisplayName(activeSemester);
  semesterForm.elements.startDate.value = activeSemester.startDate;
  semesterForm.elements.endDate.value = activeSemester.endDate;
}

function renderPalettePreview() {
  coursePalettePreview.innerHTML = COLOR_PALETTE.map(
    (color) => `<span class="palette-dot" style="background: ${color}"></span>`,
  ).join("");
}

function renderSettingsControls() {
  const display = normalizeDisplayOptions(state.displayOptions);
  state.displayOptions = display;
  showLocationCheckbox.checked = display.location;
  showTypeCheckbox.checked = display.type;
  showRecurrenceCheckbox.checked = display.recurrence;
  showActionsCheckbox.checked = display.actions;
  searchInput.value = state.filters?.query || "";
  typeFilter.value = state.filters?.type || "all";

  if (state.reminderLeadMinutes > 0) {
    notificationStatus.textContent = getNotificationStatusText();
  } else {
    notificationStatus.textContent = "";
  }
}

function renderWeekControls() {
  const weekDates = getWeekDates();
  weekDateInput.value = weekDates[0];
  weekRange.textContent = `${weekDates[0]} - ${weekDates[6]}`;
}

function renderHeader() {
  const activeSemester = getActiveSemester();
  const weekDates = getWeekDates();

  weekHeader.innerHTML = `
    <div class="corner">${t("time")}</div>
    ${weekDates
      .map((date) => {
        const dayValue = getDayValue(date);
        const classes = [
          "day-heading",
          date === todayISO() ? "is-today" : "",
          activeSemester && !dateInRange(date, activeSemester.startDate, activeSemester.endDate) ? "is-outside-semester" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return `
          <div class="${classes}">
            <span>${t(`dayLong${dayValue}`)}</span>
            <strong>${formatDisplayDate(date)}</strong>
          </div>
        `;
      })
      .join("")}
  `;
}

function renderTimeColumn() {
  const labels = [];

  for (let minutes = START_MINUTES; minutes <= END_MINUTES; minutes += 60) {
    const top = ((minutes - START_MINUTES) / TOTAL_MINUTES) * 100;
    labels.push(`<span class="time-label" style="top: ${top}%">${minutesToTime(minutes)}</span>`);
  }

  timeColumn.innerHTML = labels.join("");
}

function renderDayColumns() {
  daysGrid.innerHTML = getWeekDates().map((date) => `<div class="day-column" data-date="${date}"></div>`).join("");
}

function renderCurrentTimeLine() {
  document.querySelectorAll(".current-time-line").forEach((line) => line.remove());

  const now = new Date();
  const today = formatISODate(now);
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (!getWeekDates().includes(today) || minutes < START_MINUTES || minutes > END_MINUTES) {
    return;
  }

  const todayColumn = daysGrid.querySelector(`[data-date="${today}"]`);
  if (!todayColumn) return;

  const top = ((minutes - START_MINUTES) / TOTAL_MINUTES) * 100;
  const line = document.createElement("div");
  line.className = "current-time-line";
  line.style.top = `${top}%`;
  line.innerHTML = `<span>${minutesToTime(minutes)}</span>`;
  todayColumn.append(line);
}

function renderCourses() {
  document.querySelectorAll(".course-block").forEach((block) => block.remove());
  document.querySelector(".empty-state")?.remove();

  const occurrences = getOccurrencesForWeek();
  renderConflictPanel(occurrences);

  if (occurrences.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = t("noCourses");
    daysGrid.append(emptyState);
    return;
  }

  const layoutById = buildLayoutByOccurrenceId(occurrences);
  occurrences
    .sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start || a.end - b.end)
    .forEach((occurrence) => {
      const column = daysGrid.querySelector(`[data-date="${occurrence.date}"]`);
      if (!column) return;

      const course = occurrence.course;
      const top = ((occurrence.start - START_MINUTES) / TOTAL_MINUTES) * 100;
      const height = ((occurrence.end - occurrence.start) / TOTAL_MINUTES) * 100;
      const layout = layoutById.get(occurrence.id) || { column: 0, columns: 1, isConflict: false };
      const slotWidth = 100 / layout.columns;
      const slotLeft = slotWidth * layout.column;
      const textColor = getReadableTextColor(course.color);
      const display = normalizeDisplayOptions(state.displayOptions);
      const typeBadge = display.type
        ? `<span class="type-badge">${t(`type${capitalize(course.type || "lecture")}`)}</span>`
        : "";
      const conflictBadge = layout.isConflict ? `<span class="conflict-badge">${t("conflictBadge")}</span>` : "";
      const locationLine = display.location && course.location
        ? `<p class="course-place">${escapeHtml(course.location)}</p>`
        : "";
      const recurrenceLine = display.recurrence
        ? `<p class="course-repeat">${escapeHtml(getCourseCompactSummary(course))}</p>`
        : "";
      const actions = display.actions
        ? `
          <div class="course-actions">
            <button class="edit-button" type="button" data-id="${course.id}">${t("edit")}</button>
            <button class="delete-button" type="button" data-id="${course.id}" aria-label="${t("delete")} ${escapeHtml(getCourseDisplayName(course))}">${t("delete")}</button>
          </div>
        `
        : "";

      const block = document.createElement("article");
      block.className = `course-block${layout.isConflict ? " is-conflict" : ""}`;
      block.dataset.courseId = course.id;
      block.dataset.date = occurrence.date;
      block.tabIndex = 0;
      block.setAttribute("role", "button");
      block.setAttribute("aria-label", `${t("editCourse")} ${getCourseDisplayName(course)}`);
      block.style.top = `${top}%`;
      block.style.height = `calc(${height}% - 8px)`;
      block.style.left = `calc(${slotLeft}% + 6px)`;
      block.style.width = `calc(${slotWidth}% - 10px)`;
      block.style.background = `linear-gradient(135deg, ${course.color}, ${darkenColor(course.color, 18)})`;
      block.style.color = textColor;
      block.innerHTML = `
        <div class="course-top">
          ${renderCourseTitle(course)}
          <div class="course-badges">
            ${typeBadge}
            ${conflictBadge}
          </div>
        </div>
        <div class="course-details">
          <p class="course-time">${course.start} - ${course.end}</p>
          ${locationLine}
          ${recurrenceLine}
        </div>
        ${actions}
      `;

      column.append(block);
    });
}

function renderStatistics() {
  const activeSemester = getActiveSemester();
  if (!activeSemester) {
    statsPanel.innerHTML = "";
    return;
  }

  const filteredCourses = activeSemester.courses.filter(courseMatchesFilters);
  const occurrences = getOccurrencesForWeek();
  const conflictTotal = getConflictPairs(occurrences).length;
  const totalMinutes = occurrences.reduce((sum, occurrence) => sum + occurrence.end - occurrence.start, 0);
  const dayCounts = new Map();
  const typeMinutes = new Map(COURSE_TYPES.map((type) => [type, 0]));

  occurrences.forEach((occurrence) => {
    dayCounts.set(occurrence.date, (dayCounts.get(occurrence.date) || 0) + 1);
    typeMinutes.set(
      occurrence.course.type,
      (typeMinutes.get(occurrence.course.type) || 0) + occurrence.end - occurrence.start,
    );
  });

  const busiestDate = [...dayCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  const busiestText = busiestDate
    ? `${t(`dayShort${getDayValue(busiestDate[0])}`)} · ${t("classesShort", { count: busiestDate[1] })}`
    : t("noStats");
  const typeRows = [...typeMinutes.entries()]
    .filter(([, minutes]) => minutes > 0)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([type, minutes]) => `
        <span>
          <strong>${t(`type${capitalize(type)}`)}</strong>
          ${formatHours(minutes)}
        </span>
      `,
    )
    .join("");

  statsPanel.innerHTML = `
    <div class="stats-heading">
      <h2>${t("courseStats")}</h2>
      <span>${t("typeBreakdown")}</span>
    </div>
    <div class="stats-grid">
      ${renderStatCard(t("weekHours"), formatHours(totalMinutes))}
      ${renderStatCard(t("classesThisWeek"), String(occurrences.length))}
      ${renderStatCard(t("totalCourses"), String(filteredCourses.length))}
      ${renderStatCard(t("conflictStat"), String(conflictTotal))}
      ${renderStatCard(t("busiestDay"), busiestText)}
    </div>
    <div class="type-breakdown">${typeRows || `<span>${t("noStats")}</span>`}</div>
  `;
}

function renderStatCard(label, value) {
  return `
    <article class="stat-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

function formatHours(minutes) {
  const hours = minutes / 60;
  const value = Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
  return t("hoursShort", { count: value });
}

function getOccurrencesForWeek() {
  const activeSemester = getActiveSemester();
  if (!activeSemester) return [];

  const weekDates = getWeekDates();
  const occurrences = [];

  activeSemester.courses.forEach((course) => {
    if (!courseMatchesFilters(course)) return;

    weekDates.forEach((date) => {
      if (!dateInRange(date, activeSemester.startDate, activeSemester.endDate)) return;
      if (!occursOnDate(course, date)) return;

      const start = timeToMinutes(course.start);
      const end = timeToMinutes(course.end);
      if (Number.isNaN(start) || Number.isNaN(end)) return;

      occurrences.push({
        id: `${course.id}:${date}`,
        courseId: course.id,
        course,
        date,
        start,
        end,
      });
    });
  });

  return occurrences;
}

function courseMatchesFilters(course) {
  const filters = normalizeFilters(state.filters);
  const query = filters.query.trim().toLowerCase();
  const typeLabel = t(`type${capitalize(course.type || "lecture")}`).toLowerCase();

  if (filters.type !== "all" && course.type !== filters.type) {
    return false;
  }

  if (!query) {
    return true;
  }

  return [
    course.code,
    course.name,
    getCourseDisplayName(course),
    course.location,
    course.link,
    course.notes,
    course.type,
    typeLabel,
    getCourseSummary(course),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function occursOnDate(course, date) {
  if (course.recurrence === "weekly") {
    return course.days.includes(getDayValue(date));
  }

  if (course.recurrence === "biweekly") {
    if (!course.anchorDate || date < course.anchorDate || !course.days.includes(getDayValue(date))) return false;
    const weekDiff = Math.floor(diffDays(startOfWeekISO(course.anchorDate), startOfWeekISO(date)) / 7);
    return weekDiff % 2 === 0;
  }

  if (course.recurrence === "monthly") {
    if (!course.anchorDate || date < course.anchorDate) return false;
    return parseDate(date).getDate() === parseDate(course.anchorDate).getDate();
  }

  if (course.recurrence === "dates") {
    return course.dates.includes(date);
  }

  return false;
}

function dateInRange(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

function buildLayoutByOccurrenceId(occurrences) {
  const layoutById = new Map();
  const byDate = new Map();

  occurrences.forEach((occurrence) => {
    const list = byDate.get(occurrence.date) || [];
    list.push(occurrence);
    byDate.set(occurrence.date, list);
  });

  byDate.forEach((items) => {
    const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
    getOverlapClusters(sorted).forEach((cluster) => {
      if (cluster.length === 1) {
        layoutById.set(cluster[0].id, { column: 0, columns: 1, isConflict: false });
        return;
      }

      const columnEnds = [];
      let maxColumns = 0;

      cluster.forEach((item) => {
        let columnIndex = columnEnds.findIndex((end) => end <= item.start);

        if (columnIndex === -1) {
          columnIndex = columnEnds.length;
          columnEnds.push(item.end);
        } else {
          columnEnds[columnIndex] = item.end;
        }

        item.column = columnIndex;
        maxColumns = Math.max(maxColumns, columnEnds.length);
      });

      cluster.forEach((item) => {
        layoutById.set(item.id, {
          column: item.column,
          columns: maxColumns,
          isConflict: true,
        });
      });
    });
  });

  return layoutById;
}

function getOverlapClusters(items) {
  const clusters = [];
  let cluster = [];
  let clusterEnd = -Infinity;

  items.forEach((item) => {
    if (cluster.length === 0 || item.start < clusterEnd) {
      cluster.push(item);
      clusterEnd = Math.max(clusterEnd, item.end);
      return;
    }

    clusters.push(cluster);
    cluster = [item];
    clusterEnd = item.end;
  });

  if (cluster.length > 0) {
    clusters.push(cluster);
  }

  return clusters;
}

function renderConflictPanel(occurrences) {
  const conflicts = getConflictPairs(occurrences);

  if (conflicts.length === 0) {
    conflictPanel.hidden = true;
    conflictList.innerHTML = "";
    conflictCount.textContent = "";
    return;
  }

  const visibleConflicts = conflicts.slice(0, 4);
  conflictPanel.hidden = false;
  conflictCount.textContent = t("conflictCount", { count: conflicts.length });
  conflictList.innerHTML = visibleConflicts
    .map(
      (conflict) => `
        <li>
          <strong>${formatDisplayDate(conflict.date)} ${conflict.timeRange}</strong>
          <span>${escapeHtml(conflict.first)} / ${escapeHtml(conflict.second)}</span>
        </li>
      `,
    )
    .join("");

  if (conflicts.length > visibleConflicts.length) {
    const rest = document.createElement("li");
    rest.className = "conflict-more";
    rest.textContent = t("conflictMore", { count: conflicts.length - visibleConflicts.length });
    conflictList.append(rest);
  }
}

function getConflictPairs(occurrences) {
  const conflicts = [];
  const byDate = new Map();

  occurrences.forEach((occurrence) => {
    const list = byDate.get(occurrence.date) || [];
    list.push(occurrence);
    byDate.set(occurrence.date, list);
  });

  byDate.forEach((items, date) => {
    const sorted = [...items].sort((a, b) => a.start - b.start || a.end - b.end);

    for (let i = 0; i < sorted.length; i += 1) {
      for (let j = i + 1; j < sorted.length; j += 1) {
        const first = sorted[i];
        const second = sorted[j];

        if (second.start >= first.end) break;

        const overlapStart = Math.max(first.start, second.start);
        const overlapEnd = Math.min(first.end, second.end);

        if (overlapEnd > overlapStart) {
          conflicts.push({
            date,
            timeRange: `${minutesToTime(overlapStart)} - ${minutesToTime(overlapEnd)}`,
            first: getCourseDisplayName(first.course),
            second: getCourseDisplayName(second.course),
          });
        }
      }
    }
  });

  return conflicts;
}

function getCourseSummary(course) {
  if (course.recurrence === "weekly") {
    return `${t("recurrenceWeekly")} · ${course.days.map((day) => t(`dayShort${day}`)).join(" / ")}`;
  }

  if (course.recurrence === "biweekly") {
    return `${t("recurrenceBiweekly")} · ${course.days.map((day) => t(`dayShort${day}`)).join(" / ")}`;
  }

  if (course.recurrence === "monthly") {
    return `${t("recurrenceMonthly")} · ${formatDisplayDate(course.anchorDate)}`;
  }

  return t("datesCount", { count: course.dates.length });
}

function renderCourseTitle(course) {
  const title = getCourseIdentity(course);
  const hasDuplicateName = title.code && title.name.toLowerCase() === title.code.toLowerCase();
  const nameLine = title.name && !hasDuplicateName
    ? `<span class="course-name">${escapeHtml(title.name)}</span>`
    : "";

  if (!title.code) {
    return `<h2 class="course-title course-title--plain">${nameLine}</h2>`;
  }

  return `
    <h2 class="course-title">
      <span class="course-code">${escapeHtml(title.code)}</span>
      ${nameLine}
    </h2>
  `;
}

function getCourseIdentity(course) {
  return {
    code: String(course.code || "").trim(),
    name: String(course.name || "").trim(),
  };
}

function getCourseDisplayName(course) {
  const { code, name } = getCourseIdentity(course);
  if (code && name && code.toLowerCase() !== name.toLowerCase()) return `${code} ${name}`;
  return name || code || "";
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

function getCourseCompactSummary(course) {
  if (course.recurrence === "weekly") {
    const days = formatCompactDays(course.days);
    return days ? `${t("recurrenceWeekly")} \u00b7 ${days}` : t("recurrenceWeekly");
  }

  if (course.recurrence === "biweekly") {
    const days = formatCompactDays(course.days);
    return days ? `${t("recurrenceBiweekly")} \u00b7 ${days}` : t("recurrenceBiweekly");
  }

  return getCourseSummary(course);
}

function formatCompactDays(days) {
  const orderedDays = [...new Set((days || []).map(String))]
    .filter((day) => ["1", "2", "3", "4", "5", "6", "7"].includes(day))
    .sort((a, b) => Number(a) - Number(b));

  if (state.language === "en") {
    const englishDays = {
      1: "M",
      2: "T",
      3: "W",
      4: "Th",
      5: "F",
      6: "Sa",
      7: "Su",
    };
    return orderedDays.map((day) => englishDays[day]).join("");
  }

  const chineseDays = {
    1: "\u4e00",
    2: "\u4e8c",
    3: "\u4e09",
    4: "\u56db",
    5: "\u4e94",
    6: "\u516d",
    7: "\u65e5",
  };

  return orderedDays.length
    ? `\u5468${orderedDays.map((day) => chineseDays[day]).join("/")}`
    : "";
}

function getCourseDraft(formElement) {
  const formData = new FormData(formElement);
  const parsedDates = parseDateList(formData.get("dates"));

  return {
    code: String(formData.get("code") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    type: COURSE_TYPES.includes(String(formData.get("type"))) ? String(formData.get("type")) : "lecture",
    recurrence: String(formData.get("recurrence") || "weekly"),
    days: formData.getAll("days").map(String).filter(Boolean),
    anchorDate: String(formData.get("anchorDate") || ""),
    dates: parsedDates.dates,
    invalidDates: parsedDates.invalid,
    start: String(formData.get("start") || ""),
    end: String(formData.get("end") || ""),
    location: String(formData.get("location") || "").trim(),
    link: String(formData.get("link") || "").trim(),
    notes: String(formData.get("notes") || "").trim(),
    color: String(formData.get("color") || ""),
  };
}

function validateCourse(course) {
  const start = timeToMinutes(course.start);
  const end = timeToMinutes(course.end);

  if (!course.name.trim()) return t("errorCourseName");
  if (Number.isNaN(start) || Number.isNaN(end)) return t("errorTimeRequired");
  if (start < START_MINUTES || end > END_MINUTES) return t("errorTimeRange");
  if (end <= start) return t("errorEndAfterStart");
  if (course.link && !isValidOptionalUrl(course.link)) return t("errorInvalidLink");

  if (["weekly", "biweekly"].includes(course.recurrence) && course.days.length === 0) {
    return t("errorNoDays");
  }

  if (["biweekly", "monthly"].includes(course.recurrence) && !isValidDateString(course.anchorDate)) {
    return t("errorAnchorDate");
  }

  if (course.recurrence === "dates") {
    if (course.invalidDates.length > 0) return t("errorInvalidDates");
    if (course.dates.length === 0) return t("errorExactDates");
  }

  return "";
}

function normalizeOptionalUrl(value) {
  const trimmed = String(value || "").trim();
  return isValidOptionalUrl(trimmed) ? trimmed : "";
}

function isValidOptionalUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return true;

  try {
    const url = new URL(trimmed);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function validateSemesterDraft(draft) {
  if (!draft.name.trim()) return t("errorSemesterName");
  if (!isValidDateString(draft.startDate) || !isValidDateString(draft.endDate) || draft.endDate < draft.startDate) {
    return t("errorSemesterDates");
  }

  return "";
}

function getDraftConflicts(draft, semester, excludeCourseId = "") {
  const draftStart = timeToMinutes(draft.start);
  const draftEnd = timeToMinutes(draft.end);

  if (!semester || Number.isNaN(draftStart) || Number.isNaN(draftEnd) || draftEnd <= draftStart) {
    return [];
  }

  const draftDates = getCourseDatesInSemester(draft, semester);
  if (draftDates.length === 0) return [];

  const conflicts = [];
  semester.courses.forEach((course) => {
    if (course.id === excludeCourseId) return;

    const start = timeToMinutes(course.start);
    const end = timeToMinutes(course.end);
    if (Number.isNaN(start) || Number.isNaN(end) || draftEnd <= start || draftStart >= end) return;

    const courseDates = new Set(getCourseDatesInSemester(course, semester));
    draftDates.forEach((date) => {
      if (!courseDates.has(date)) return;

      conflicts.push({
        date,
        courseName: getCourseDisplayName(course),
        timeRange: `${minutesToTime(Math.max(draftStart, start))} - ${minutesToTime(Math.min(draftEnd, end))}`,
      });
    });
  });

  return conflicts.sort((a, b) => a.date.localeCompare(b.date) || a.timeRange.localeCompare(b.timeRange));
}

function renderDraftConflictPreview(formElement, previewElement, excludeCourseId = "") {
  if (!previewElement) return;

  const activeSemester = getActiveSemester();
  const draft = getCourseDraft(formElement);
  const conflicts = getDraftConflicts(draft, activeSemester, excludeCourseId);

  if (conflicts.length === 0) {
    previewElement.hidden = true;
    previewElement.innerHTML = "";
    return;
  }

  const visibleConflicts = conflicts.slice(0, 3);
  previewElement.hidden = false;
  previewElement.innerHTML = `
    <strong>${t("liveConflictWarning", { count: conflicts.length })}</strong>
    <ul>
      ${visibleConflicts
        .map(
          (conflict) => `
            <li>
              ${formatDisplayDate(conflict.date)} ${conflict.timeRange}
              <span>${escapeHtml(conflict.courseName)}</span>
            </li>
          `,
        )
        .join("")}
      ${
        conflicts.length > visibleConflicts.length
          ? `<li>${t("liveConflictMore", { count: conflicts.length - visibleConflicts.length })}</li>`
          : ""
      }
    </ul>
  `;
}

function updateRecurrenceFields(formElement) {
  const recurrence = formElement.elements.recurrence?.value || "weekly";
  const showWeekdays = ["weekly", "biweekly"].includes(recurrence);
  const showAnchor = ["biweekly", "monthly"].includes(recurrence);
  const showDates = recurrence === "dates";

  formElement.querySelector(".weekday-field").hidden = !showWeekdays;
  formElement.querySelector(".anchor-field").hidden = !showAnchor;
  formElement.querySelector(".dates-field").hidden = !showDates;
}

function resetCourseForm() {
  form.reset();
  form.elements.recurrence.value = "weekly";
  form.elements.type.value = "lecture";
  form.elements.start.value = "08:00";
  form.elements.end.value = "09:00";
  updateRecurrenceFields(form);
  renderDraftConflictPreview(form, formConflictPreview);
}

function openDetailModal(courseId) {
  const course = getActiveSemester()?.courses.find((item) => item.id === courseId);
  if (!course) return;

  detailCourseId = course.id;
  lastFocusedElement = document.activeElement;
  detailTitle.textContent = getCourseDisplayName(course);
  detailContent.innerHTML = renderCourseDetails(course);
  detailModal.hidden = false;
  document.body.classList.add("modal-open");
  detailEditButton.focus();
}

function renderCourseDetails(course) {
  const identity = getCourseIdentity(course);
  const showName = identity.name && (!identity.code || identity.name.toLowerCase() !== identity.code.toLowerCase());
  const rows = [
    identity.code ? [t("courseCode"), identity.code] : null,
    showName ? [t("courseName"), identity.name] : null,
    [t("courseType"), t(`type${capitalize(course.type || "lecture")}`)],
    [t("recurrence"), getCourseSummary(course)],
    [t("startTime"), course.start],
    [t("endTime"), course.end],
    course.location ? [t("location"), course.location] : null,
  ].filter(Boolean);

  const linkHtml = course.link
    ? `<a href="${escapeHtml(course.link)}" target="_blank" rel="noreferrer">${t("openLink")}</a>`
    : `<span>${t("noLink")}</span>`;

  return `
    <dl class="detail-list">
      ${rows
        .map(
          ([label, value]) => `
            <div>
              <dt>${escapeHtml(label)}</dt>
              <dd>${escapeHtml(value)}</dd>
            </div>
          `,
        )
        .join("")}
      <div>
        <dt>${t("courseLink")}</dt>
        <dd>${linkHtml}</dd>
      </div>
    </dl>
    <section class="detail-notes">
      <h3>${t("courseNotes")}</h3>
      <p>${escapeHtml(course.notes || t("noNotes")).replaceAll("\n", "<br>")}</p>
    </section>
  `;
}

function closeDetailModal({ restoreFocus = true } = {}) {
  detailModal.hidden = true;
  detailCourseId = null;
  document.body.classList.remove("modal-open");

  if (restoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function openEditModal(courseId) {
  const course = getActiveSemester()?.courses.find((item) => item.id === courseId);
  if (!course) return;

  editingCourseId = course.id;
  lastFocusedElement = document.activeElement;
  editErrorEl.textContent = "";
  editForm.elements.code.value = course.code || "";
  editForm.elements.name.value = course.name;
  editForm.elements.type.value = course.type || "lecture";
  editForm.elements.recurrence.value = course.recurrence;
  editForm.elements.anchorDate.value = course.anchorDate || "";
  editForm.elements.dates.value = course.dates.join("\n");
  editForm.elements.start.value = course.start;
  editForm.elements.end.value = course.end;
  editForm.elements.location.value = course.location || "";
  editForm.elements.link.value = course.link || "";
  editForm.elements.notes.value = course.notes || "";
  editForm.elements.color.value = normalizePaletteColor(course.color);

  editForm.querySelectorAll('input[name="days"]').forEach((checkbox) => {
    checkbox.checked = course.days.includes(checkbox.value);
  });

  updateRecurrenceFields(editForm);
  renderEditColorOptions(editForm.elements.color.value);
  renderDraftConflictPreview(editForm, editConflictPreview, editingCourseId);
  editModal.hidden = false;
  document.body.classList.add("modal-open");
  editForm.elements.code.focus();
}

function renderEditColorOptions(selectedColor) {
  editColorOptions.innerHTML = COLOR_PALETTE.map((color) => {
    const isSelected = color === selectedColor;
    return `
      <button
        class="color-option${isSelected ? " is-selected" : ""}"
        type="button"
        data-color="${color}"
        style="background: ${color}"
        aria-label="${color}"
      ></button>
    `;
  }).join("");
}

function closeEditModal() {
  editModal.hidden = true;
  document.body.classList.remove("modal-open");
  editErrorEl.textContent = "";
  editingCourseId = null;

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function deleteCourse(courseId) {
  const activeSemester = getActiveSemester();
  if (!activeSemester) return;

  const index = activeSemester.courses.findIndex((course) => course.id === courseId);
  if (index === -1) return;

  const [deletedCourse] = activeSemester.courses.splice(index, 1);
  lastDeletedCourse = {
    course: deletedCourse,
    semesterId: activeSemester.id,
    index,
  };
  saveState();
  renderAll();
  showUndoToast(deletedCourse);
}

function duplicateCourse(courseId) {
  const activeSemester = getActiveSemester();
  if (!activeSemester) return;

  const index = activeSemester.courses.findIndex((course) => course.id === courseId);
  if (index === -1) return;

  const now = new Date().toISOString();
  const duplicatedCourse = {
    ...activeSemester.courses[index],
    id: uid(),
    createdAt: now,
    updatedAt: now,
  };

  activeSemester.courses.splice(index + 1, 0, duplicatedCourse);
  renderAll();
}

function handleCourseMenuAction({ action, courseId }) {
  if (!courseId) return;

  if (action === "edit") {
    openEditModal(courseId);
    return;
  }

  if (action === "duplicate") {
    duplicateCourse(courseId);
    return;
  }

  if (action === "delete") {
    deleteCourse(courseId);
  }
}

function showUndoToast(course) {
  clearTimeout(undoTimer);
  undoMessage.textContent = t("deletedCourse", { name: getCourseDisplayName(course) });
  undoToast.hidden = false;
  undoTimer = setTimeout(() => {
    undoToast.hidden = true;
    lastDeletedCourse = null;
  }, 8000);
}

function undoDelete() {
  if (!lastDeletedCourse) return;

  const semester = state.semesters.find((item) => item.id === lastDeletedCourse.semesterId);
  if (!semester) return;

  semester.courses.splice(lastDeletedCourse.index, 0, lastDeletedCourse.course);
  lastDeletedCourse = null;
  clearTimeout(undoTimer);
  undoToast.hidden = true;
  dataMessage.textContent = t("deleteUndone");
  renderAll();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function capitalize(value) {
  const text = String(value || "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeHexColor(hex) {
  return /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#2f80ed";
}

function normalizePaletteColor(hex) {
  const normalized = normalizeHexColor(hex);
  const lower = normalized.toLowerCase();
  if (COLOR_PALETTE.includes(lower)) return lower;
  return getNearestPaletteColor(lower);
}

function getNearestPaletteColor(hex) {
  const [red, green, blue] = hexToRgb(hex);

  return COLOR_PALETTE.map((color) => {
    const [paletteRed, paletteGreen, paletteBlue] = hexToRgb(color);
    const distance =
      (red - paletteRed) ** 2 +
      (green - paletteGreen) ** 2 +
      (blue - paletteBlue) ** 2;

    return { color, distance };
  }).sort((a, b) => a.distance - b.distance)[0].color;
}

function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex).replace("#", "");
  return [0, 2, 4].map((start) => parseInt(normalized.slice(start, start + 2), 16));
}

function getNextCourseColor(draft) {
  const activeSemester = getActiveSemester();
  if (!activeSemester) return COLOR_PALETTE[0];

  const normalizedName = getCourseDisplayName(draft).trim().toLowerCase();
  const conflictingColors = getConflictingColorsForDraft(draft, activeSemester);
  const matchingCourse = activeSemester.courses.find(
    (course) => getCourseDisplayName(course).trim().toLowerCase() === normalizedName && course.color,
  );

  if (matchingCourse && !conflictingColors.has(matchingCourse.color)) {
    return matchingCourse.color;
  }

  const usage = new Map(COLOR_PALETTE.map((color) => [color, 0]));
  activeSemester.courses.forEach((course) => {
    usage.set(course.color, (usage.get(course.color) || 0) + 1);
  });

  return [...COLOR_PALETTE]
    .filter((color) => !conflictingColors.has(color))
    .sort((a, b) => (usage.get(a) || 0) - (usage.get(b) || 0))[0] || COLOR_PALETTE[0];
}

function getConflictingColorsForDraft(draft, semester) {
  const colors = new Set();
  const draftStart = timeToMinutes(draft.start);
  const draftEnd = timeToMinutes(draft.end);

  if (Number.isNaN(draftStart) || Number.isNaN(draftEnd)) return colors;

  const draftDates = getCourseDatesInSemester(draft, semester);
  semester.courses.forEach((course) => {
    const start = timeToMinutes(course.start);
    const end = timeToMinutes(course.end);

    if (Number.isNaN(start) || Number.isNaN(end) || draftEnd <= start || draftStart >= end) {
      return;
    }

    const courseDates = getCourseDatesInSemester(course, semester);
    if (draftDates.some((date) => courseDates.includes(date))) {
      colors.add(course.color);
    }
  });

  return colors;
}

function getCourseDatesInSemester(course, semester) {
  const dates = [];
  let cursor = parseDate(semester.startDate);
  const end = parseDate(semester.endDate);

  while (cursor <= end) {
    const date = formatISODate(cursor);
    if (occursOnDate(course, date)) {
      dates.push(date);
    }
    cursor = addDays(cursor, 1);
  }

  return dates;
}

function darkenColor(hex, amount) {
  const normalized = normalizeHexColor(hex).replace("#", "");
  const channels = [0, 2, 4].map((start) => {
    const value = parseInt(normalized.slice(start, start + 2), 16);
    return Math.max(0, value - amount).toString(16).padStart(2, "0");
  });

  return `#${channels.join("")}`;
}

function getReadableTextColor(hex) {
  const normalized = normalizeHexColor(hex).replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 150 ? "#182230" : "#ffffff";
}

function getNotificationStatusText() {
  if (!("Notification" in window)) return t("notificationUnsupported");
  if (Notification.permission === "denied") return t("notificationDenied");
  if (Notification.permission === "granted") return t("notificationEnabled");
  return "";
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    notificationStatus.textContent = t("notificationUnsupported");
    return false;
  }

  if (Notification.permission === "granted") {
    notificationStatus.textContent = t("notificationEnabled");
    return true;
  }

  if (Notification.permission === "denied") {
    notificationStatus.textContent = t("notificationDenied");
    return false;
  }

  const permission = await Notification.requestPermission();
  notificationStatus.textContent =
    permission === "granted" ? t("notificationEnabled") : t("notificationDenied");
  return permission === "granted";
}

function checkReminders() {
  const lead = Number(state.reminderLeadMinutes || 0);
  if (lead <= 0 || !("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const now = new Date();
  const today = formatISODate(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();

  getReminderOccurrences(today).forEach((occurrence) => {
    const reminderAt = occurrence.start - lead;
    const secondsUntilReminder = (reminderAt - currentMinutes) * 60 - currentSeconds;
    const key = `${occurrence.course.id}:${today}:${lead}`;

    if (secondsUntilReminder <= 0 && secondsUntilReminder > -60 && !sentNotifications.has(key)) {
      sentNotifications.add(key);
      new Notification(t("notificationTitle", { name: getCourseDisplayName(occurrence.course) }), {
        body: formatCourseTimeLocation(occurrence.course),
      });
    }
  });
}

function formatCourseTimeLocation(course) {
  const time = `${course.start} - ${course.end}`;
  return course.location ? t("notificationBody", { time, location: course.location }) : time;
}

function getReminderOccurrences(date) {
  const occurrences = [];

  state.semesters
    .filter((semester) => !semester.archived && dateInRange(date, semester.startDate, semester.endDate))
    .forEach((semester) => {
      semester.courses.forEach((course) => {
        if (!occursOnDate(course, date)) return;

        const start = timeToMinutes(course.start);
        const end = timeToMinutes(course.end);
        if (Number.isNaN(start) || Number.isNaN(end)) return;

        occurrences.push({ course, start, end });
      });
    });

  return occurrences;
}

languageSelect.addEventListener("change", () => {
  state.language = languageSelect.value === "en" ? "en" : "zh";
  renderAll();
});

densitySelect.addEventListener("change", () => {
  state.density = DENSITIES.includes(densitySelect.value) ? densitySelect.value : "standard";
  renderAll();
});

themeSelect.addEventListener("change", () => {
  state.theme = THEMES.includes(themeSelect.value) ? themeSelect.value : "light";
  renderAll();
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.theme === "system") {
    renderAll();
  }
});

reminderSelect.addEventListener("change", async () => {
  state.reminderLeadMinutes = normalizeReminderLead(reminderSelect.value);
  if (state.reminderLeadMinutes > 0) {
    await requestNotificationPermission();
  } else {
    notificationStatus.textContent = "";
  }
  renderAll();
});

[
  [showLocationCheckbox, "location"],
  [showTypeCheckbox, "type"],
  [showRecurrenceCheckbox, "recurrence"],
  [showActionsCheckbox, "actions"],
].forEach(([checkbox, key]) => {
  checkbox.addEventListener("change", () => {
    state.displayOptions = normalizeDisplayOptions(state.displayOptions);
    state.displayOptions[key] = checkbox.checked;
    renderAll();
  });
});

searchInput.addEventListener("input", () => {
  state.filters = normalizeFilters({ ...state.filters, query: searchInput.value });
  renderAll();
});

typeFilter.addEventListener("change", () => {
  state.filters = normalizeFilters({ ...state.filters, type: typeFilter.value });
  renderAll();
});

undoButton.addEventListener("click", undoDelete);

exportButton.addEventListener("click", () => {
  const snapshot = {
    ...state,
    exportedAt: new Date().toISOString(),
    app: "ClassPilot",
  };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `classpilot-backup-${todayISO()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  dataMessage.textContent = t("exportDone");
});

importButton.addEventListener("click", () => {
  importFileInput.click();
});

importFileInput.addEventListener("change", async () => {
  const file = importFileInput.files?.[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());
    if (imported?.version !== 2 || !Array.isArray(imported.semesters)) {
      throw new Error("Invalid ClassPilot backup");
    }

    state = sanitizeState(imported);
    archivePastSemesters();
    ensureActiveSemester();
    dataMessage.textContent = t("importDone");
    importFileInput.value = "";
    renderAll();
  } catch {
    dataMessage.textContent = t("importInvalid");
    importFileInput.value = "";
  }
});

semesterSelect.addEventListener("change", () => {
  state.activeSemesterId = semesterSelect.value;
  state.viewWeekStart = getInitialWeekForSemester(getActiveSemester());
  semesterErrorEl.textContent = "";
  renderAll();
});

semesterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const activeSemester = getActiveSemester();
  if (!activeSemester) return;

  const draft = {
    name: String(semesterForm.elements.name.value || "").trim(),
    startDate: semesterForm.elements.startDate.value,
    endDate: semesterForm.elements.endDate.value,
  };
  const error = validateSemesterDraft(draft);

  if (error) {
    semesterErrorEl.textContent = error;
    return;
  }

  activeSemester.name = draft.name;
  activeSemester.startDate = draft.startDate;
  activeSemester.endDate = draft.endDate;
  state.viewWeekStart = startOfWeekISO(draft.startDate);
  semesterErrorEl.textContent = "";
  renderAll();
});

newSemesterButton.addEventListener("click", () => {
  const draft = {
    name: String(semesterForm.elements.name.value || t("defaultSemester")).trim(),
    startDate: semesterForm.elements.startDate.value || todayISO(),
    endDate: semesterForm.elements.endDate.value || formatISODate(addDays(new Date(), 7 * 16 - 1)),
  };
  const error = validateSemesterDraft(draft);

  if (error) {
    semesterErrorEl.textContent = error;
    return;
  }

  const semester = {
    id: uid(),
    name: draft.name,
    startDate: draft.startDate,
    endDate: draft.endDate,
    archived: draft.endDate < todayISO(),
    courses: [],
  };

  state.semesters.push(semester);
  state.activeSemesterId = semester.id;
  state.viewWeekStart = startOfWeekISO(semester.startDate);
  semesterErrorEl.textContent = "";
  renderAll();
});

form.elements.recurrence.addEventListener("change", () => {
  updateRecurrenceFields(form);
  renderDraftConflictPreview(form, formConflictPreview);
});
editForm.elements.recurrence.addEventListener("change", () => {
  updateRecurrenceFields(editForm);
  renderDraftConflictPreview(editForm, editConflictPreview, editingCourseId);
});

form.addEventListener("input", () => renderDraftConflictPreview(form, formConflictPreview));
form.addEventListener("change", () => renderDraftConflictPreview(form, formConflictPreview));
editForm.addEventListener("input", () => renderDraftConflictPreview(editForm, editConflictPreview, editingCourseId));
editForm.addEventListener("change", () => renderDraftConflictPreview(editForm, editConflictPreview, editingCourseId));

editColorOptions.addEventListener("click", (event) => {
  const button = event.target.closest(".color-option");
  if (!button) return;

  editForm.elements.color.value = button.dataset.color;
  renderEditColorOptions(button.dataset.color);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const activeSemester = getActiveSemester();
  if (!activeSemester) return;

  const draft = getCourseDraft(form);
  const error = validateCourse(draft);

  if (error) {
    errorEl.textContent = error;
    return;
  }

  activeSemester.courses.push({
    id: uid(),
    ...draft,
    invalidDates: undefined,
    link: normalizeOptionalUrl(draft.link),
    color: getNextCourseColor(draft),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  errorEl.textContent = "";
  resetCourseForm();
  renderAll();
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const activeSemester = getActiveSemester();
  if (!activeSemester) return;

  const index = activeSemester.courses.findIndex((course) => course.id === editingCourseId);
  if (index === -1) return;

  const draft = getCourseDraft(editForm);
  const error = validateCourse(draft);

  if (error) {
    editErrorEl.textContent = error;
    return;
  }

  activeSemester.courses[index] = {
    ...activeSemester.courses[index],
    ...draft,
    invalidDates: undefined,
    link: normalizeOptionalUrl(draft.link),
    color: normalizePaletteColor(draft.color),
    updatedAt: new Date().toISOString(),
  };
  closeEditModal();
  renderAll();
});

daysGrid.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");
  if (deleteButton) {
    event.stopPropagation();
    deleteCourse(deleteButton.dataset.id);
    return;
  }

  const editButton = event.target.closest(".edit-button");
  if (editButton) {
    event.stopPropagation();
    openEditModal(editButton.dataset.id);
    return;
  }

  const courseBlock = event.target.closest(".course-block");
  if (courseBlock) {
    openDetailModal(courseBlock.dataset.courseId);
  }
});

daysGrid.addEventListener("contextmenu", (event) => {
  const courseBlock = event.target.closest(".course-block");
  if (!courseBlock || !window.classPilotMenu?.showCourseMenu) return;

  event.preventDefault();
  lastFocusedElement = courseBlock;
  window.classPilotMenu.showCourseMenu({
    courseId: courseBlock.dataset.courseId,
    labels: {
      edit: t("edit"),
      duplicate: t("duplicate"),
      delete: t("delete"),
    },
  });
});

daysGrid.addEventListener("keydown", (event) => {
  if (event.target.closest("button")) return;

  const courseBlock = event.target.closest(".course-block");
  if (!courseBlock || !["Enter", " "].includes(event.key)) return;

  event.preventDefault();
  openDetailModal(courseBlock.dataset.courseId);
});

detailModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-detail]")) {
    closeDetailModal();
  }
});

detailEditButton.addEventListener("click", () => {
  const courseId = detailCourseId;
  closeDetailModal({ restoreFocus: false });
  openEditModal(courseId);
});

detailDuplicateButton.addEventListener("click", () => {
  const courseId = detailCourseId;
  closeDetailModal({ restoreFocus: false });
  duplicateCourse(courseId);
});

detailDeleteButton.addEventListener("click", () => {
  const courseId = detailCourseId;
  closeDetailModal({ restoreFocus: false });
  deleteCourse(courseId);
});

editModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) {
    closeEditModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !detailModal.hidden) {
    closeDetailModal();
    return;
  }

  if (event.key === "Escape" && !editModal.hidden) {
    closeEditModal();
  }
});

prevWeekButton.addEventListener("click", () => {
  state.viewWeekStart = formatISODate(addDays(parseDate(state.viewWeekStart), -7));
  renderAll();
});

todayWeekButton.addEventListener("click", () => {
  state.viewWeekStart = startOfWeekISO(todayISO());
  renderAll();
});

nextWeekButton.addEventListener("click", () => {
  state.viewWeekStart = formatISODate(addDays(parseDate(state.viewWeekStart), 7));
  renderAll();
});

weekDateInput.addEventListener("change", () => {
  if (isValidDateString(weekDateInput.value)) {
    state.viewWeekStart = startOfWeekISO(weekDateInput.value);
    renderAll();
  }
});

window.classPilotMenu?.onMenuAction?.(handleCourseMenuAction);

renderAll();
setInterval(renderCurrentTimeLine, 60000);
setInterval(checkReminders, 30000);
checkReminders();
