import Combine
import Foundation

@MainActor
final class ScheduleStore: ObservableObject {
    @Published var data: ScheduleData {
        didSet {
            save()
        }
    }

    init() {
        self.data = Self.loadData() ?? Self.makeSampleData()
    }

    var selectedSemester: Semester? {
        data.semesters.first { $0.id == data.selectedSemesterID } ?? data.semesters.first
    }

    var selectedCourses: [Course] {
        guard let semesterID = selectedSemester?.id else { return [] }
        return data.courses
            .filter { $0.semesterID == semesterID }
            .sorted { first, second in
                if first.startMinute != second.startMinute {
                    return first.startMinute < second.startMinute
                }

                return first.displayName.localizedCaseInsensitiveCompare(second.displayName) == .orderedAscending
            }
    }

    func addCourse(_ course: Course) {
        data.courses.append(course)
    }

    func updateCourse(_ course: Course) {
        guard let index = data.courses.firstIndex(where: { $0.id == course.id }) else {
            addCourse(course)
            return
        }

        data.courses[index] = course
    }

    func deleteCourse(_ course: Course) {
        data.courses.removeAll { $0.id == course.id }
    }

    func deleteCourses(at offsets: IndexSet) {
        let ids = offsets.map { selectedCourses[$0].id }
        data.courses.removeAll { ids.contains($0.id) }
    }

    func createSemester() {
        let today = DateOnly(Date()).startOfWeek()
        let semester = Semester(
            name: "\(Copy.text("currentSemester", data.settings.language)) \(data.semesters.count + 1)",
            startDate: today,
            endDate: today.addingDays(120)
        )

        data.semesters.append(semester)
        data.selectedSemesterID = semester.id
    }

    func occurrences(in weekStart: DateOnly) -> [CourseOccurrence] {
        let days = (0..<7).map { weekStart.addingDays($0) }

        return selectedCourses.flatMap { course in
            days.compactMap { date in
                includes(course, on: date) ? CourseOccurrence(course: course, date: date) : nil
            }
        }
        .sorted { first, second in
            if first.date != second.date {
                return first.date < second.date
            }

            if first.course.startMinute != second.course.startMinute {
                return first.course.startMinute < second.course.startMinute
            }

            return first.course.displayName < second.course.displayName
        }
    }

    private func includes(_ course: Course, on date: DateOnly) -> Bool {
        switch course.recurrence {
        case .weekly:
            return course.days.contains(date.weekday)
        case .biweekly:
            guard course.days.contains(date.weekday) else { return false }
            let weekDifference = Calendar.classPilot.dateComponents([.weekOfYear], from: course.anchorDate.date, to: date.date).weekOfYear ?? 0
            return weekDifference >= 0 && weekDifference % 2 == 0
        case .monthly:
            return date.day == course.anchorDate.day
        case .once:
            let dates = course.exactDates.isEmpty ? [course.anchorDate] : course.exactDates
            return dates.contains(date)
        }
    }

    private func save() {
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
            let encoded = try encoder.encode(data)
            try encoded.write(to: Self.storageURL, options: [.atomic])
        } catch {
            print("Failed to save ClassPilot iOS data: \(error)")
        }
    }

    private static func loadData() -> ScheduleData? {
        do {
            let savedData = try Data(contentsOf: storageURL)
            return try JSONDecoder().decode(ScheduleData.self, from: savedData)
        } catch {
            return nil
        }
    }

    private static var storageURL: URL {
        let directory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
        return (directory ?? FileManager.default.temporaryDirectory).appendingPathComponent("classpilot-ios-data.json")
    }

    private static func makeSampleData() -> ScheduleData {
        let start = DateOnly(Date()).startOfWeek()
        let semester = Semester(
            name: "Current Semester",
            startDate: start,
            endDate: start.addingDays(120)
        )

        let courses = [
            Course(
                semesterID: semester.id,
                code: "CS101",
                name: "Algorithms",
                type: .lecture,
                recurrence: .weekly,
                days: [.monday, .wednesday],
                anchorDate: start,
                startMinute: 540,
                endMinute: 630,
                location: "Room A101",
                color: .blue
            ),
            Course(
                semesterID: semester.id,
                code: "MATH204",
                name: "Linear Algebra",
                type: .tutorial,
                recurrence: .biweekly,
                days: [.friday],
                anchorDate: start.addingDays(4),
                startMinute: 840,
                endMinute: 960,
                location: "Lab 2",
                color: .green
            ),
            Course(
                semesterID: semester.id,
                code: "BIO150",
                name: "Lab Safety",
                type: .lab,
                recurrence: .once,
                days: [.tuesday],
                anchorDate: start.addingDays(1),
                exactDates: [start.addingDays(1)],
                startMinute: 660,
                endMinute: 750,
                location: "",
                color: .amber
            )
        ]

        return ScheduleData(
            semesters: [semester],
            selectedSemesterID: semester.id,
            courses: courses,
            settings: AppSettings()
        )
    }
}
