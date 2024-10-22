import { logger } from "../winston.js";
import { t } from "../i18n.js";
import { readFile } from "fs/promises";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";
import { parse } from "smol-toml";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_PATH = join(ROOT_PATH, "data");

/**
 * Load world data.
 */
import { World } from "../world.js";
const WORLD_PATH = join(DATA_PATH, "world.toml");
export let world: World;
export async function load() {
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
