import { createInterface } from "readline";
const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

export class Command {}

export function getInput(
	question: string,
	callback: (response: string) => void
) {
	rl.question(`${question} `, (response: string) => {
		callback(response);
		rl.close();
	});
}
