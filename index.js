import { default as json2toml } from "json2toml";
import { parse } from "toml";

const json = {
	name: "Josh",
	password: "akls;dlajksqwopjreqw",
	inventory: [
		{
			keywords: "excalibur sword legendary",
			display: "The Legendary Sword, Excalibur",
		},
	],
};

const toml = json2toml(json, { newlineAfterSection: true });
const parsed = parse(toml);
console.log(json);
console.log(toml);
console.log(parsed);
