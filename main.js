const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const fs = require("fs");
const path = require("path");

app.setName("ClassPilot");

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
  return storagePath;
}

function registerIpcHandlers() {
  ipcMain.on("storage:load-sync", (event) => {
    event.returnValue = loadStoredState();
  });

  ipcMain.handle("storage:save", (_event, state) => saveStoredState(state));
  ipcMain.handle("storage:path", () => getStoragePath());

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
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 980,
    minHeight: 680,
    title: "ClassPilot",
    icon: path.join(__dirname, "build", process.platform === "win32" ? "icon.ico" : "icon.png"),
    backgroundColor: "#f5f7fb",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.webContents.once("did-finish-load", () => {
    checkForUpdatesAfterLaunch(mainWindow);
  });

  return mainWindow;
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
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
