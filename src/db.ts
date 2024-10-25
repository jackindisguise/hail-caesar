import { logger } from "./winston.js";
import { t } from "i18next";
import { load as loadConfig, config } from "./database/config.js";
import { load as loadRuntime, runtime } from "./database/runtime.js";
import { load as loadCalendar, calendar } from "./database/calendar.js";
import { load as loadClasses, classes } from "./database/classes.js";
import { load as loadClock, clock } from "./database/clock.js";
import { load as loadCommands, commands, command } from "./database/command.js";
import { load as loadRaces, races } from "./database/races.js";

// exports for later use
export { config, runtime, calendar, classes, clock, commands, command, races };

/**
 * Describes the loaders fed into the loading system.
 */
export type Loader = () => Promise<void>;

/**
 * Describe loaders that have to be loaded before other loaders.
 */
const prerequisites: Map<Loader, Loader[]> = new Map<Loader, Loader[]>();
prerequisites.set(loadClock, [loadCalendar, loadRuntime]);

/**
 * Set of all of the loaders.
 */
const loaders: Loader[] = [
	loadConfig,
	loadRuntime,
	loadCalendar,
	loadClock,
	loadRaces,
	loadClasses,
	loadCommands,
];

// data for handling deep loads
const loaded: Loader[] = []; // tracks loaders that have completed a deep load
const loading: Loader[] = []; // tracks loaders that are being deep loaded

/**
 * Executes a loader while ensuring required loaders are loaded first loaded loader loding.
 * @param loader The loader to loadify.
 */
async function deepLoad(loader: Loader) {
	if (loading.includes(loader))
		throw new Error(
			`loader recursive dependency [${Array.from(
				loading,
				(loader) => loader.name
			)}]+${loader.name}`
		);
	if (loaded.includes(loader)) return;
	loading.push(loader);
	const preloaders = prerequisites.get(loader);
	if (preloaders) for (let preloader of preloaders) deepLoad(preloader);
	await loader();
	loading.pop();
	loaded.push(loader);
}

/**
 * Front facing access to database loading.
 */
export async function load() {
	logger.debug(
		t("Started loading database at {{time}}.", {
			time: new Date().toLocaleTimeString(),
		})
	);
	const start = Date.now();
	for (let loader of loaders) await deepLoad(loader);
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
}
