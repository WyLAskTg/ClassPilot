const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("classPilotStorage", {
  loadSync: () => ipcRenderer.sendSync("storage:load-sync"),
  save: (state) => ipcRenderer.invoke("storage:save", state),
  getPath: () => ipcRenderer.invoke("storage:path"),
});

contextBridge.exposeInMainWorld("classPilotMenu", {
  showCourseMenu: (payload) => ipcRenderer.invoke("course-menu:show", payload),
  onMenuAction: (callback) => {
    const handler = (_event, action) => callback(action);
    ipcRenderer.on("course-menu:action", handler);
    return () => ipcRenderer.removeListener("course-menu:action", handler);
  },
});
