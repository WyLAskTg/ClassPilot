import SwiftUI

struct CourseEditorView: View {
    @EnvironmentObject private var store: ScheduleStore
    @Environment(\.dismiss) private var dismiss

    private let originalCourse: Course?

    @State private var code: String
    @State private var name: String
    @State private var type: CourseType
    @State private var recurrence: RecurrenceRule
    @State private var selectedDays: Set<Weekday>
    @State private var anchorDate: Date
    @State private var startTime: Date
    @State private var endTime: Date
    @State private var location: String
    @State private var notes: String
    @State private var link: String
    @State private var color: CourseColor
    @State private var validationMessage = ""
    @State private var showingValidation = false

    init(course: Course?) {
        self.originalCourse = course
        _code = State(initialValue: course?.code ?? "")
        _name = State(initialValue: course?.name ?? "")
        _type = State(initialValue: course?.type ?? .lecture)
        _recurrence = State(initialValue: course?.recurrence ?? .weekly)
        _selectedDays = State(initialValue: Set(course?.days ?? [.monday]))
        _anchorDate = State(initialValue: course?.anchorDate.date ?? Date())
        _startTime = State(initialValue: dateForTime(minutes: course?.startMinute ?? 540))
        _endTime = State(initialValue: dateForTime(minutes: course?.endMinute ?? 630))
        _location = State(initialValue: course?.location ?? "")
        _notes = State(initialValue: course?.notes ?? "")
        _link = State(initialValue: course?.link ?? "")
        _color = State(initialValue: course?.color ?? .blue)
    }

    private var language: Language {
        store.data.settings.language
    }

    var body: some View {
        Form {
            Section(Copy.text("newCourse", language)) {
                TextField(Copy.text("courseCode", language), text: $code)
                    .textInputAutocapitalization(.characters)
                    .autocorrectionDisabled()

                TextField(Copy.text("courseName", language), text: $name)

                Picker(Copy.text("courseType", language), selection: $type) {
                    ForEach(CourseType.allCases) { courseType in
                        Text(courseType.title(language)).tag(courseType)
                    }
                }
            }

            Section(Copy.text("recurrence", language)) {
                Picker(Copy.text("recurrence", language), selection: $recurrence) {
                    ForEach(RecurrenceRule.allCases) { rule in
                        Text(rule.title(language)).tag(rule)
                    }
                }

                if recurrence == .weekly || recurrence == .biweekly {
                    weekdaySelector
                }

                if recurrence != .weekly {
                    DatePicker(Copy.text("date", language), selection: $anchorDate, displayedComponents: .date)
                }
            }

            Section {
                DatePicker(Copy.text("start", language), selection: $startTime, displayedComponents: .hourAndMinute)
                DatePicker(Copy.text("end", language), selection: $endTime, displayedComponents: .hourAndMinute)
            }

            Section(Copy.text("location", language)) {
                TextField(Copy.text("location", language), text: $location)
                TextField(Copy.text("link", language), text: $link)
                    .keyboardType(.URL)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                TextField(Copy.text("notes", language), text: $notes, axis: .vertical)
                    .lineLimit(3...6)
            }

            Section(Copy.text("color", language)) {
                colorSelector
            }
        }
        .navigationTitle(originalCourse == nil ? Copy.text("newCourse", language) : Copy.text("edit", language))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button(Copy.text("cancel", language)) {
                    dismiss()
                }
            }

            ToolbarItem(placement: .confirmationAction) {
                Button(Copy.text("save", language)) {
                    saveCourse()
                }
            }
        }
        .alert(Copy.text("cannotSave", language), isPresented: $showingValidation) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(validationMessage)
        }
    }

    private var weekdaySelector: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 4), spacing: 8) {
            ForEach(Weekday.allCases) { weekday in
                let isSelected = selectedDays.contains(weekday)

                Button {
                    if isSelected {
                        selectedDays.remove(weekday)
                    } else {
                        selectedDays.insert(weekday)
                    }
                } label: {
                    Text(weekday.shortName(language))
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 9)
                        .foregroundStyle(isSelected ? .white : .primary)
                        .background(
                            isSelected ? Color.accentColor : Color(.secondarySystemBackground),
                            in: Capsule()
                        )
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.vertical, 4)
    }

    private var colorSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 14) {
                ForEach(CourseColor.allCases) { courseColor in
                    Button {
                        color = courseColor
                    } label: {
                        Circle()
                            .fill(courseColor.color)
                            .frame(width: 34, height: 34)
                            .overlay {
                                if color == courseColor {
                                    Image(systemName: "checkmark")
                                        .font(.caption.weight(.bold))
                                        .foregroundStyle(.white)
                                }
                            }
                            .overlay {
                                Circle()
                                    .stroke(Color.primary.opacity(color == courseColor ? 0.35 : 0.12), lineWidth: 1)
                            }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.vertical, 4)
        }
    }

    private func saveCourse() {
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        let startMinute = minutesFromTimeDate(startTime)
        let endMinute = minutesFromTimeDate(endTime)

        guard !trimmedName.isEmpty else {
            showValidation(Copy.text("requiredName", language))
            return
        }

        guard endMinute > startMinute else {
            showValidation(Copy.text("invalidTime", language))
            return
        }

        if (recurrence == .weekly || recurrence == .biweekly) && selectedDays.isEmpty {
            showValidation(Copy.text("selectDay", language))
            return
        }

        guard let semesterID = originalCourse?.semesterID ?? store.selectedSemester?.id else {
            return
        }

        let dateOnly = DateOnly(anchorDate)
        let course = Course(
            id: originalCourse?.id ?? UUID(),
            semesterID: semesterID,
            code: code.trimmingCharacters(in: .whitespacesAndNewlines),
            name: trimmedName,
            type: type,
            recurrence: recurrence,
            days: Array(selectedDays).sorted(),
            anchorDate: dateOnly,
            exactDates: recurrence == .once ? [dateOnly] : [],
            startMinute: startMinute,
            endMinute: endMinute,
            location: location.trimmingCharacters(in: .whitespacesAndNewlines),
            color: color,
            notes: notes.trimmingCharacters(in: .whitespacesAndNewlines),
            link: link.trimmingCharacters(in: .whitespacesAndNewlines)
        )

        store.updateCourse(course)
        dismiss()
    }

    private func showValidation(_ message: String) {
        validationMessage = message
        showingValidation = true
    }
}
