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
let lastBackupAt = 0;
const sentReminderKeys = new Set();
const BACKUP_INTERVAL_MS = 10 * 60 * 1000;
const MAX_BACKUPS = 5;

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
    downloadedDetail: "现在重启会立即安装更新；稍后完全退出 ClassPilot 时也会自动安装。",
    restartNow: "重启并安装",
    noNotes: "暂无更新说明。",
    checkingTitle: "\u68c0\u67e5\u66f4\u65b0",
    checkingMessage: "\u6b63\u5728\u68c0\u67e5 ClassPilot \u66f4\u65b0\u3002",
    noUpdateTitle: "\u5df2\u662f\u6700\u65b0\u7248\u672c",
    noUpdateMessage: "ClassPilot \u5df2\u662f\u6700\u65b0\u7248\u672c\u3002",
    updateUnavailableTitle: "\u65e0\u6cd5\u68c0\u67e5\u66f4\u65b0",
    updateUnavailableMessage: "\u53ea\u6709\u5b89\u88c5\u540e\u7684 ClassPilot \u624d\u80fd\u81ea\u52a8\u68c0\u67e5\u66f4\u65b0\u3002",
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
    downloadedDetail: "Restart now to install it immediately, or fully quit ClassPilot later to install it automatically.",
    restartNow: "Restart and Install",
    noNotes: "No release notes available.",
    checkingTitle: "Check for Updates",
    checkingMessage: "ClassPilot is checking for updates.",
    noUpdateTitle: "You're Up to Date",
    noUpdateMessage: "ClassPilot is already up to date.",
    updateUnavailableTitle: "Cannot Check for Updates",
    updateUnavailableMessage: "Automatic update checks are only available in the installed ClassPilot app.",
  },
};

let updateCheckStarted = false;
let updateDownloadStarted = false;
let updateReadyToInstall = false;

function getStoragePath() {
  return path.join(app.getPath("userData"), "classpilot-data.json");
}

function getBackupDir() {
  return path.join(app.getPath("userData"), "backups");
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
  createBackupIfNeeded(storagePath);
  fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), "utf8");
  fs.renameSync(tempPath, storagePath);
  updateTrayMenu();
  return storagePath;
}

function createBackupIfNeeded(storagePath) {
  if (!fs.existsSync(storagePath) || Date.now() - lastBackupAt < BACKUP_INTERVAL_MS) {
    return;
  }

  try {
    const backupDir = getBackupDir();
    fs.mkdirSync(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(storagePath, path.join(backupDir, `classpilot-data-${timestamp}.json`));
    lastBackupAt = Date.now();
    cleanupBackups(backupDir);
  } catch (error) {
    console.error("Failed to create ClassPilot backup:", error);
  }
}

function cleanupBackups(backupDir) {
  const backups = fs.readdirSync(backupDir)
    .filter((name) => /^classpilot-data-.+\.json$/.test(name))
    .map((name) => {
      const filePath = path.join(backupDir, name);
      return { name, filePath, mtimeMs: fs.statSync(filePath).mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  backups.slice(MAX_BACKUPS).forEach((backup) => {
    fs.rmSync(backup.filePath, { force: true });
  });
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
  ipcMain.handle("storage:backups-path", () => getBackupDir());
  ipcMain.handle("app:info", () => ({
    version: formatAppVersion(app.getVersion()),
    rawVersion: app.getVersion(),
    storagePath: getStoragePath(),
    backupsPath: getBackupDir(),
    isPackaged: app.isPackaged,
  }));

  ipcMain.handle("update:check", async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    return checkForUpdatesManually(window);
  });

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

    const image = await window.webContents.capturePage(options.bounds || undefined);
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

function getUpdateDialogWindow(fallbackWindow) {
  if (fallbackWindow && !fallbackWindow.isDestroyed()) {
    return fallbackWindow;
  }

  if (mainWindow && !mainWindow.isDestroyed()) {
    return mainWindow;
  }

  return BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0] || null;
}

function showUpdateMessageBox(window, options) {
  const targetWindow = getUpdateDialogWindow(window);
  return targetWindow ? dialog.showMessageBox(targetWindow, options) : dialog.showMessageBox(options);
}

function setUpdateProgress(progress) {
  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isDestroyed()) {
      window.setProgressBar(progress);
    }
  });
}

