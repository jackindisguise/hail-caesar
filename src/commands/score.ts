import { t } from "../i18n.js";
import { EOL } from "../telnet.js";
import { box, BOX_STYLE, PAD_SIDE } from "../string.js";
import { ESCAPE_SIZER, Colorizer } from "../color.js";
import { Command } from "../command.js";

function windowize(boxes: string[][], margin: number) {
	const final = [];
	let maxHeight = 0;
	for (let box of boxes) maxHeight = Math.max(maxHeight, box.length);
	for (let i = 0; i < maxHeight; i++) {
		let line = [];
		for (let box of boxes) if (i < box.length) line.push(box[i]);
		final.push(line.join(" ".repeat(margin)));
	}
	return final;
}

export const COMMAND = new Command(
	/^(?:score|scor|sco|sc|s)$/,
	"score",
	"score",
	"Show your scoresheet.",
	(character, comment) => {
		const passwordBox = box(
			[character.password || ""],
			37,
			"Password",
			{
				...BOX_STYLE.O,
				borderColor: Colorizer.crimson,
				titleHAlign: PAD_SIDE.CENTER,
				titleColor: Colorizer.yellow,
			},
			ESCAPE_SIZER
		);

		const passwordBox2 = box(
			[character.password || ""],
			37,
			"Password",
			{
				...BOX_STYLE.O,
				borderColor: Colorizer.crimson,
				titleHAlign: PAD_SIDE.CENTER,
				titleColor: Colorizer.yellow,
			},
			ESCAPE_SIZER
		);
		const msg = box(
			[...windowize([passwordBox, passwordBox2], 2)],
			80,
			character.mob?.name,
			{
				...BOX_STYLE.HASHED,
				titleHAlign: PAD_SIDE.CENTER,
				borderColor: Colorizer.yellow,
				titleColor: Colorizer.white,
			},
			ESCAPE_SIZER
		);
		character.sendLine(msg.join(EOL));
	}
);
