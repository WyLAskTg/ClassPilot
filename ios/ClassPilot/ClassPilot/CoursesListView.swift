import SwiftUI

struct CoursesListView: View {
    @EnvironmentObject private var store: ScheduleStore
    @Binding var showingNewCourse: Bool
    @State private var editingCourse: Course?

    private var language: Language {
        store.data.settings.language
    }

    var body: some View {
        NavigationStack {
            List {
                if store.selectedCourses.isEmpty {
                    ContentUnavailableView(
                        Copy.text("noCourses", language),
                        systemImage: "calendar.badge.plus",
                        description: Text(Copy.text("prototypeNote", language))
                    )
                } else {
                    ForEach(store.selectedCourses) { course in
                        Button {
                            editingCourse = course
                        } label: {
                            CourseListRow(course: course, language: language)
                        }
                        .buttonStyle(.plain)
                    }
                    .onDelete(perform: store.deleteCourses)
                }
            }
            .navigationTitle(Copy.text("courses", language))
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
}

struct CourseListRow: View {
    let course: Course
    let language: Language

    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 4, style: .continuous)
                .fill(course.color.color)
                .frame(width: 8, height: 48)

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 8) {
                    if !course.code.isEmpty {
                        Text(course.code)
                            .font(.headline)
                    }

                    Text(course.type.title(language))
                        .font(.caption.weight(.semibold))
                        .padding(.horizontal, 7)
                        .padding(.vertical, 3)
                        .foregroundStyle(course.color.color)
                        .background(course.color.color.opacity(0.12), in: Capsule())
                }

                if !course.name.isEmpty {
                    Text(course.name)
                        .font(.subheadline)
                        .foregroundStyle(.primary)
                }

                HStack(spacing: 6) {
                    Text("\(formattedTime(course.startMinute)) - \(formattedTime(course.endMinute))")

                    if !course.location.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        Text("·")
                        Text(course.location)
                    }
                }
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
            }
        }
        .padding(.vertical, 4)
    }
}
