import { Command } from "../command.js";
export const COMMAND = new Command(
	/^(?:clear|clea|cle|cl|c)$/,
	"clear",
	"clear",
	"Clear the screen.",
	(character) => {
		for (let i = 0; i < 60; i++) character.sendLine("");
	}
);
