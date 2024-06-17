import { t, use } from "i18next";
import i18next_backend from "i18next-fs-backend";

const backend = new i18next_backend({
	loadPath: "/locales/{{lng}}/{{ns}}.json",
});

use(backend).init();

export { t as _ };
