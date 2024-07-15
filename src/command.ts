import { Character } from "./character.js";
import { t } from "./i18n.js";
export class Command {
	rule: RegExp;
	keyword: string;
	syntax: string;
	description: string;
	script: (character: Character, ...args: string[]) => void;
	constructor(
		rule: RegExp,
		keyword: string,
		syntax: string,
		description: string,
		script: (character: Character, ...args: string[]) => void
	) {
		this.rule = rule;
		this.keyword = keyword;
		this.syntax = syntax;
		this.description = description;
		this.script = script;
	}
	test(input: string) {
		const result = this.rule.test(input);
		if (!result) return false;
		return true;
	}

	prep(character: Character, input: string) {
		const results = this.rule.exec(input);
		if (!results) this.script(character);
		else this.script(character, ...results.slice(1));
	}
}
