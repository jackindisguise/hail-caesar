import { logger } from "./winston.js";
import { t } from "./i18n.js";
import { readdir, readFile } from "fs/promises";
import { join, dirname, extname, relative } from "path";
import { fileURLToPath } from "url";
import { Character } from "./character.js";
import { autocomplete, box, BOX_STYLE, PAD_SIDE } from "./string.js";
import { ESCAPE_SIZER, Colorizer } from "./color.js";
import { stringify, parse } from "smol-toml";

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
			t("Loading '{{file}}'", { file: relative(DATA_PATH, COMMAND_PATH) })
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
				`Syntax: ${command.syntax}`,
				{
					...BOX_STYLE.PLAIN,
					titleHAlign: PAD_SIDE.CENTER,
					vPadding: 1,
					hAlign: PAD_SIDE.CENTER,
					borderColor: Colorizer.yellow,
					titleColor: Colorizer.white,
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
			t("Loading '{{file}}'", { file: relative(DATA_PATH, RACE_PATH) })
		);
		const data = await readFile(RACE_PATH, "utf8");
		const json: any = parse(data);
		const race = Classification.fromData(json);
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

/**
 * Load calendar and shit.
 */
import { Calendar, Month } from "./calendar.js";
import { table } from "table";
const CALENDAR_PATH = join(DATA_PATH, "calendar.toml");
export let calendar: Calendar;
async function loadCalendar() {
	logger.debug(t("Loading calendar."));
	logger.debug(
		t("Loading '{{file}}'", {
			file: relative(DATA_PATH, CALENDAR_PATH),
		})
	);
	const data = await readFile(CALENDAR_PATH, "utf8");
	const json = parse(data);
	calendar = Calendar.fromData(json);
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
	const lines = table(months).split("\n");
	lines.pop();
	logger.debug(`Calendar of ${calendar.months.length} months...`);
	for (let line of lines) logger.debug(t("> {{row}}", { row: line }));
	logger.debug(
		t("Seconds per minute: {{seconds}}", { seconds: calendar.secondsPerMinute })
	);
	logger.debug(
		t("Minutes per hour:   {{minutes}}", { minutes: calendar.minutesPerHour })
	);
	logger.debug(
		t("Hours per day:      {{hour}}", { hour: calendar.hoursPerDay })
	);
	logger.debug(
		t("Seconds per day:    {{seconds}}", {
			seconds:
				calendar.secondsPerMinute *
				calendar.minutesPerHour *
				calendar.hoursPerDay,
		})
	);
}

/**
 * Load clock data.
 */
import { Clock } from "./clock.js";
const CLOCK_PATH = join(DATA_PATH, "clock.toml");
export let clock: Clock;
async function loadClock() {
	logger.debug(t("Loading clock."));
	logger.debug(
		t("Loading '{{file}}'", {
			file: relative(DATA_PATH, CLOCK_PATH),
		})
	);
	const data = await readFile(CLOCK_PATH, "utf8");
	const json = parse(data);
	clock = Clock.fromData(json);
	const runtime = clock.runtime;
	logger.debug(
		t(
			"Clock set to {{year}}y {{day}}d {{hour}}h {{minute}}m {{second}}.{{milli}}s. (@{{time}})",
			{
				time: runtime,
				year: calendar.year(runtime),
				day: calendar.day(runtime),
				hour: calendar.hour(runtime),
				minute: calendar.minute(runtime),
				second: calendar.second(runtime),
				milli: calendar.millisecond(runtime),
			}
		)
	);
}

/**
 * Load world data.
 */
import { World } from "./world.js";
const WORLD_PATH = join(DATA_PATH, "world.toml");
export let world: World;
async function loadWorld() {
	logger.debug(t("Loading world."));
	logger.debug(
		t("Loading '{{file}}'", {
			file: relative(DATA_PATH, WORLD_PATH),
		})
	);
	const data = await readFile(WORLD_PATH, "utf8");
	const json = parse(data);
	world = World.fromJSON(json);
}

/**
 * Front facing access to database loading.
 */
export async function load() {
	return new Promise<void>(async (resolve, reject) => {
		logger.debug(
			t("Started loading database at {{time}}.", {
				time: new Date().toLocaleTimeString(),
			})
		);
		const start = Date.now();
		logger.debug(">>>");
		await loadWorld();
		logger.debug(">>>");
		await loadCalendar();
		logger.debug(">>>");
		await loadClock();
		logger.debug(">>>");
		await loadRaces();
		logger.debug(">>>");
		await loadClasses();
		logger.debug(">>>");
		await loadCommands();
		logger.debug(">>>");
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
