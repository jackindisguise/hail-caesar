import { Command } from "../command.js";
export const COMMAND = new Command(
	/^(?:bell|bel|be|b)$/,
	"bell",
	"bell",
	"Ring a ball.",
	(character) => character.send("\x07")
);
