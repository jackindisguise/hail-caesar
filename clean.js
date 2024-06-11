import { rm } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const blocked = ["src", ".git", "node_modules", "data"];
const args = process.argv.slice(2);
for (let file of args) {
	const joined = join(dir, file);
	const rel = relative(dir, joined);
	if (!rel) {
		console.log("ignoring attempt to delete root");
		continue;
	}

	if (rel.includes("..")) {
		console.log("ignoring attempt to delete parent");
		continue;
	}

	if (blocked.includes(rel)) {
		console.log(`ignoring blocked path '${rel}'`);
		continue;
	}

	rm(joined, { recursive: true, force: true }, (err) => {
		console.log(`cleaned path '${file}'`);
	});
}
