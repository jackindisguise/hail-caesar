import { _ } from "../../build/i18n.js";
import { commands } from "../../build/database.js";

export const keyword = "commands";
export const syntax = "commands";
export const description = "Shows all of the commands.";
export const rule = /^commands\s*$/;
export const script = (character) => {
	for (let command of commands) character.sendLine(command.toString());
};
