import { EOL } from "os";
import { logger } from "../winston.js";
import { t } from "i18next";
import { readdir, readFile } from "fs/promises";
import { join, dirname, extname, relative } from "path";
import { fileURLToPath } from "url";
import { parse } from "smol-toml";
import { table } from "table";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_PATH = join(ROOT_PATH, "data");

// shared by races and classes
import { Classification } from "../classification.js";

/**
 * Load races and shit.
 */
const RACES_PATH = join(DATA_PATH, "races");
export const races: Classification[] = [];
export async function load() {
	logger.debug(t("Loading races."));
	const files = await readdir(RACES_PATH);
	const info: string[][] = [["Name", "Description"]];
	for (let file of files) {
		const RACE_PATH = join(RACES_PATH, file);
		if (extname(RACE_PATH) !== ".toml") continue;
		//logger.debug(
		//	t("Loading '{{file}}'", { file: relative(DATA_PATH, RACE_PATH) })
		//);
		const data = await readFile(RACE_PATH, "utf8");
		const json: any = parse(data);
		const race = Classification.fromData(json);
		races.push(race);
		info.push([race.name, race.description]);
	}
	const lines = table(info).split(EOL);
	lines.pop();
	for (let line of lines) logger.debug(line);
}
