# ClassPilot

ClassPilot is a desktop course timetable app built with Electron.

ClassPilot 是一款基于 Electron 的桌面课程表应用。

## 中文

ClassPilot 用来管理课程、tutorial/lab、考试和不同学期的课表数据。它支持固定周课表，也支持每两周、每月或指定日期的非固定课程。

### 主要功能

- 周视图课程表：星期一到星期日，08:00 到 22:00。
- 添加课程名称、类型、时间、地点、颜色、重复规则和确切日期。
- 多学期管理，学期结束后自动归档。
- 中文/英文界面、深色模式、显示密度设置。
- 搜索筛选、课程统计、冲突提示、当前时间线。
- 桌面提醒、撤销删除、右键编辑/复制/删除。
- 本地 JSON 文件存储，支持导入/导出备份。

### 使用

```bash
npm install
npm run start
```

### 打包

```bash
npm run build
```

Windows 安装包会生成在：

```text
dist/ClassPilot-Setup-1.0.0.exe
```

本地数据文件默认位于：

```text
%APPDATA%\ClassPilot\classpilot-data.json
```

## English

ClassPilot helps manage courses, tutorials/labs, exams, and semester-based timetable data. It supports both regular weekly classes and irregular schedules such as biweekly, monthly, or specific-date sessions.

### Features

- Weekly timetable from Monday to Sunday, 08:00 to 22:00.
- Add course name, type, time, location, color, recurrence, and exact dates.
- Multi-semester data with automatic archive after a semester ends.
- Chinese/English UI, dark mode, and display density settings.
- Search, filters, course stats, conflict warnings, and current time line.
- Desktop reminders, undo delete, and right-click edit/duplicate/delete.
- Local JSON storage with import/export backup.

### Run

```bash
npm install
npm run start
```

### Build

```bash
npm run build
```

The Windows installer is generated at:

```text
dist/ClassPilot-Setup-1.0.0.exe
```

Local data is stored at:

```text
%APPDATA%\ClassPilot\classpilot-data.json
```

## Tech Stack

- Electron
- HTML, CSS, JavaScript
- Electron Builder
