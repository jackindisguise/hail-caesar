import { logger } from "../winston.js";
import { t } from "i18next";
import { calendar } from "./calendar.js";
import { runtime } from "./runtime.js";
import { table, getBorderCharacters } from "table";

/**
 * Load clock data.
 */
import { Clock } from "../clock.js";
export let clock: Clock;
export async function load() {
	logger.debug(t("Loading clock."));
	clock = Clock.fromData(runtime.clock);
	const currentTime = clock.time; // clock.time can change with each access -- store value
	let clockData = [
		["Timestamp:", currentTime],
		["Year:", calendar.year(currentTime)],
		["Day:", calendar.day(currentTime)],
		["Hour:", calendar.hour(currentTime)],
		["Minute:", calendar.minute(currentTime)],
		["Second:", calendar.second(currentTime)],
		["Millisecond:", calendar.millisecond(currentTime)],
	];
	let lines = table(clockData, {
		columns: [
			{ alignment: "right", width: 25 },
			{ alignment: "left", width: 26 },
		],
		header: {
			alignment: "center",
			content: "Universal Clock",
		},
		drawVerticalLine: (index, columns) => {
			return index === 0 || index == columns;
		},
		drawHorizontalLine: (index, rows) => {
			return (index >= 0 && index <= 2) || index === rows;
		},
	}).split("\n");
	lines.pop();
	for (let line of lines) logger.debug(t("{{row}}", { row: line }));
}
