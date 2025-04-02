import { readFile } from "fs/promises";
import { Package } from "../package.js";
import { parse } from "smol-toml";
import { string } from "mud-ext";

export type HelpEntry = {
	keywords: string;
	summary: string;
	see_also: string[];
	body: string;
};

export type HelpToml = {
	helpfile: HelpEntry[];
};

// exported stuff for this package to do stuff with
let helpfiles: HelpEntry[];

export function getHelpfile(keyword: string): HelpEntry | undefined {
	if (!helpfiles) throw new Error("Helpfiles not loaded.");

	// Search through all helpfiles' keywords
	for (const entry of helpfiles) {
		if (string.matchKeywords(keyword, entry.keywords)) {
			return entry;
		}
	}

	return undefined;
}

export function getAllHelpfiles(): HelpToml {
	if (!helpfiles) throw new Error("Helpfiles not loaded.");
	return { helpfile: helpfiles };
}

// public pkg
const helpPath = "./data/help.toml";
export const pkg: Package = {
	name: "help",
	loader: async () => {
		await readFile(helpPath, "utf8").then((data) => {
			const parsed = parse(data) as HelpToml;
			helpfiles = parsed.helpfile;
		});
	},
};
