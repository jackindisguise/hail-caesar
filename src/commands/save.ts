import { Command } from "../command.js";
import json2toml from "json2toml";
export const COMMAND = new Command(
	/^(?:save|sav|sa|s)$/,
	"save",
	"save",
	"Save your character.",
	(character) => {
		const json = character.toJSON();
		console.log(json);
		const toml = json2toml(json);
		character.send(toml);
	}
);
