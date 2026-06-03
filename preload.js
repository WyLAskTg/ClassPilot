const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("classPilotStorage", {
  loadSync: () => ipcRenderer.sendSync("storage:load-sync"),
  save: (state) => ipcRenderer.invoke("storage:save", state),
  getPath: () => ipcRenderer.invoke("storage:path"),
  getBackupsPath: () => ipcRenderer.invoke("storage:backups-path"),
});

contextBridge.exposeInMainWorld("classPilotMenu", {
  showCourseMenu: (payload) => ipcRenderer.invoke("course-menu:show", payload),
  onMenuAction: (callback) => {
    const handler = (_event, action) => callback(action);
    ipcRenderer.on("course-menu:action", handler);
    return () => ipcRenderer.removeListener("course-menu:action", handler);
  },
});

contextBridge.exposeInMainWorld("classPilotExport", {
  savePdf: (options) => ipcRenderer.invoke("export:pdf", options),
  saveImage: (options) => ipcRenderer.invoke("export:image", options),
  saveTextFile: (options) => ipcRenderer.invoke("export:text-file", options),
});

contextBridge.exposeInMainWorld("classPilotDesktop", {
  usesSystemReminders: true,
  getAppInfo: () => ipcRenderer.invoke("app:info"),
  checkForUpdates: () => ipcRenderer.invoke("update:check"),
});
