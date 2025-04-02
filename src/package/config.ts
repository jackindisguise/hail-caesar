import { readFile } from "fs/promises";
import { Package } from "../package.js";
import { parse } from "smol-toml";

export type ConfigToml = {
	game: {
		name: string;
	};
	server: {
		port: number;
	};
};

// exported stuff for this package to do stuff with
let config: ConfigToml;

export function getConfig() {
	if (!config) throw new Error("Configuration not loaded.");

	return config;
}

// public pkg
const configPath = "./data/config.toml";
export const pkg: Package = {
	name: "config",
	loader: async () => {
		await readFile(configPath, "utf8").then((data) => {
			config = parse(data) as ConfigToml;
		});
	},
};
