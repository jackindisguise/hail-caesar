import i18next from "i18next";
import Backend, { FsBackendOptions } from "i18next-fs-backend";

export async function setup() {
	await i18next.use(Backend).init<FsBackendOptions>({
		lng: "en",
		interpolation: { escapeValue: false },
		saveMissing: true,
		saveMissingTo: "fallback",
		fallbackLng: "en",
		backend: {
			loadPath: "./xlocales/{{lng}}/{{ns}}.json",
			addPath: "./xlocales/{{lng}}/{{ns}}.missing.json",
		},
	});
}
