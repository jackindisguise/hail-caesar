import { Command } from "../command.js";
import { stringify, parse } from "smol-toml";
export const COMMAND = new Command(
	/^(?:save|sav|sa|s)$/,
	"save",
	"save",
	"Save your character.",
	(character) => {
		const data = character.toData();
		console.log(data);
		const toml = stringify(data);
		character.send(toml);
		console.log(toml);
	}
);
