import { logger } from "./winston.js";
import { t } from "./i18n.js";
import { readdir, readFile } from "fs/promises";
import { join, dirname, extname, relative } from "path";
import { fileURLToPath } from "url";
import { parse } from "toml";
import { Character } from "./character.js";
import { autocomplete, box, BOX_STYLE, PAD_SIDE } from "./string.js";
import { ESCAPE_SIZER, Colorizer } from "./color.js";
import json2toml from "json2toml";
import { setAbsoluteInterval } from "./time.js";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = join(ROOT_PATH, "data");

// command type
import { Command } from "./command.js";

/**
 * Load commands and shit.
 */
const COMMANDS_PATH = join(ROOT_PATH, "build", "commands");
export const commands: Command[] = [];
async function loadCommands() {
	logger.debug(t("Loading commands."));
	const files = await readdir(COMMANDS_PATH);
	for (let file of files) {
		const COMMAND_PATH = join(COMMANDS_PATH, file);
		if (extname(COMMAND_PATH) !== ".js") continue;
		logger.debug(
			t("Loading file {{file}}", { file: relative(DATA_PATH, COMMAND_PATH) })
		);
		let data: any = await import(`file://${COMMAND_PATH}`);
		const command: Command = data.COMMAND;
		commands.push(command);
	}
}

export function command(character: Character, input: string) {
	for (let command of commands) {
		const safe = input.trim();
		const test = command.test(safe);
		if (!test) {
			const rule = /^(\S+)\s*/;
			const results = safe.match(rule);
			if (!results) continue;
			const word = results[1];
			if (!autocomplete(word, command.keyword)) continue;
			const msg = box(
				[command.description],
				80,
				`{WSyntax: {y${command.syntax}{x`,
				{
					...BOX_STYLE.PLAIN,
					titleHAlign: PAD_SIDE.CENTER,
					vPadding: 1,
					hAlign: PAD_SIDE.CENTER,
					borderColor: Colorizer.yellow,
				},
				ESCAPE_SIZER
			);
			character.sendLine(msg.join("\r\n"));
			return true;
		}
		const args = safe.match(command.rule);
		if (args) command.script(character, ...args.slice(1));
		else command.script(character);
		return true;
	}

	return false;
}

// shared by races and classes
import { Classification } from "./classification.js";

/**
 * Load races and shit.
 */
const RACES_PATH = join(DATA_PATH, "races");
export const races: Classification[] = [];
async function loadRaces() {
	logger.debug(t("Loading races."));
	const files = await readdir(RACES_PATH);
	for (let file of files) {
		const RACE_PATH = join(RACES_PATH, file);
		if (extname(RACE_PATH) !== ".toml") continue;
		logger.debug(
			t("Loading file {{file}}", { file: relative(DATA_PATH, RACE_PATH) })
		);
		const data = await readFile(RACE_PATH, "utf8");
		const json: any = parse(data);
		const race = Classification.fromJSON(json);
		races.push(race);
	}
}

/**
 * Load classes and shit.
 */
const CLASSES_PATH = join(DATA_PATH, "classes");
export const classes: Classification[] = [];
async function loadClasses() {
	logger.debug(t("Loading classes."));
	const files = await readdir(CLASSES_PATH);
	for (let file of files) {
		const CLASS_PATH = join(CLASSES_PATH, file);
		if (extname(CLASS_PATH) !== ".toml") continue;
		logger.debug(
			t("Loading file {{file}}", {
				file: relative(DATA_PATH, CLASS_PATH),
			})
		);
		const data = await readFile(CLASS_PATH, "utf8");
		const json = parse(data);
		const _class = Classification.fromJSON(json);
		classes.push(_class);
	}
}

/**
 * Load calendar and shit.
 */
import { Calendar, Month } from "./calendar.js";
const CALENDAR_PATH = join(DATA_PATH, "calendar.toml");
export let calendar: Calendar;
async function loadCalendar() {
	logger.debug(t("Loading calendar."));
	logger.debug(
		t("Loading file {{file}}", {
			file: relative(DATA_PATH, CALENDAR_PATH),
		})
	);
	const data = await readFile(CALENDAR_PATH, "utf8");
	const json = parse(data);
	calendar = Calendar.fromJSON(json);
}

/**
 * Load world data and shit.
 */
import { Clock } from "./clock.js";
const CLOCK_PATH = join(DATA_PATH, "clock.toml");
export let clock: Clock;
async function loadClock() {
	logger.debug(t("Loading clock."));
	logger.debug(
		t("Loading file {{file}}", {
			file: relative(DATA_PATH, CLOCK_PATH),
		})
	);
	const data = await readFile(CLOCK_PATH, "utf8");
	const json = parse(data);
	clock = Clock.fromJSON(json);
}
/**
 * Front facing access to database loading.
 */
export async function load() {
	return new Promise<void>(async (resolve) => {
		logger.debug(
			t("Started loading database at {{time}}.", {
				time: new Date().toLocaleTimeString(),
			})
		);
		const start = Date.now();
		await loadCommands();
		await loadRaces();
		await loadClasses();
		await loadCalendar();
		await loadClock();
		const end = Date.now();
		logger.debug(
			t("Finished loading database at {{time}}.", {
				time: new Date().toLocaleTimeString(),
			})
		);
		logger.debug(
			t("Database loaded in {{duration}} seconds.", {
				duration: (end - start) / 1000,
			})
		);
		resolve();
	});
}
