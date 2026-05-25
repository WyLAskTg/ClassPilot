# ClassPilot iOS

Native SwiftUI version of ClassPilot for iPhone and iPad.

## Open

Open this folder on macOS with Xcode:

```bash
open ios/ClassPilot/ClassPilot.xcodeproj
```

## Current Scope

- SwiftUI app shell for iPhone and iPad
- Local JSON storage in the app documents directory
- Semester-aware course model
- Weekly, biweekly, monthly, and one-time recurrence model
- Week schedule grid from 08:00 to 22:00
- Add, edit, and delete courses
- Separate course code and course name fields
- Empty locations are hidden in course blocks
- Chinese and English UI mode
- Display density setting

## Notes

The iOS app is intentionally separate from the Electron desktop app. Desktop-only features such as Electron auto-update and right-click menus should become App Store/TestFlight updates and touch-native menus on iOS.
