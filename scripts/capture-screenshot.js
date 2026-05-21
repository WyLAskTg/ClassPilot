const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const screenshotLanguage = process.env.CLASSPILOT_SCREENSHOT_LANGUAGE === "zh" ? "zh" : "en";
const screenshotPath = path.join(
  rootDir,
  "docs",
  screenshotLanguage === "zh" ? "classpilot-screenshot-zh.png" : "classpilot-screenshot.png",
);
const storageKey = "course-schedule-tool:v2";
const sampleText = {
  en: {
    semester: "Spring 2026",
    lecture: "CS101 Algorithms",
    lab: "LAB201 Systems Lab",
    exam: "MATH301 Quiz",
    room: "Room A101",
    labRoom: "Lab B204",
    hall: "Hall C",
    lectureNotes: "Weekly lecture and reading notes.",
    labNotes: "Bring laptop and charger.",
    examNotes: "Covers chapters 1-3.",
  },
  zh: {
    semester: "2026 春季学期",
    lecture: "CS101 算法导论",
    lab: "LAB201 系统实验",
    exam: "MATH301 小测",
    room: "A101 教室",
    labRoom: "B204 实验室",
    hall: "C 教学楼",
    lectureNotes: "每周讲座与阅读笔记。",
    labNotes: "带电脑和充电器。",
    examNotes: "范围：第 1-3 章。",
  },
}[screenshotLanguage];

const sampleState = {
  version: 2,
  language: screenshotLanguage,
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
      name: sampleText.semester,
      startDate: "2026-05-18",
      endDate: "2026-08-30",
      archived: false,
      courses: [
        {
          id: "cs101",
          name: sampleText.lecture,
          type: "lecture",
          recurrence: "weekly",
          days: ["1", "3"],
          anchorDate: "",
          dates: [],
          start: "09:00",
          end: "10:30",
          location: sampleText.room,
          link: "https://example.com/cs101",
          notes: sampleText.lectureNotes,
          color: "#2563eb",
          createdAt: "2026-05-18T00:00:00.000Z",
          updatedAt: "2026-05-18T00:00:00.000Z",
        },
        {
          id: "lab201",
          name: sampleText.lab,
          type: "lab",
          recurrence: "biweekly",
          days: ["2"],
          anchorDate: "2026-05-19",
          dates: [],
          start: "13:00",
          end: "15:00",
          location: sampleText.labRoom,
          link: "",
          notes: sampleText.labNotes,
          color: "#16a34a",
          createdAt: "2026-05-18T00:00:00.000Z",
          updatedAt: "2026-05-18T00:00:00.000Z",
        },
        {
          id: "exam301",
          name: sampleText.exam,
          type: "exam",
          recurrence: "dates",
          days: [],
          anchorDate: "",
          dates: ["2026-05-22"],
          start: "11:00",
          end: "12:00",
          location: sampleText.hall,
          link: "",
          notes: sampleText.examNotes,
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
