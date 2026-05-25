import SwiftUI

struct ScheduleView: View {
    @EnvironmentObject private var store: ScheduleStore
    @Binding var showingNewCourse: Bool
    @State private var weekStart = DateOnly(Date()).startOfWeek()
    @State private var editingCourse: Course?

    private var language: Language {
        store.data.settings.language
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                weekToolbar

                Divider()

                WeekGridView(weekStart: weekStart, editingCourse: $editingCourse)
            }
            .navigationTitle("ClassPilot")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showingNewCourse = true
                    } label: {
                        Image(systemName: "plus")
                    }
                    .accessibilityLabel(Copy.text("add", language))
                }
            }
            .sheet(item: $editingCourse) { course in
                NavigationStack {
                    CourseEditorView(course: course)
                }
            }
        }
    }

    private var weekToolbar: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 10) {
                Button(Copy.text("previous", language)) {
                    weekStart = weekStart.addingDays(-7)
                }
                .buttonStyle(.bordered)

                Button(Copy.text("today", language)) {
                    weekStart = DateOnly(Date()).startOfWeek()
                }
                .buttonStyle(.borderedProminent)

                Button(Copy.text("next", language)) {
                    weekStart = weekStart.addingDays(7)
                }
                .buttonStyle(.bordered)

                Spacer()
            }

            Text("\(weekStart.isoString) - \(weekStart.addingDays(6).isoString)")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.secondary)
        }
        .padding(.horizontal)
        .padding(.vertical, 12)
    }
}

struct WeekGridView: View {
    @EnvironmentObject private var store: ScheduleStore
    let weekStart: DateOnly
    @Binding var editingCourse: Course?

    private let startHour = 8
    private let endHour = 22
    private let timeColumnWidth: CGFloat = 54
    private let headerHeight: CGFloat = 56

    private var language: Language {
        store.data.settings.language
    }

    private var weekDays: [DateOnly] {
        (0..<7).map { weekStart.addingDays($0) }
    }

    var body: some View {
        GeometryReader { proxy in
            let hourHeight = store.data.settings.density.hourHeight
            let dayWidth = max((proxy.size.width - timeColumnWidth) / 7, 116)
            let gridWidth = timeColumnWidth + dayWidth * 7
            let gridHeight = headerHeight + hourHeight * CGFloat(endHour - startHour)

            ScrollView([.horizontal, .vertical]) {
                ZStack(alignment: .topLeading) {
                    gridBackground(gridWidth: gridWidth, dayWidth: dayWidth, hourHeight: hourHeight)
                    gridHeaders(dayWidth: dayWidth)
                    gridTimeLabels(hourHeight: hourHeight)
                    courseBlocks(dayWidth: dayWidth, hourHeight: hourHeight)
                }
                .frame(width: gridWidth, height: gridHeight, alignment: .topLeading)
                .background(Color(.systemBackground))
            }
        }
    }

    private func gridBackground(gridWidth: CGFloat, dayWidth: CGFloat, hourHeight: CGFloat) -> some View {
        ZStack(alignment: .topLeading) {
            Rectangle()
                .fill(Color(.secondarySystemBackground))
                .frame(width: timeColumnWidth, height: headerHeight + hourHeight * CGFloat(endHour - startHour))

            Rectangle()
                .fill(Color(.tertiarySystemBackground))
                .frame(width: gridWidth, height: headerHeight)

            ForEach(startHour...endHour, id: \.self) { hour in
                Rectangle()
                    .fill(Color.secondary.opacity(0.18))
                    .frame(width: gridWidth, height: hour == startHour ? 1 : 0.5)
                    .offset(y: headerHeight + CGFloat(hour - startHour) * hourHeight)
            }

            ForEach(0...7, id: \.self) { index in
                Rectangle()
                    .fill(Color.secondary.opacity(0.18))
                    .frame(width: 0.5, height: headerHeight + hourHeight * CGFloat(endHour - startHour))
                    .offset(x: timeColumnWidth + CGFloat(index) * dayWidth)
            }
        }
    }

    private func gridHeaders(dayWidth: CGFloat) -> some View {
        ZStack(alignment: .topLeading) {
            Text("Time")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
                .frame(width: timeColumnWidth, height: headerHeight)

            ForEach(Array(weekDays.enumerated()), id: \.element) { index, day in
                VStack(spacing: 3) {
                    Text(day.weekday.shortName(language))
                        .font(.headline)
                    Text(formattedMonthDay(day))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .frame(width: dayWidth, height: headerHeight)
                .offset(x: timeColumnWidth + CGFloat(index) * dayWidth)
            }
        }
    }

    private func gridTimeLabels(hourHeight: CGFloat) -> some View {
        ZStack(alignment: .topLeading) {
            ForEach(startHour..<endHour, id: \.self) { hour in
                Text(formattedTime(hour * 60))
                    .font(.caption.monospacedDigit())
                    .foregroundStyle(.secondary)
                    .frame(width: timeColumnWidth - 8, alignment: .trailing)
                    .offset(x: 0, y: headerHeight + CGFloat(hour - startHour) * hourHeight + 8)
            }
        }
    }

    private func courseBlocks(dayWidth: CGFloat, hourHeight: CGFloat) -> some View {
        ZStack(alignment: .topLeading) {
            ForEach(store.occurrences(in: weekStart)) { occurrence in
                if let dayIndex = weekDays.firstIndex(of: occurrence.date) {
                    let start = max(startHour * 60, min(endHour * 60, occurrence.course.startMinute))
                    let end = max(start + 30, min(endHour * 60, occurrence.course.endMinute))
                    let top = headerHeight + CGFloat(start - startHour * 60) / 60 * hourHeight + 4
                    let height = max(CGFloat(end - start) / 60 * hourHeight - 8, 58)
                    let left = timeColumnWidth + CGFloat(dayIndex) * dayWidth + 5

                    CourseBlockView(course: occurrence.course, language: language)
                        .frame(width: dayWidth - 10, height: height)
                        .offset(x: left, y: top)
                        .onTapGesture {
                            editingCourse = occurrence.course
                        }
                }
            }
        }
    }
}

struct CourseBlockView: View {
    let course: Course
    let language: Language

    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            HStack(spacing: 6) {
                if !course.code.isEmpty {
                    Text(course.code)
                        .font(.caption.weight(.bold))
                        .lineLimit(1)
                }

                Text(course.type.title(language))
                    .font(.caption2.weight(.semibold))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(.white.opacity(0.86), in: Capsule())
                    .foregroundStyle(course.color.color)
                    .lineLimit(1)
            }

            if !course.name.isEmpty && course.name.lowercased() != course.code.lowercased() {
                Text(course.name)
                    .font(.callout.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }

            Text("\(formattedTime(course.startMinute)) - \(formattedTime(course.endMinute))")
                .font(.caption.weight(.semibold))
                .monospacedDigit()
                .lineLimit(1)

            if !course.location.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                Text(course.location)
                    .font(.caption)
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }

            Spacer(minLength: 0)
        }
        .padding(8)
        .foregroundStyle(.white)
        .background(course.color.color.gradient, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
        .shadow(color: course.color.color.opacity(0.22), radius: 5, x: 0, y: 3)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(course.displayName)
    }
}
