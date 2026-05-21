# Changelog

## v1.1 - 2026-05-21

- Improved course block layout: course code and course name now display on separate lines.
- Shortened recurring weekday labels: Chinese uses formats like `周一/三`; English uses `MW`, `MWF`, etc.
- Refined README screenshots and screenshot generation for Chinese/English docs.
- Rebuilt installer assets with lowercase English filenames.
- Added a finish-page option for creating a desktop shortcut.
- Kept app, shortcut, and uninstall names fixed as `ClassPilot` across installer languages.
- Split course code and course name into separate form fields.
- Hidden empty location rows instead of showing an unset-location placeholder.
- Added automatic update checks with release notes in the update dialog.
- Added update metadata generation and release upload support for `latest.yml`.

## v1.0.0 - 2026-05-20

Initial ClassPilot release.

- Weekly timetable with Monday-Sunday columns and 08:00-22:00 schedule range.
- Multi-semester data, automatic semester archive, and local JSON storage.
- Weekly, biweekly, monthly, and specific-date course schedules.
- Chinese/English UI, dark mode, display density, and course block display settings.
- Search, filters, course statistics, conflict detection, and current time line.
- Desktop reminders, undo delete, right-click edit/duplicate/delete, and JSON import/export.
- Course detail view with notes and course links.
- Windows installer build with desktop and Start Menu shortcuts.
