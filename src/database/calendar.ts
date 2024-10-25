import { logger } from "../winston.js";
import { t } from "../i18n.js";
import { readFile } from "fs/promises";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";
import { parse } from "smol-toml";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_PATH = join(ROOT_PATH, "data");

/**
 * Load calendar and shit.
 */
import { Calendar, Month } from "../calendar.js";
import { table, getBorderCharacters } from "table";
const CALENDAR_PATH = join(DATA_PATH, "calendar.toml");
export let calendar: Calendar;
export async function load() {
	logger.debug(t("Loading calendar."));
	logger.debug(
		t("Loading '{{file}}'", {
			file: relative(DATA_PATH, CALENDAR_PATH),
		})
	);
	const data = await readFile(CALENDAR_PATH, "utf8");
	const json = parse(data);
	calendar = Calendar.fromData(json);

	/**
	 * Display the loaded calendar data.
	 */
	const months: string[][] = [];
	let line: string[] = [];
	for (let i = 0; i < calendar.months.length; i++) {
		if (i > 0 && i % 3 === 0) {
			months.push(line);
			line = [];
		}
		const month: Month = calendar.months[i];
		line.push(`${i + 1}) ${month.name}`);
	}
	if (line.length) {
		while (line.length < 3) line.push("");
		months.push(line);
	}
	let lines = table(months, {
		columnDefault: {
			width: 15,
		},
		columns: [{ width: 17 }],
		border: getBorderCharacters("ramac"),
		header: {
			alignment: "center",
			content: "Calendar",
		},
	}).split("\n");
	lines.pop();
	for (let line of lines) logger.debug(t("{{row}}", { row: line }));
	const dTable = [
		["Minutes:", `${calendar.secondsPerMinute} real second/s`],
		["Hours:", `${calendar.minutesPerHour} in-game minute/s`],
		["Days:", `${calendar.hoursPerDay} in-game hour/s`],
		[
			"",
			`${
				calendar.secondsPerMinute *
				calendar.minutesPerHour *
				calendar.hoursPerDay
			} real second/s`,
		],
	];
	lines = table(dTable, {
		columnDefault: {
			width: 25,
		},
		spanningCells: [
			{
				col: 0,
				row: 2,
				rowSpan: 2,
				verticalAlignment: "middle",
			},
		],
		columns: [{ alignment: "right" }, { alignment: "left" }],
		border: getBorderCharacters("ramac"),
		header: {
			alignment: "center",
			content: "Time Scale",
		},
	}).split("\n");
	lines.pop();
	for (let line of lines) logger.debug(t("{{row}}", { row: line }));
}
