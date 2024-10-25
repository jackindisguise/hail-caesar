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
 * Template for config file.
 */
export interface Config {
	world: WorldConfig;
	server: ServerConfig;
}

/**
 * World configuration.
 */
export interface WorldConfig {
	name: string;
}

/**
 * Server configuration.
 */
export interface ServerConfig {
	port: number;
}

/**
 * Default configuration settings.
 */
export const DefaultConfig: Config = {
	world: {
		name: "Hail Caesar",
	},

	server: {
		port: 23,
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

function validateConfig(data: any): Config {
	const config: Config = JSON.parse(JSON.stringify(DefaultConfig));
	if (typeof data !== "object")
		throw new TypeError("given non-object for validation");
	if ("world" in data) {
		if (typeof data.world !== "object") mobf("data.world", data.world);
		if ("name" in data.world)
			if (typeof data.world.name !== "string")
				mobf("data.world.name", data.world.name);
			else config.world.name = data.world.name;
	}
	if ("server" in data) {
		if (typeof data.server !== "object") mobf("data.server", data.server);
		if ("port" in data.server)
			if (typeof data.server.port !== "number")
				mobf("data.server.port", data.server.port);
			else config.server.port = data.server.port;
	}
	return config;
}

/**
 * Load config and shit.
 */
const CONFIG_PATH = join(DATA_PATH, "config.toml");
export let config: Config = JSON.parse(JSON.stringify(DefaultConfig));
/** shortcuts */
export let world: WorldConfig = config.world;
export let server: ServerConfig = config.server;
export async function load() {
	logger.debug(t("Loading config."));
	try {
		logger.debug(
			t("Loading '{{file}}'", {
				file: relative(DATA_PATH, CONFIG_PATH),
			})
		);
		const data = await readFile(CONFIG_PATH, "utf8");
		const json = parse(data);
		const validated: Config = validateConfig(json);
		setConfig(validated);
	} catch (e) {
		logger.debug(
			t("Failed to load file '{{file}}' (#{{err}})", {
				file: relative(DATA_PATH, CONFIG_PATH),
				err: e,
			})
		);
		logger.debug(t("Using default config settings."));
	}
}

function setConfig(_config: Config) {
	config = _config;
	world = config.world;
	server = config.server;
}
