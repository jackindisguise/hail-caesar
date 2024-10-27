import { EOL } from "os";
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
 * Load races and shit.
 */
import { table, getBorderCharacters } from "table";
const RACES_PATH = join(DATA_PATH, "races");
export const races: Classification[] = [];
export async function load() {
	logger.debug(t("Loading races."));
	const files = await readdir(RACES_PATH);
	const info: string[] = [];
	for (let file of files) {
		const RACE_PATH = join(RACES_PATH, file);
		if (extname(RACE_PATH) !== ".toml") continue;
		const data = await readFile(RACE_PATH, "utf8");
		const json: any = parse(data);
		const race = Classification.fromData(json);
		races.push(race);
		info.push(race.name);
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
			content: "Races",
		},
	}).split("\n");
	lines.pop();
	for (let line of lines) logger.debug(line);
}
