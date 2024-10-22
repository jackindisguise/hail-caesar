import { logger } from "./winston.js";
import { t } from "./i18n.js";
import { load as loadCalendar, calendar } from "./database/calendar.js";
import { load as loadClasses, classes } from "./database/classes.js";
import { load as loadClock, clock } from "./database/clock.js";
import { load as loadCommands, commands, command } from "./database/command.js";
import { load as loadRaces, races } from "./database/races.js";
import { load as loadWorld, world } from "./database/world.js";

// exports for later use
export { calendar, classes, clock, commands, command, races, world };

/**
 * Should create a load handler to automate the load order.
 */
const loadOrder = [
	// world always gets loaded first
	loadWorld,

	// calendar always before clock
	loadCalendar,
	loadClock,

	// no requirements :)
	loadRaces,
	loadClasses,
	loadCommands,
];

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
	for (let loader of loadOrder) await loader();
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
