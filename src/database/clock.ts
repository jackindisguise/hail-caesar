import { logger } from "../winston.js";
import { t } from "../i18n.js";
import { readFile } from "fs/promises";
import { join, dirname, extname, relative } from "path";
import { fileURLToPath } from "url";
import { parse } from "smol-toml";
import { calendar } from "./calendar.js";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_PATH = join(ROOT_PATH, "data");

/**
 * Load clock data.
 */
import { Clock } from "../clock.js";
const CLOCK_PATH = join(DATA_PATH, "clock.toml");
export let clock: Clock;
export async function load() {
	logger.debug(t("Loading clock."));
	logger.debug(
		t("Loading '{{file}}'", {
			file: relative(DATA_PATH, CLOCK_PATH),
		})
	);
	const data = await readFile(CLOCK_PATH, "utf8");
	const json = parse(data);
	clock = Clock.fromData(json);
	const runtime = clock.runtime; // clock.runtime can change with each access -- store value
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