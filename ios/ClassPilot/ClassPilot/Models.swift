import Foundation
import SwiftUI

enum Language: String, Codable, CaseIterable, Identifiable {
    case zh
    case en

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .zh: return "中文"
        case .en: return "English"
        }
    }
}

enum ScheduleDensity: String, Codable, CaseIterable, Identifiable {
    case compact
    case comfortable
    case roomy

    var id: String { rawValue }

    var hourHeight: CGFloat {
        switch self {
        case .compact: return 70
        case .comfortable: return 88
        case .roomy: return 108
        }
    }
}

enum Weekday: Int, Codable, CaseIterable, Identifiable, Comparable {
    case monday = 1
    case tuesday
    case wednesday
    case thursday
    case friday
    case saturday
    case sunday

    var id: Int { rawValue }

    init(calendarWeekday: Int) {
        switch calendarWeekday {
        case 1: self = .sunday
        case 2: self = .monday
        case 3: self = .tuesday
        case 4: self = .wednesday
        case 5: self = .thursday
        case 6: self = .friday
        default: self = .saturday
        }
    }

    var calendarWeekday: Int {
        self == .sunday ? 1 : rawValue + 1
    }

    func shortName(_ language: Language) -> String {
        switch (self, language) {
        case (.monday, .zh): return "周一"
        case (.tuesday, .zh): return "周二"
        case (.wednesday, .zh): return "周三"
        case (.thursday, .zh): return "周四"
        case (.friday, .zh): return "周五"
        case (.saturday, .zh): return "周六"
        case (.sunday, .zh): return "周日"
        case (.monday, .en): return "Mon"
        case (.tuesday, .en): return "Tue"
        case (.wednesday, .en): return "Wed"
        case (.thursday, .en): return "Thu"
        case (.friday, .en): return "Fri"
        case (.saturday, .en): return "Sat"
        case (.sunday, .en): return "Sun"
        }
    }

    static func < (lhs: Weekday, rhs: Weekday) -> Bool {
        lhs.rawValue < rhs.rawValue
    }
}

enum CourseType: String, Codable, CaseIterable, Identifiable {
    case lecture
    case tutorial
    case lab
    case seminar
    case workshop
    case other

    var id: String { rawValue }

    func title(_ language: Language) -> String {
        Copy.text(rawValue, language)
    }
}

enum RecurrenceRule: String, Codable, CaseIterable, Identifiable {
    case weekly
    case biweekly
    case monthly
    case once

    var id: String { rawValue }

    func title(_ language: Language) -> String {
        Copy.text(rawValue, language)
    }
}

enum CourseColor: String, Codable, CaseIterable, Identifiable {
    case blue
    case green
    case amber
    case red
    case purple
    case teal
    case indigo
    case pink
    case slate
    case orange

    var id: String { rawValue }

    var color: Color {
        switch self {
        case .blue: return Color(red: 0.12, green: 0.37, blue: 0.90)
        case .green: return Color(red: 0.05, green: 0.55, blue: 0.32)
        case .amber: return Color(red: 0.92, green: 0.55, blue: 0.08)
        case .red: return Color(red: 0.86, green: 0.18, blue: 0.18)
        case .purple: return Color(red: 0.45, green: 0.27, blue: 0.86)
        case .teal: return Color(red: 0.03, green: 0.55, blue: 0.62)
        case .indigo: return Color(red: 0.25, green: 0.34, blue: 0.78)
        case .pink: return Color(red: 0.82, green: 0.22, blue: 0.47)
        case .slate: return Color(red: 0.27, green: 0.32, blue: 0.40)
        case .orange: return Color(red: 0.88, green: 0.34, blue: 0.11)
        }
    }
}

struct DateOnly: Codable, Hashable, Comparable, Identifiable {
    var year: Int
    var month: Int
    var day: Int

    var id: String { isoString }

    init(year: Int, month: Int, day: Int) {
        self.year = year
        self.month = month
        self.day = day
    }

    init(_ date: Date, calendar: Calendar = .classPilot) {
        let components = calendar.dateComponents([.year, .month, .day], from: date)
        self.year = components.year ?? 2026
        self.month = components.month ?? 1
        self.day = components.day ?? 1
    }

    var date: Date {
        Calendar.classPilot.date(from: DateComponents(year: year, month: month, day: day)) ?? Date()
    }

    var isoString: String {
        String(format: "%04d-%02d-%02d", year, month, day)
    }

    var weekday: Weekday {
        Weekday(calendarWeekday: Calendar.classPilot.component(.weekday, from: date))
    }

    func addingDays(_ count: Int) -> DateOnly {
        let nextDate = Calendar.classPilot.date(byAdding: .day, value: count, to: date) ?? date
        return DateOnly(nextDate)
    }

    func startOfWeek() -> DateOnly {
        DateOnly(date.classPilotStartOfWeek())
    }

    static func < (lhs: DateOnly, rhs: DateOnly) -> Bool {
        lhs.isoString < rhs.isoString
    }
}

struct Semester: Identifiable, Codable, Equatable {
    var id: UUID
    var name: String
    var startDate: DateOnly
    var endDate: DateOnly
    var isArchived: Bool

    init(
        id: UUID = UUID(),
        name: String,
        startDate: DateOnly,
        endDate: DateOnly,
        isArchived: Bool = false
    ) {
        self.id = id
        self.name = name
        self.startDate = startDate
        self.endDate = endDate
        self.isArchived = isArchived
    }
}

struct Course: Identifiable, Codable, Equatable {
    var id: UUID
    var semesterID: UUID
    var code: String
    var name: String
    var type: CourseType
    var recurrence: RecurrenceRule
    var days: [Weekday]
    var anchorDate: DateOnly
    var exactDates: [DateOnly]
    var startMinute: Int
    var endMinute: Int
    var location: String
    var color: CourseColor
    var notes: String
    var link: String

    init(
        id: UUID = UUID(),
        semesterID: UUID,
        code: String = "",
        name: String,
        type: CourseType = .lecture,
        recurrence: RecurrenceRule = .weekly,
        days: [Weekday] = [.monday],
        anchorDate: DateOnly = DateOnly(Date()),
        exactDates: [DateOnly] = [],
        startMinute: Int = 540,
        endMinute: Int = 630,
        location: String = "",
        color: CourseColor = .blue,
        notes: String = "",
        link: String = ""
    ) {
        self.id = id
        self.semesterID = semesterID
        self.code = code
        self.name = name
        self.type = type
        self.recurrence = recurrence
        self.days = Array(Set(days)).sorted()
        self.anchorDate = anchorDate
        self.exactDates = exactDates.sorted()
        self.startMinute = startMinute
        self.endMinute = endMinute
        self.location = location
        self.color = color
        self.notes = notes
        self.link = link
    }

    var displayName: String {
        let trimmedCode = code.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)

        if !trimmedCode.isEmpty && !trimmedName.isEmpty && trimmedCode.lowercased() != trimmedName.lowercased() {
            return "\(trimmedCode) \(trimmedName)"
        }

        return trimmedName.isEmpty ? trimmedCode : trimmedName
    }
}

struct CourseOccurrence: Identifiable, Equatable {
    var course: Course
    var date: DateOnly

    var id: String {
        "\(course.id.uuidString)-\(date.isoString)"
    }
}

struct AppSettings: Codable, Equatable {
    var language: Language = .zh
    var density: ScheduleDensity = .comfortable
}

struct ScheduleData: Codable, Equatable {
    var semesters: [Semester]
    var selectedSemesterID: UUID
    var courses: [Course]
    var settings: AppSettings
}
