const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const screenshotPath = path.join(rootDir, "docs", "classpilot-screenshot.png");
const storageKey = "course-schedule-tool:v2";

const sampleState = {
  version: 2,
  language: "en",
  density: "standard",
  theme: "light",
  reminderLeadMinutes: 0,
  displayOptions: {
    location: true,
    type: true,
    recurrence: true,
    actions: true,
  },
  filters: {
    query: "",
    type: "all",
  },
  activeSemesterId: "demo-semester",
  viewWeekStart: "2026-05-18",
  semesters: [
    {
      id: "demo-semester",
      name: "Spring 2026",
      startDate: "2026-05-18",
      endDate: "2026-08-30",
      archived: false,
      courses: [
        {
          id: "cs101",
          name: "CS101 Algorithms",
          type: "lecture",
          recurrence: "weekly",
          days: ["1", "3"],
          anchorDate: "",
          dates: [],
          start: "09:00",
          end: "10:30",
          location: "Room A101",
          link: "https://example.com/cs101",
          notes: "Weekly lecture and reading notes.",
          color: "#2563eb",
          createdAt: "2026-05-18T00:00:00.000Z",
          updatedAt: "2026-05-18T00:00:00.000Z",
        },
        {
          id: "lab201",
          name: "LAB201 Systems Lab",
          type: "lab",
          recurrence: "biweekly",
          days: ["2"],
          anchorDate: "2026-05-19",
          dates: [],
          start: "13:00",
          end: "15:00",
          location: "Lab B204",
          link: "",
          notes: "Bring laptop and charger.",
          color: "#16a34a",
          createdAt: "2026-05-18T00:00:00.000Z",
          updatedAt: "2026-05-18T00:00:00.000Z",
        },
        {
          id: "exam301",
          name: "MATH301 Quiz",
          type: "exam",
          recurrence: "dates",
          days: [],
          anchorDate: "",
          dates: ["2026-05-22"],
          start: "11:00",
          end: "12:00",
          location: "Hall C",
          link: "",
          notes: "Covers chapters 1-3.",
          color: "#dc2626",
          createdAt: "2026-05-18T00:00:00.000Z",
          updatedAt: "2026-05-18T00:00:00.000Z",
        },
      ],
    },
  ],
};

app.whenReady().then(async () => {
  fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });

  const win = new BrowserWindow({
    width: 1440,
    height: 980,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await win.loadFile(path.join(rootDir, "index.html"));
  await win.webContents.executeJavaScript(
    `localStorage.setItem(${JSON.stringify(storageKey)}, ${JSON.stringify(JSON.stringify(sampleState))});`,
  );
  await win.loadFile(path.join(rootDir, "index.html"));
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const image = await win.webContents.capturePage();
  fs.writeFileSync(screenshotPath, image.toPNG());
  win.close();
  app.quit();
});
