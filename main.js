const { app, BrowserWindow, Menu, ipcMain, dialog, Tray, Notification } = require("electron");
const { autoUpdater } = require("electron-updater");
const fs = require("fs");
const path = require("path");

app.setName("ClassPilot");
app.setAppUserModelId("com.local.classpilot");

let mainWindow = null;
let tray = null;
let updateTrayTimer = null;
let reminderTimer = null;
const sentReminderKeys = new Set();

const UPDATE_DIALOG = {
  zh: {
    title: "发现新版本",
    message: (version) => `ClassPilot ${version} 可用`,
    detail: (currentVersion, releaseNotes) =>
      `当前版本：${currentVersion}\n\n更新内容：\n${releaseNotes}`,
    updateNow: "立即更新",
    later: "稍后",
    downloadedTitle: "更新已准备好",
    downloadedMessage: "新版本已下载完成",
    downloadedDetail: "重启 ClassPilot 后将自动安装更新。",
    restartNow: "重启并安装",
    noNotes: "暂无更新说明。",
  },
  en: {
    title: "Update Available",
    message: (version) => `ClassPilot ${version} is available`,
    detail: (currentVersion, releaseNotes) =>
      `Current version: ${currentVersion}\n\nWhat's new:\n${releaseNotes}`,
    updateNow: "Update Now",
    later: "Later",
    downloadedTitle: "Update Ready",
    downloadedMessage: "The new version has been downloaded",
    downloadedDetail: "Restart ClassPilot to install the update.",
    restartNow: "Restart and Install",
    noNotes: "No release notes available.",
  },
};

let updateCheckStarted = false;
let updateDownloadStarted = false;

function getStoragePath() {
  return path.join(app.getPath("userData"), "classpilot-data.json");
}

function loadStoredState() {
  try {
    const storagePath = getStoragePath();
    if (!fs.existsSync(storagePath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(storagePath, "utf8"));
  } catch (error) {
    console.error("Failed to load ClassPilot data:", error);
    return null;
  }
}

function saveStoredState(state) {
  const storagePath = getStoragePath();
  const tempPath = `${storagePath}.tmp`;
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });
  fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), "utf8");
  fs.renameSync(tempPath, storagePath);
  updateTrayMenu();
  return storagePath;
}

function getIconPath() {
  return path.join(__dirname, "build", process.platform === "win32" ? "icon.ico" : "icon.png");
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = createWindow();
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
}

function getText(language, key) {
  const copy = {
    zh: {
      show: "\u663e\u793a ClassPilot",
      quit: "\u9000\u51fa",
      nextClass: "\u4e0b\u4e00\u8282\u8bfe",
      noUpcoming: "\u8fd1\u671f\u6ca1\u6709\u8bfe\u7a0b",
      startsSoon: "\u5373\u5c06\u4e0a\u8bfe",
      trayTip: "ClassPilot \u8bfe\u7a0b\u63d0\u9192",
    },
    en: {
      show: "Show ClassPilot",
      quit: "Quit",
      nextClass: "Next Class",
      noUpcoming: "No upcoming classes",
      startsSoon: "starts soon",
      trayTip: "ClassPilot reminders",
    },
  };

  return copy[language]?.[key] || copy.en[key] || key;
}

function getStateLanguage(state) {
  return state?.language === "en" ? "en" : "zh";
}

function createTray() {
  if (tray) return;

  tray = new Tray(getIconPath());
  tray.setToolTip("ClassPilot");
  tray.on("click", showMainWindow);
  updateTrayMenu();

  updateTrayTimer = setInterval(updateTrayMenu, 60 * 1000);
}

function updateTrayMenu() {
  if (!tray) return;

  const state = loadStoredState();
  const language = getStateLanguage(state);
  const nextClass = getNextClass(state);
  const nextLabel = nextClass
    ? `${getText(language, "nextClass")}: ${nextClass.label}`
    : getText(language, "noUpcoming");

  tray.setToolTip(nextClass ? `ClassPilot - ${nextClass.label}` : getText(language, "trayTip"));
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: nextLabel, enabled: false },
    { type: "separator" },
    { label: getText(language, "show"), click: showMainWindow },
    {
      label: getText(language, "quit"),
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]));
}

function startReminderService() {
  if (reminderTimer) return;
  reminderTimer = setInterval(checkRemindersInMain, 30 * 1000);
  checkRemindersInMain();
}

