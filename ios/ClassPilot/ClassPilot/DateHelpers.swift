import Foundation

extension Calendar {
    static var classPilot: Calendar {
        var calendar = Calendar(identifier: .gregorian)
        calendar.firstWeekday = 2
        calendar.minimumDaysInFirstWeek = 4
        return calendar
    }
}

extension Date {
    func classPilotStartOfWeek(calendar: Calendar = .classPilot) -> Date {
        let startOfDay = calendar.startOfDay(for: self)
        let weekday = calendar.component(.weekday, from: startOfDay)
        let daysFromMonday = (weekday + 5) % 7
        return calendar.date(byAdding: .day, value: -daysFromMonday, to: startOfDay) ?? startOfDay
    }
}

func dateForTime(minutes: Int) -> Date {
    let hour = max(0, min(23, minutes / 60))
    let minute = max(0, min(59, minutes % 60))
    return Calendar.classPilot.date(
        bySettingHour: hour,
        minute: minute,
        second: 0,
        of: Date()
    ) ?? Date()
}

func minutesFromTimeDate(_ date: Date) -> Int {
    let components = Calendar.classPilot.dateComponents([.hour, .minute], from: date)
    return (components.hour ?? 0) * 60 + (components.minute ?? 0)
}

func formattedTime(_ minutes: Int) -> String {
    String(format: "%02d:%02d", minutes / 60, minutes % 60)
}

func formattedMonthDay(_ date: DateOnly) -> String {
    String(format: "%02d/%02d", date.month, date.day)
}
