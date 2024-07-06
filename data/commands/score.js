import { _ } from "../../build/i18n.js";
import { box, BOX_STYLES, PAD_SIDE } from "../../build/string.js";
import { ESCAPE_SIZER, Colorizer } from "../../build/color.js";
export const keyword = "score";
export const syntax = "score";
export const description = "Show your scoresheet.";
export const rule = /^(?:score|scor|sco|sc|s)$/;
function windowize(boxes, margin) {
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
export const script = (character, comment) => {
	const passwordBox = box(
		[character.password],
		37,
		"Password",
		BOX_STYLES.O,
		ESCAPE_SIZER,
		Colorizer.crimson
	);

	const passwordBox2 = box(
		[character.password],
		37,
		"Password",
		BOX_STYLES.O,
		ESCAPE_SIZER,
		Colorizer.crimson
	);
	const msg = box(
		[...windowize([passwordBox, passwordBox2], 2)],
		80,
		character.mob.name,
		{ ...BOX_STYLES.ROUNDED, vPadding: 1, hAlign: PAD_SIDE.CENTER },
		ESCAPE_SIZER,
		Colorizer.yellow
	);
	character.sendLine(msg.join("\r\n"));
};
