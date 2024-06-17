import { logger } from "./winston.js";
import { _ } from "./i18n.js";
import { readdir, readFile } from "fs/promises";
import { join, dirname, extname, relative } from "path";
import { fileURLToPath } from "url";
import { parse } from "toml";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = join(ROOT_PATH, "data");

// shared by races and classes
import { Classification } from "./classification.js";

/**
 * Load races and shit.
 */
const RACES_PATH = join(DATA_PATH, "races");
export const races: Classification[] = [];
async function loadRaces() {
	logger.debug(_("> Loading races."));
	const files = await readdir(RACES_PATH);
	for (let file of files) {
		const RACE_PATH = join(RACES_PATH, file);
		if (extname(RACE_PATH) !== ".toml") continue;
		logger.debug(
			_("> > Loading file {{file}}", { file: relative(DATA_PATH, RACE_PATH) })
		);
		const data = await readFile(RACE_PATH, "utf8");
		const json: any = parse(data);
		const race = Classification.fromJSON(json);
		if (race) races.push(race);
	}
}

/**
 * Load classes and shit.
 */
const CLASSES_PATH = join(DATA_PATH, "classes");
export const classes: Classification[] = [];
async function loadClasses() {
	logger.debug(_("> Loading classes."));
	const files = await readdir(CLASSES_PATH);
	for (let file of files) {
		const CLASS_PATH = join(CLASSES_PATH, file);
		if (extname(CLASS_PATH) !== ".toml") continue;
		logger.debug(
			_("> > Loading file {{file}}", {
				file: relative(DATA_PATH, CLASS_PATH),
			})
		);
		const data = await readFile(CLASS_PATH, "utf8");
		const json = parse(data);
		const _class = Classification.fromJSON(json);
		if (_class) classes.push(_class);
	}
}

/**
 * Load calendar and shit.
 */
import { Calendar, Month } from "./calendar.js";
const CALENDAR_PATH = join(DATA_PATH, "calendar.toml");
export let calendar: Calendar;
async function loadCalendar() {
	logger.debug(_("> Loading calendar."));
	logger.debug(
		_("> > Loading file {{file}}", {
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
import { World } from "./world.js";
const WORLD_PATH = join(DATA_PATH, "world.toml");
export let world: World;
async function loadWorld() {
	logger.debug(_("> Loading world."));
	logger.debug(
		_("> > Loading file {{file}}", {
			file: relative(DATA_PATH, WORLD_PATH),
		})
	);
	const data = await readFile(WORLD_PATH, "utf8");
	const json = parse(data);
	world = World.fromJSON(json);
}
/**
 * Front facing access to database loading.
 * @param done Callback to run on successful database load.
 */
export async function load(done: (ms: number) => void) {
	logger.debug(_("Loading database."));
	const start = Date.now();
	await loadRaces();
	await loadClasses();
	await loadCalendar();
	await loadWorld();
	const end = Date.now();
	logger.debug(
		_("Database loaded in {{duration}} seconds.", {
			duration: (end - start) / 1000,
		})
	);
	done(end - start);
}
