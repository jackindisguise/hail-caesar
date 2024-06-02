import { rm } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
for (let file of args) {
	const joined = join(dir, file);
	rm(joined, { recursive: true, force: true }, (err) => {
		console.log(`cleaned path '${file}'`);
	});
}
