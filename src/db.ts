import { logger } from "./winston.js";
import { t } from "./i18n.js";
import { load as loadConfig, config } from "./database/config.js";
import { load as loadCalendar, calendar } from "./database/calendar.js";
import { load as loadClasses, classes } from "./database/classes.js";
import { load as loadClock, clock } from "./database/clock.js";
import { load as loadCommands, commands, command } from "./database/command.js";
import { load as loadRaces, races } from "./database/races.js";

// exports for later use
export { calendar, classes, clock, commands, command, races, config };

/**
 * Describes the loaders fed into the loading system.
 */
export type Loader = () => Promise<void>;

/**
 * Set of all of the loaders.
 */
const loaders: Loader[] = [
	loadConfig,
	loadCalendar,
	loadClock,
	loadRaces,
	loadClasses,
	loadCommands,
];

/**
 * Describe required loaders for other loaders.
 */
const requirements: Map<Loader, Loader[]> = new Map<Loader, Loader[]>();
requirements.set(loadCalendar, [loadConfig]);
requirements.set(loadClock, [loadConfig]);

/**
 * Handles the actual loading.
 */
const loaded: Loader[] = []; // tracks loaders that have completed a deep load
const loading: Loader[] = []; // tracks loaders that are being deep loaded

/**
 * Executes a loader while ensuring required loaders are loaded first load load load.
 * @param loader The loader to loadify.
 */
async function deepLoad(loader: Loader) {
	if (loading.includes(loader))
		throw new Error(`loader recursive dependency ${loader} < {{${loading}}}`);
	if (loaded.includes(loader)) return;
	loading.push(loader);
	const required = requirements.get(loader);
	if (required) for (let requiredLoader of required) deepLoad(requiredLoader);
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
