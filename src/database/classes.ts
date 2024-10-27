import { logger } from "../winston.js";
import { t } from "i18next";
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
import { table } from "table";
const CLASSES_PATH = join(DATA_PATH, "classes");
export const classes: Classification[] = [];
export async function load() {
	logger.debug(t("Loading classes."));
	const files = await readdir(CLASSES_PATH);
	const info: string[] = [];
	for (let file of files) {
		const CLASS_PATH = join(CLASSES_PATH, file);
		if (extname(CLASS_PATH) !== ".toml") continue;
		const data = await readFile(CLASS_PATH, "utf8");
		const json = parse(data);
		const _class = Classification.fromData(json);
		classes.push(_class);
		info.push(_class.name);
	}

	const original = [];
	while (info.length)
		original.push([info.shift() || "", info.shift() || "", info.shift() || ""]);
	const lines = table(original, {
		columns: [{ width: 16 }, { width: 16 }, { width: 17 }],
		drawVerticalLine: (index, cols) => index == 0 || index == cols,
		drawHorizontalLine: (index, rows) =>
			(index >= 0 && index <= 1) || index === rows,
		header: {
			alignment: "center",
			content: "Classes",
		},
	}).split("\n");
	lines.pop();
	for (let line of lines) logger.debug(line);
}
