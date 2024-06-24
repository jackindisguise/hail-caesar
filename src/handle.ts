import { Command } from "./command.js";
import { Character } from "./character.js";
import { _ } from "./i18n.js";
import { logger } from "./winston.js";
import { readdir } from "fs/promises";
import { join, dirname, extname, relative, parse as pparse } from "path";
import { fileURLToPath } from "url";
import { parse } from "toml";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "..");

// load commands
export const commands: Command[] = [];
export const COMMANDS_PATH = join(ROOT_PATH, "src", "commands");
export async function load(callback?: () => void) {
	const files = await readdir(COMMANDS_PATH);
	for (let file of files) {
		const commandPath = `./commands/${pparse(file).name}.js`;
		const imported = await import(commandPath);
		let command = new imported.default();
		commands.push(command);
	}
}

export function command(character: Character, input: string): boolean {
	for (let command of commands) {
		const result = command.test(input);
		if (!command.test(input)) continue;
		command.prep(character, input);
		return true;
	}

	return false;
}
