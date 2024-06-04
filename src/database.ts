import { readdir, readFile } from "fs/promises";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import { parse } from "toml";

// basic paths
const rootPath = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(rootPath, "data");

// shared by races and classes
import { Classification } from "./classification.js";

/**
 * Load races and shit.
 */
const racesPath = join(dataPath, "races");
export const races: Classification[] = [];
async function loadRaces() {
	const files = await readdir(racesPath);
	for (let file of files) {
		const racePath = join(racesPath, file);
		if (extname(racePath) !== ".toml") continue;
		const data = await readFile(racePath, "utf8");
		const json: any = parse(data);
		const race = Classification.fromJSON(json);
		if (race) {
			races.push(race);
		}
	}
}

/**
 * Load classes and shit.
 */
const classesPath = join(dataPath, "classes");
export const classes: Classification[] = [];
async function loadClasses() {
	const files = await readdir(classesPath);
	for (let file of files) {
		const classPath = join(classesPath, file);
		if (extname(classPath) !== ".toml") continue;
		const data = await readFile(classPath, "utf8");
		const json = parse(data);
		const _class = Classification.fromJSON(json);
		if (_class) {
			classes.push(_class);
		}
	}
}

/**
 * Load calendar and shit.
 */
import { Calendar, Month } from "./calendar.js";
const calendarPath = join(dataPath, "calendar.toml");
export let calendar: Calendar;
async function loadCalendar() {
	const data = await readFile(calendarPath, "utf8");
	const json = parse(data);
	calendar = Calendar.fromJSON(json);
}

/**
 * Front facing access to database loading.
 * @param done Callback to run on successful database load.
 */
export async function load(done: (ms: number) => void) {
	const start = Date.now();
	await loadRaces();
	await loadClasses();
	await loadCalendar();
	const end = Date.now();
	done(end - start);
}
