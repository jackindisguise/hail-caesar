import { logger } from "../winston.js";
import { t } from "i18next";
import { readdir } from "fs/promises";
import { join, dirname, extname, relative } from "path";
import { fileURLToPath } from "url";
import { Character } from "../character.js";
import { autocomplete, box, BOX_STYLE, PAD_SIDE } from "../string.js";
import { ESCAPE_SIZER, Colorizer } from "../color.js";
import { EOL } from "../telnet.js";

// basic paths
const ROOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_PATH = join(ROOT_PATH, "data");

// command type
import { Command } from "../command.js";

/**
 * Load commands and shit.
 */
import { table } from "table";
const COMMANDS_PATH = join(ROOT_PATH, "build", "commands");
export const commands: Command[] = [];
export async function load() {
	logger.debug(t("Loading commands."));
	const files = await readdir(COMMANDS_PATH);
	const info: string[] = [];
	for (let file of files) {
		const COMMAND_PATH = join(COMMANDS_PATH, file);
		if (extname(COMMAND_PATH) !== ".js") continue;
		let data: any = await import(`file://${COMMAND_PATH}`);
		const command: Command = data.COMMAND;
		commands.push(command);
		info.push(command.syntax);
	}

	const original = [];
	while (info.length)
		original.push([info.shift() || "", info.shift() || "", info.shift() || ""]);
	const lines = table(original, {
		columns: [{ width: 16 }, { width: 16 }, { width: 17 }],
		drawVerticalLine: (index, cols) => index == 0 || index == cols,
		drawHorizontalLine: (index, rows) =>
			(index >= 0 && index <= 1) || index === rows,
		header: {
			alignment: "center",
			content: "Commands",
		},
	}).split("\n");
	lines.pop();
	for (let line of lines) logger.debug(line);
}

export function command(character: Character, input: string) {
	for (let command of commands) {
		const safe = input.trim();
		const test = command.test(safe);
		if (!test) {
			const rule = /^(\S+)\s*/;
			const results = safe.match(rule);
			if (!results) continue;
			const word = results[1];
			if (!autocomplete(word, command.keyword)) continue;
			const msg = box(
				[command.description],
				80,
				`Syntax: ${command.syntax}`,
				{
					...BOX_STYLE.PLAIN,
					titleHAlign: PAD_SIDE.CENTER,
					vPadding: 1,
					hAlign: PAD_SIDE.CENTER,
					borderColor: Colorizer.yellow,
					titleColor: Colorizer.white,
				},
				ESCAPE_SIZER
			);
			character.sendLine(msg.join(EOL));
			return true;
		}
		const args = safe.match(command.rule);
		if (args) command.script(character, ...args.slice(1));
		else command.script(character);
		return true;
	}

	return false;
}