function beginUpdateDownload(window) {
  if (updateDownloadStarted || updateReadyToInstall) {
    return;
  }

  updateDownloadStarted = true;
  setUpdateProgress(2);

  autoUpdater.downloadUpdate().catch((error) => {
    updateDownloadStarted = false;
    setUpdateProgress(-1);
    console.error("Failed to download ClassPilot update:", error);
    showUpdateMessageBox(window, {
      type: "warning",
      title: getUpdateMessages().updateUnavailableTitle,
      message: String(error?.message || error || getUpdateMessages().updateUnavailableMessage),
      noLink: true,
    });
  });
}

async function promptToInstallUpdate(window) {
  const messages = getUpdateMessages();
  const result = await showUpdateMessageBox(window, {
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
    app.isQuitting = true;
    autoUpdater.quitAndInstall(false, true);
  }
}

function checkForUpdatesAfterLaunch(mainWindow) {
  if (!app.isPackaged || updateCheckStarted) {
    return;
  }

  updateCheckStarted = true;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.fullChangelog = false;

  autoUpdater.on("update-available", async (info) => {
    const messages = getUpdateMessages();
    const releaseNotes = cleanReleaseNotes(info.releaseNotes) || messages.noNotes;
    const currentVersion = formatAppVersion(app.getVersion());
    const nextVersion = formatAppVersion(info.version);
    const result = await showUpdateMessageBox(mainWindow, {
      type: "info",
      title: messages.title,
      message: messages.message(nextVersion),
      detail: messages.detail(currentVersion, releaseNotes),
      buttons: [messages.updateNow, messages.later],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    });

    if (result.response === 0) {
      beginUpdateDownload(mainWindow);
    }
  });

  autoUpdater.on("download-progress", (progress) => {
    const percent = Number(progress?.percent || 0);
    setUpdateProgress(Math.max(0, Math.min(1, percent / 100)));
  });

  autoUpdater.on("update-downloaded", async () => {
    updateDownloadStarted = false;
    updateReadyToInstall = true;
    setUpdateProgress(-1);
    await promptToInstallUpdate(mainWindow);
  });

  autoUpdater.on("error", (error) => {
    updateDownloadStarted = false;
    setUpdateProgress(-1);
    console.error("ClassPilot update check failed:", error);
  });

  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((error) => {
      console.error("ClassPilot update check failed:", error);
    });
  }, 1500);
}

async function checkForUpdatesManually(window) {
  const messages = getUpdateMessages();

  if (!app.isPackaged) {
    await dialog.showMessageBox(window, {
      type: "info",
      title: messages.updateUnavailableTitle,
      message: messages.updateUnavailableMessage,
      noLink: true,
    });
    return { ok: false, reason: "not-packaged" };
  }

  if (updateReadyToInstall) {
    await promptToInstallUpdate(window);
    return { ok: true, updateReady: true };
  }

  checkForUpdatesAfterLaunch(window);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      autoUpdater.off("update-not-available", handleNoUpdate);
      autoUpdater.off("error", handleError);
      resolve(result);
    };
    const handleNoUpdate = async () => {
      await dialog.showMessageBox(window, {
        type: "info",
        title: messages.noUpdateTitle,
        message: messages.noUpdateMessage,
        noLink: true,
      });
      finish({ ok: true, updateAvailable: false });
    };
    const handleError = async (error) => {
      console.error("Manual ClassPilot update check failed:", error);
      await dialog.showMessageBox(window, {
        type: "warning",
        title: messages.updateUnavailableTitle,
        message: String(error?.message || error || messages.updateUnavailableMessage),
        noLink: true,
      });
      finish({ ok: false, reason: "error" });
    };

    autoUpdater.once("update-not-available", handleNoUpdate);
    autoUpdater.once("error", handleError);
    autoUpdater.checkForUpdates()
      .then((result) => {
        if (result?.updateInfo && result.updateInfo.version !== app.getVersion()) {
          finish({ ok: true, updateAvailable: true });
        }
      })
      .catch(handleError);
  });
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
