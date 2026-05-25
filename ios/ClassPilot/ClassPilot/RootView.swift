import SwiftUI

struct RootView: View {
    @EnvironmentObject private var store: ScheduleStore
    @State private var showingNewCourse = false

    private var language: Language {
        store.data.settings.language
    }

    var body: some View {
        TabView {
            ScheduleView(showingNewCourse: $showingNewCourse)
                .tabItem {
                    Label(Copy.text("schedule", language), systemImage: "calendar")
                }

            CoursesListView(showingNewCourse: $showingNewCourse)
                .tabItem {
                    Label(Copy.text("courses", language), systemImage: "list.bullet.rectangle")
                }

            SettingsView()
                .tabItem {
                    Label(Copy.text("settings", language), systemImage: "gearshape")
                }
        }
        .sheet(isPresented: $showingNewCourse) {
            NavigationStack {
                CourseEditorView(course: nil)
            }
        }
    }
}
