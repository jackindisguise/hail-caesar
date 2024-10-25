import { logger } from "../winston.js";
import { t } from "i18next";
import { readFile, writeFile } from "fs/promises";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";
import { parse, stringify } from "smol-toml";
import { clock as realClock } from "./clock.js";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_PATH = join(ROOT_PATH, "data");

/**
 * Template for runtime file.
 */
export interface Runtime {
	clock: ClockConfig;
}

/**
 * Clock configuration.
 */
export interface ClockConfig {
	time: number;
}

/**
 * Default configuration settings.
 */
export const DefaultRuntime: Runtime = {
	clock: {
		time: 0,
	},
};

function mobf(field: string, value: any) {
	throw new TypeError(
		t(`missing/bad field for {{field}}: '{{value}}'`, {
			field: field,
			value: value,
		})
	);
}

function validateRuntime(data: any): Runtime {
	const runtime: Runtime = JSON.parse(JSON.stringify(DefaultRuntime));
	if (typeof data !== "object")
		throw new TypeError("given non-object for validation");
	if ("clock" in data) {
		if (typeof data.clock !== "object")
			throw new TypeError("missing/bad field for 'clock'");
		if ("time" in data.clock)
			if (typeof data.clock.time !== "number")
				mobf("data.clock.time", data.clock.time);
			else runtime.clock.time = data.clock.time;
	}
	return runtime;
}

/**
 * Load runtime and shit.
 */
const RUNTIME_PATH = join(DATA_PATH, "runtime.toml");
export let runtime: Runtime = JSON.parse(JSON.stringify(DefaultRuntime));
export let clock: ClockConfig = runtime.clock;
export async function load() {
	logger.debug(t("Loading runtime."));
	try {
		logger.debug(
			t("Loading '{{file}}'", {
				file: relative(ROOT_PATH, RUNTIME_PATH),
			})
		);
		const data = await readFile(RUNTIME_PATH, "utf8");
		const json = parse(data);
		const validated: Runtime = validateRuntime(json);
		setRuntime(validated);
	} catch (e) {
		logger.debug(
			t("Failed to load file '{{file}}' (#{{err}})", {
				file: relative(DATA_PATH, RUNTIME_PATH),
				err: e,
			})
		);
		logger.debug(t("Using default runtime settings."));
	}
}

/**
 * TODO: This seems kind of messy to me, but I don't know what to do about it.
 * The config file is referenced by the clock database loader to determine the
 * starting runtime of the clock.
 */
export async function save() {
	runtime.clock.time = realClock.time;
	const toml = stringify(runtime);
	try {
		await writeFile(RUNTIME_PATH, toml, "utf8");
	} catch (e) {
		logger.debug(
			t("Failed to save file '{{file}}' (#{{err}})", {
				file: relative(DATA_PATH, RUNTIME_PATH),
				err: e,
			})
		);
	}
}

function setRuntime(_runtime: Runtime) {
	runtime = _runtime;
	clock = runtime.clock;
}
