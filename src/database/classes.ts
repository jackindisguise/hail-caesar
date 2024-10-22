import { logger } from "../winston.js";
import { t } from "../i18n.js";
import { readdir, readFile } from "fs/promises";
import { join, dirname, extname, relative } from "path";
import { fileURLToPath } from "url";
import { parse } from "smol-toml";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_PATH = join(ROOT_PATH, "data");

// shared by races and classes
import { Classification } from "../classification.js";

/**
 * Load classes and shit.
 */
const CLASSES_PATH = join(DATA_PATH, "classes");
export const classes: Classification[] = [];
export async function load() {
	logger.debug(t("Loading classes."));
	const files = await readdir(CLASSES_PATH);
	for (let file of files) {
		const CLASS_PATH = join(CLASSES_PATH, file);
		if (extname(CLASS_PATH) !== ".toml") continue;
		logger.debug(
			t("Loading '{{file}}'", {
				file: relative(DATA_PATH, CLASS_PATH),
			})
		);
		const data = await readFile(CLASS_PATH, "utf8");
		const json = parse(data);
		const _class = Classification.fromData(json);
		classes.push(_class);
	}
}
