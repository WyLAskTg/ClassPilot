# ClassPilot

ClassPilot is a desktop course schedule planner built with Electron. It helps students manage weekly classes, irregular labs/tutorials, semester archives, reminders, and local schedule data in one clean timetable.

ClassPilot 是一款基于 Electron 的桌面课程表应用，用于管理每周课程、不固定日期的 lab/tutorial、学期归档、上课提醒和本地课表数据。

## 中文说明

### 功能

- 周课程表视图，支持星期一到星期日，时间范围为 08:00 到 22:00。
- 添加课程名称、类型、星期、确切日期、开始/结束时间、地点和颜色。
- 支持每周、每两周、每月、指定日期等重复方式。
- 支持一门课一次选择多个上课日，减少重复输入。
- 支持不同学期的数据保存、学期时间设置和过期学期自动归档。
- 支持中文/英文界面切换。
- 支持显示密度、深色模式、课程块显示内容设置。
- 支持搜索筛选、课程类型筛选、当前时间线、时间冲突提示。
- 支持桌面通知提醒、撤销删除、右键菜单编辑/复制/删除。
- 支持导入/导出 JSON 备份。
- 使用本地 JSON 文件保存数据，刷新或重启后课程仍然存在。

### 本地运行

```bash
npm install
npm run start
```

### 构建 Windows 安装包

```bash
npm run build
```

构建完成后，安装包会生成在 `dist/ClassPilot-Setup-1.0.0.exe`。安装后会创建桌面快捷方式和开始菜单快捷方式。

### 数据存储位置

Windows 下，ClassPilot 的本地数据文件位于：

```text
%APPDATA%\ClassPilot\classpilot-data.json
```

### 项目结构

```text
.
├── app.js                 # Renderer logic and timetable behavior
├── index.html             # Application UI
├── main.js                # Electron main process
├── preload.js             # Secure bridge for local storage and context menu
├── styles.css             # Application styles
├── build/                 # App icons
├── scripts/               # Icon generation and Windows metadata scripts
├── package.json           # Scripts and Electron Builder config
└── package-lock.json      # Dependency lockfile
```

## English

### Features

- Weekly timetable view from Monday to Sunday, 08:00 to 22:00.
- Add course name/code, type, weekdays, exact dates, start/end time, location, and color.
- Supports weekly, biweekly, monthly, and specific-date schedules.
- Select multiple weekdays for one course in a single form submission.
- Semester-based storage with date ranges and automatic archiving after a semester ends.
- Chinese and English UI.
- Display density settings, dark mode, and configurable course block content.
- Search, type filters, current time line, and conflict detection.
- Desktop reminders, undo delete, and right-click menu actions for edit/duplicate/delete.
- JSON import/export backup.
- Local JSON file storage so course data persists after refresh or restart.

### Run Locally

```bash
npm install
npm run start
```

### Build Windows Installer

```bash
npm run build
```

The installer will be generated at `dist/ClassPilot-Setup-1.0.0.exe`. The installed app creates desktop and Start Menu shortcuts.

### Local Data Path

On Windows, ClassPilot stores local schedule data at:

```text
%APPDATA%\ClassPilot\classpilot-data.json
```

### Tech Stack

- Electron
- HTML, CSS, JavaScript
- Electron Builder

