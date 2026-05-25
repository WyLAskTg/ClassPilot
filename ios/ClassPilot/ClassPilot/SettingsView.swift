import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var store: ScheduleStore

    private var language: Language {
        store.data.settings.language
    }

    var body: some View {
        NavigationStack {
            Form {
                Section(Copy.text("settings", language)) {
                    Picker(
                        Copy.text("language", language),
                        selection: Binding(
                            get: { store.data.settings.language },
                            set: { store.data.settings.language = $0 }
                        )
                    ) {
                        ForEach(Language.allCases) { language in
                            Text(language.displayName).tag(language)
                        }
                    }

                    Picker(
                        Copy.text("density", language),
                        selection: Binding(
                            get: { store.data.settings.density },
                            set: { store.data.settings.density = $0 }
                        )
                    ) {
                        ForEach(ScheduleDensity.allCases) { density in
                            Text(Copy.text(density.rawValue, language)).tag(density)
                        }
                    }
                }

                Section(Copy.text("semester", language)) {
                    Picker(
                        Copy.text("semester", language),
                        selection: Binding(
                            get: { store.data.selectedSemesterID },
                            set: { store.data.selectedSemesterID = $0 }
                        )
                    ) {
                        ForEach(store.data.semesters) { semester in
                            Text(semester.name).tag(semester.id)
                        }
                    }

                    Button {
                        store.createSemester()
                    } label: {
                        Label(Copy.text("createSemester", language), systemImage: "plus")
                    }
                }
            }
            .navigationTitle(Copy.text("settings", language))
        }
    }
}
