import i18next from "i18next";
import Backend, { FsBackendOptions } from "i18next-fs-backend";

await i18next.use(Backend).init<FsBackendOptions>({
	lng: "ja",
	saveMissing: true,
	saveMissingTo: "fallback",
	fallbackLng: "en",
	backend: {
		loadPath: "./xlocales/{{lng}}/{{ns}}.json",
		addPath: "./xlocales/{{lng}}/{{ns}}.missing.json",
	},
});

export const _ = i18next.t;