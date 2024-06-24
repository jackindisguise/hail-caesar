import { Character } from "../character.js";
import { Command } from "../command.js";
//import { _ } from "../i18n.js";
class Bell extends Command {
	protected rule = /^bell\s*$/;
	run(character: Character, comment: string) {
		//		character.send("\x1B[;H\x1B[2J");
		//		for (let i = 0; i < 60; i++) character.sendLine("");
		character.send("\x07");
	}
}

export { Bell as default };