function checkRemindersInMain() {
  const state = loadStoredState();
  const lead = Number(state?.reminderLeadMinutes || 0);

  if (lead <= 0 || !Notification.isSupported()) {
    return;
  }

  const now = new Date();
  const today = formatDateISO(now);
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const language = getStateLanguage(state);

  getOccurrencesForDate(state, today).forEach((occurrence) => {
    const reminderSeconds = occurrence.start * 60 - lead * 60;
    const secondsUntilReminder = reminderSeconds - currentSeconds;
    const key = `${occurrence.course.id}:${today}:${lead}`;

    if (secondsUntilReminder <= 0 && secondsUntilReminder > -60 && !sentReminderKeys.has(key)) {
      sentReminderKeys.add(key);
      const notification = new Notification({
        title: `${getCourseDisplayName(occurrence.course)} ${getText(language, "startsSoon")}`,
        body: formatCourseTimeLocation(occurrence.course),
        icon: getIconPath(),
      });

      notification.on("click", showMainWindow);
      notification.show();
    }
  });
}

function getNextClass(state) {
  if (!state?.semesters?.length) return null;

  const now = new Date();
  const currentDate = formatDateISO(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const candidates = [];

  for (let offset = 0; offset <= 30; offset += 1) {
    const date = formatDateISO(addDays(now, offset));
    getOccurrencesForDate(state, date).forEach((occurrence) => {
      if (date === currentDate && occurrence.end <= currentMinutes) return;
      candidates.push({ ...occurrence, date });
    });
  }

  const next = candidates.sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start)[0];
  if (!next) return null;

  return {
    ...next,
    label: `${next.date} ${minutesToTime(next.start)} ${getCourseDisplayName(next.course)}`,
  };
}

function getOccurrencesForDate(state, date) {
  const occurrences = [];

  (state?.semesters || [])
    .filter((semester) => !semester.archived && date >= semester.startDate && date <= semester.endDate)
    .forEach((semester) => {
      (semester.courses || []).forEach((course) => {
        if (!occursOnDate(course, date)) return;

        const start = timeToMinutes(course.start);
        const end = timeToMinutes(course.end);
        if (Number.isNaN(start) || Number.isNaN(end)) return;

        occurrences.push({ course, start, end });
      });
    });

  return occurrences;
}

function occursOnDate(course, date) {
  if (course.recurrence === "weekly") {
    return (course.days || []).map(String).includes(getDayValue(date));
  }

  if (course.recurrence === "biweekly") {
    if (!course.anchorDate || date < course.anchorDate || !(course.days || []).map(String).includes(getDayValue(date))) {
      return false;
    }

    const weekDiff = Math.floor(diffDays(startOfWeekISO(course.anchorDate), startOfWeekISO(date)) / 7);
    return weekDiff % 2 === 0;
  }

  if (course.recurrence === "monthly") {
    if (!course.anchorDate || date < course.anchorDate) return false;
    return parseDate(date).getDate() === parseDate(course.anchorDate).getDate();
  }

  if (course.recurrence === "dates") {
    return (course.dates || []).includes(date);
  }

  return false;
}

function getCourseDisplayName(course) {
  const code = String(course?.code || "").trim();
  const name = String(course?.name || "").trim();
  if (code && name && code.toLowerCase() !== name.toLowerCase()) return `${code} ${name}`;
  return name || code || "Class";
}

function formatCourseTimeLocation(course) {
  const time = `${course.start || ""} - ${course.end || ""}`.trim();
  return course.location ? `${time} · ${course.location}` : time;
}

