import { Character } from "./character.js";
import { logger } from "./winston.js";
import { _ } from "./i18n.js";
export class Command {
	protected rule?: RegExp;
	test(input: string) {
		if (!this.rule) return false;
		const result = this.rule.test(input);
		if (!result) return false;
		return true;
	}

	prep(character: Character, input: string) {
		const results = this.rule?.exec(input);
		if (!results) this.run(character);
		else this.run(character, ...results.slice(1));
	}

	run(character: Character, ...args: string[]) {
		logger.debug(
			_("{{character}}: Running uninitialized command.", {
				character: character,
			})
		);
	}
}
