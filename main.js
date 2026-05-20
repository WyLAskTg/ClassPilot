const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

app.setName("ClassPilot");

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