function timeToMinutes(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return Number.NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

function minutesToTime(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeekISO(value) {
  const date = parseDate(value);
  const day = date.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  return formatDateISO(addDays(date, offset));
}

function diffDays(start, end) {
  return Math.round((parseDate(end) - parseDate(start)) / 86400000);
}

function getDayValue(date) {
  const day = parseDate(date).getDay();
  return String(day === 0 ? 7 : day);
}

function registerIpcHandlers() {
  ipcMain.on("storage:load-sync", (event) => {
    event.returnValue = loadStoredState();
  });

  ipcMain.handle("storage:save", (_event, state) => saveStoredState(state));
  ipcMain.handle("storage:path", () => getStoragePath());

  ipcMain.handle("export:pdf", async (event, options = {}) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return { canceled: true };

    const result = await dialog.showSaveDialog(window, {
      title: "Export PDF",
      defaultPath: options.defaultPath || "classpilot-schedule.pdf",
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });

    if (result.canceled || !result.filePath) return { canceled: true };

    const pdf = await window.webContents.printToPDF({
      landscape: true,
      printBackground: true,
      margins: { marginType: "minimum" },
      pageSize: "A4",
    });
    fs.writeFileSync(result.filePath, pdf);
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle("export:image", async (event, options = {}) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return { canceled: true };

    const result = await dialog.showSaveDialog(window, {
      title: "Export Image",
      defaultPath: options.defaultPath || "classpilot-schedule.png",
      filters: [{ name: "PNG Image", extensions: ["png"] }],
    });

    if (result.canceled || !result.filePath) return { canceled: true };

    const image = await window.webContents.capturePage();
    fs.writeFileSync(result.filePath, image.toPNG());
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle("export:text-file", async (event, options = {}) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return { canceled: true };

    const result = await dialog.showSaveDialog(window, {
      title: options.title || "Export",
      defaultPath: options.defaultPath || "classpilot-export.txt",
      filters: options.filters || [{ name: "Text", extensions: ["txt"] }],
    });

    if (result.canceled || !result.filePath) return { canceled: true };

    fs.writeFileSync(result.filePath, String(options.content || ""), "utf8");
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle("course-menu:show", (event, payload = {}) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window || !payload.courseId) return;

    const labels = payload.labels || {};
    const sendAction = (action) => {
      window.webContents.send("course-menu:action", {
        action,
        courseId: payload.courseId,
      });
    };

    Menu.buildFromTemplate([
      { label: labels.edit || "Edit", click: () => sendAction("edit") },
      { label: labels.duplicate || "Duplicate", click: () => sendAction("duplicate") },
      { type: "separator" },
      { label: labels.delete || "Delete", click: () => sendAction("delete") },
    ]).popup({ window });
  });
}

function getDialogLanguage() {
  const storedState = loadStoredState();
  return storedState?.language === "en" ? "en" : "zh";
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function releaseNotesToText(releaseNotes) {
  if (Array.isArray(releaseNotes)) {
    return releaseNotes
      .map((releaseNote) => {
        const version = releaseNote.version ? `v${releaseNote.version}\n` : "";
        return `${version}${releaseNote.note || ""}`.trim();
      })
      .filter(Boolean)
      .join("\n\n");
  }

  return typeof releaseNotes === "string" ? releaseNotes : "";
}

function cleanReleaseNotes(releaseNotes) {
  const text = decodeHtmlEntities(releaseNotesToText(releaseNotes))
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<\/(p|div|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (text.length <= 2600) {
    return text;
  }

  return `${text.slice(0, 2600).trim()}\n...`;
}

function getUpdateMessages() {
  return UPDATE_DIALOG[getDialogLanguage()] || UPDATE_DIALOG.zh;
}

function formatAppVersion(version) {
  return String(version || "").replace(/^(\d+\.\d+)\.0$/, "$1");
}

function checkForUpdatesAfterLaunch(mainWindow) {
  if (!app.isPackaged || updateCheckStarted) {
    return;
  }

  updateCheckStarted = true;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.fullChangelog = false;

  autoUpdater.on("update-available", async (info) => {
    const messages = getUpdateMessages();
    const releaseNotes = cleanReleaseNotes(info.releaseNotes) || messages.noNotes;
    const currentVersion = formatAppVersion(app.getVersion());
    const nextVersion = formatAppVersion(info.version);
    const result = await dialog.showMessageBox(mainWindow, {
      type: "info",
      title: messages.title,
      message: messages.message(nextVersion),
      detail: messages.detail(currentVersion, releaseNotes),
      buttons: [messages.updateNow, messages.later],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    });

    if (result.response === 0 && !updateDownloadStarted) {
      updateDownloadStarted = true;
      autoUpdater.downloadUpdate().catch((error) => {
        updateDownloadStarted = false;
        console.error("Failed to download ClassPilot update:", error);
      });
    }
  });

  autoUpdater.on("update-downloaded", async () => {
    const messages = getUpdateMessages();
    const result = await dialog.showMessageBox(mainWindow, {
      type: "info",
      title: messages.downloadedTitle,
      message: messages.downloadedMessage,
      detail: messages.downloadedDetail,
      buttons: [messages.restartNow, messages.later],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on("error", (error) => {
    updateDownloadStarted = false;
    console.error("ClassPilot update check failed:", error);
  });

  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((error) => {
      console.error("ClassPilot update check failed:", error);
    });
  }, 1500);
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 980,
    minHeight: 680,
    title: "ClassPilot",
    icon: getIconPath(),
    backgroundColor: "#f5f7fb",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadFile(path.join(__dirname, "index.html"));
  window.webContents.once("did-finish-load", () => {
    checkForUpdatesAfterLaunch(window);
  });
  window.on("close", (event) => {
    if (app.isQuitting) return;
    event.preventDefault();
    window.hide();
  });

  return window;
}

function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [{ role: "quit", label: "Quit" }],
    },
    {
      label: "View",
      submenu: [
        { role: "reload", label: "Reload" },
        { type: "separator" },
        { role: "toggleDevTools", label: "Developer Tools" },
        { role: "resetZoom", label: "Reset Zoom" },
        { role: "zoomIn", label: "Zoom In" },
        { role: "zoomOut", label: "Zoom Out" },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createMenu();
  mainWindow = createWindow();
  createTray();
  startReminderService();

  app.on("activate", () => {
    showMainWindow();
  });
});

app.on("before-quit", () => {
  app.isQuitting = true;
  if (updateTrayTimer) clearInterval(updateTrayTimer);
  if (reminderTimer) clearInterval(reminderTimer);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
