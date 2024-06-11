import { readdir, readFile } from "fs/promises";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import { parse } from "toml";

// package data
import { version as v } from "../package.json";
export const version = v;

// basic paths
const rootPath = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(rootPath, "data");

// shared by races and classes
import { Classification } from "./classification.js";

/**
 * Load races and shit.
 */
const RACES_PATH = join(dataPath, "races");
export const races: Classification[] = [];
async function loadRaces() {
	const files = await readdir(RACES_PATH);
	for (let file of files) {
		const racePath = join(RACES_PATH, file);
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
const CLASSES_PATH = join(dataPath, "classes");
export const classes: Classification[] = [];
async function loadClasses() {
	const files = await readdir(CLASSES_PATH);
	for (let file of files) {
		const classPath = join(CLASSES_PATH, file);
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
const CALENDAR_PATH = join(dataPath, "calendar.toml");
export let calendar: Calendar;
async function loadCalendar() {
	const data = await readFile(CALENDAR_PATH, "utf8");
	const json = parse(data);
	calendar = Calendar.fromJSON(json);
}

/**
 * Load world data and shit.
 */
import { World } from "./world.js";
const WORLD_PATH = join(dataPath, "world.toml");
export let world: World;
async function loadWorld() {
	const data = await readFile(WORLD_PATH, "utf8");
	const json = parse(data);
	world = World.fromJSON(json);
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
	await loadWorld();
	const end = Date.now();
	done(end - start);
}
