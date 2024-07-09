export enum PAD_SIDE {
	/** Pads to the left. */
	LEFT = 1,

	/** Pads to the right. */
	RIGHT = 2,

	/** Pads to the left and right. */
	CENTER = 3,
}

/**
 * Describes the borders of box titles.
 */
export interface BoxStyleTitleBorder {
	/** The left side of the title. */
	left?: string;

	/** The right side of the title. */
	right?: string;
}

/**
 * Describes the elements of horizontal edges of boxes.
 */
export interface BoxStyleHorizontalEdge {
	/** The left corner of the box edge. */
	left?: string;

	/** The right corner of the box edge. */
	right?: string;

	/** The middle of the box edge. */
	middle?: string;

	/** The corners of the box edge. */
	corner?: string;
}

/**
 * Describes all of the elements of boxes.
 */
export interface BoxStyle {
	/** The horizontal edges of the box. */
	horizontal?: string;

	/** The vertical edges of the box. */
	vertical?: string;

	/** The left edge of the box. */
	left?: string;

	/** The right edge of the box. */
	right?: string;

	/** Horizontal padding of the internals of the box. */
	hPadding?: number;

	/** Vertical padding of the internals of the box. */
	vPadding?: number;

	/** The corners of the box. */
	corner?: string;

	/** The borders of the title of the box. */
	titleBorder?: BoxStyleTitleBorder;

	/** The top edge of the box. */
	top?: BoxStyleHorizontalEdge;

	/** The bottom edge of the box. */
	bottom?: BoxStyleHorizontalEdge;

	/** The horizontal alignment of the internals of the box. */
	hAlign?: PAD_SIDE;

	/** The horizontal alignment of the title of the box. */
	titleHAlign?: PAD_SIDE;

	/** Colorizes the title text of a box. */
	titleColor?: StringTransformer;

	/** Colorizes the body text of a box. */
	bodyColor?: StringTransformer;

	/** Colorizes the border of a box. */
	borderColor?: StringTransformer;
}

/**
 * Some generic boxes I invented due to my ingenuity.
 */
export const BOX_STYLE: {
	PLAIN: BoxStyle;
	ROUNDED: BoxStyle;
	O: BoxStyle;
	HASHED: BoxStyle;
	STARRED: BoxStyle;
} = {
	/** A plain box. */
	PLAIN: {
		horizontal: "-",
		vertical: "|",
		corner: "+",
	},

	/** A rounded box. */
	ROUNDED: {
		horizontal: "-",
		vertical: "|",
		top: {
			corner: ".",
		},
		bottom: {
			corner: "'",
		},
	},

	/** A box made of Os */
	O: {
		horizontal: "O",
		vertical: "O",
	},

	HASHED: {
		horizontal: "#",
		vertical: "#",
	},

	STARRED: {
		vertical: "*",
		horizontal: "*",
	},
};

/** Describes methods of sizing strings with different types of unrendered data. */
export interface Sizer {
	/** The character used to indicate the beginning of unrendered data. */
	open?: string;

	/** The character used to indicate the end of unrendered data. */
	close?: string;

	/** A function that returns only the rendered size of the given string. */
	size: StringSizer;
}

/** Describes how to size strings with terminal colors. */
export const TERM_SIZER: Sizer = {
	open: "\u001b",
	close: "m",
	size: (str: string) => {
		const rule = /(\u001b.*?m)/g;
		const result = str.match(rule);
		if (!result) return str.length;
		return str.length - result.reduce((a, b) => a + b.length, 0);
	},
};

/** Describes how to size strings with HTML elements colors. */
/*export const HTML_SIZER: Sizer = {
	open: "<",
	close: ">",
	size: (str: string) => {
		const rule = /(<.*?>)/g;
		const result = str.match(rule);
		if (!result) return str.length;
		return str.length - result.reduce((a, b) => a + b.length, 0);
	},
};*/

/** A default sizer that respects no unrendered characters. */
export const DEFAULT_SIZER: Sizer = {
	size: (str: string) => str.length,
};

/** A function that takes a string and produces a string. */
export type StringTransformer = (str: string) => string;

/** A function that takes a string and produces a number. */
export type StringSizer = (str: string) => number;

/**
 * Options for pad functions.
 */
export interface PadOptions {
	/** The string to pad. */
	string: string;

	/** The desired width of the string. */
	width: number;

	/** The string to use as a padder. */
	padder?: string;

	/** A custom function for determing the size of the provided string. */
	sizer?: Sizer;

	/** A custom function for adding color codes (or any non-rendered element) to the padding. */
	color?: StringTransformer;
}

/**
 * Options for pad shortcut function.
 */
export interface PadWithSideOptions extends PadOptions {
	/** The side to add padding. */
	side: PAD_SIDE;
}

/**
 * Convert a number to its ordinal form.
 * @param n The number to ordinalify.
 * @returns The ordinal-form of the given number.
 */
export function toOrdinal(n: number): string {
	if (n > 3 && n < 21) return `${n}th`;
	switch (n % 10) {
		case 1:
			return `${n}st`;
		case 2:
			return `${n}nd`;
		case 3:
			return `${n}rd`;
		default:
			return `${n}th`;
	}
}

/**
 * Pad a string to the given size.
 * @param options {PadWithSideOptions} The padding options.
 * @returns {string} The padded string.
 */
export function pad(options: PadWithSideOptions): string;

/**
 * Pad a string to the given size.
 * @param string The string to pad.
 * @param width The desired width of the string.
 * @param padder The string to use as a padder.
 * @param sizer A custom function for determining the size of the provided string.
 * @param color A custom function for adding unrendered color codes to the padding.
 */
export function pad(
	string: string,
	width: number,
	side: PAD_SIDE,
	padder?: string,
	sizer?: Sizer,
	color?: StringTransformer
): string;
export function pad(
	options: PadWithSideOptions | string,
	width?: number,
	side?: PAD_SIDE,
	padder?: string,
	sizer?: Sizer,
	color?: StringTransformer
): string {
	if (typeof options === "string") {
		return padWithOptions({
			string: options,
			width: width as number,
			side: side as PAD_SIDE,
			padder: padder,
			sizer: sizer || DEFAULT_SIZER,
			color: color || undefined,
		});
	}
	return padWithOptions(options);
}

/**
 * Handles pad calls uniformly with PadOptions as God intended.
 */
function padWithOptions(options: PadWithSideOptions): string {
	if (options.side === PAD_SIDE.LEFT) return padLeft(options);
	if (options.side === PAD_SIDE.CENTER) return padCenter(options);
	return padRight(options); // defaults to padding the right side
}

/**
 * Pad a string to the given size on the left.
 * @param options The padding options.
 * @returns The padded string.
 */
export function padLeft(options: PadOptions): string;
/**
 * Pad a string to the given width on the left.
 * @param string The string to pad.
 * @param width The target width of the padded string.
 * @param padder The padder to pad the string with.
 * @param sizer Handler for unrendered characters.
 * @returns The padded string.
 */
export function padLeft(
	string: string,
	width: number,
	padder?: string,
	sizer?: Sizer,
	color?: StringTransformer
): string;
export function padLeft(
	options: PadOptions | string,
	width?: number,
	padder?: string,
	sizer?: Sizer,
	color?: StringTransformer
): string {
	if (typeof options === "string")
		return padLeftWithOptions({
			string: options,
			width: width as number,
			padder: padder,
			sizer: sizer || DEFAULT_SIZER,
			color: color || undefined,
		});
	return padLeftWithOptions(options);
}

function padLeftWithOptions(options: PadOptions): string {
	const padder = options.padder || " "; // default to space
	const sizer = options.sizer || DEFAULT_SIZER; // default to string length
	const csize = sizer.size(options.string);
	const psize = options.width - csize;
	if (psize < 1) return options.string;
	let pad = padder.repeat(Math.ceil(psize / sizer.size(padder)));
	if (sizer.size(pad) > psize) pad = pad.slice(0, psize);
	if (options.color) pad = options.color(pad);
	return `${pad}${options.string}`;
}

/**
 * Pad a string to the given size on the right.
 * @param options The padding options.
 * @returns The padded string.
 */
export function padRight(options: PadOptions): string;
/**
 * Pad a string to the given width on the right.
 * @param string The string to pad.
 * @param width The target width of the padded string.
 * @param padder The padder to pad the string with.
 * @param sizer Handler for unrendered characters.
 * @returns The padded string.
 */
export function padRight(
	string: string,
	width: number,
	padder?: string,
	sizer?: Sizer,
	color?: StringTransformer
): string;
export function padRight(
	options: PadOptions | string,
	width?: number,
	padder?: string,
	sizer?: Sizer,
	color?: StringTransformer
): string {
	if (typeof options === "string")
		return padRightWithOptions({
			string: options,
			width: width as number,
			padder: padder,
			sizer: sizer || DEFAULT_SIZER,
			color: color || undefined,
		});
	return padRightWithOptions(options);
}

function padRightWithOptions(options: PadOptions) {
	const padder = options.padder || " "; // default to space
	const sizer = options.sizer || DEFAULT_SIZER; // default to string length
	const csize = sizer.size(options.string);
	const psize = options.width - csize;
	if (psize < 1) return options.string;
	let pad = padder.repeat(Math.ceil(psize / sizer.size(padder)));
	if (sizer.size(pad) > psize) pad = pad.slice(0, psize);
	if (options.color) pad = options.color(pad);
	return `${options.string}${pad}`;
}

/**
 * Pad a string to the given size on the left and right.
 * @param options The padding options.
 * @returns The padded string.
 */
export function padCenter(options: PadOptions): string;
/**
 * Pad a string to the given width on the right.
 * @param string The string to pad.
 * @param width The target width of the padded string.
 * @param padder The padder to pad the string with.
 * @param sizer Handler for unrendered characters.
 * @returns The padded string.
 */
export function padCenter(
	string: string,
	width: number,
	padder?: string,
	sizer?: Sizer,
	color?: StringTransformer
): string;
export function padCenter(
	options: PadOptions | string,
	width?: number,
	padder?: string,
	sizer?: Sizer,
	color?: StringTransformer
): string {
	if (typeof options === "string")
		return padCenterWithOptions({
			string: options,
			width: width as number,
			padder: padder,
			sizer: sizer || DEFAULT_SIZER,
			color: color || undefined,
		});
	return padCenterWithOptions(options);
}

function padCenterWithOptions(options: PadOptions) {
	const padder = options.padder || " "; // default to space
	const sizer = options.sizer || DEFAULT_SIZER; // default to string length
	const csize = sizer.size(options.string);
	const psize = options.width - csize;
	if (psize < 1) return options.string;
	const tpad = padder.repeat(Math.ceil(options.width / padder.length));
	const lsize = psize % 2 ? Math.floor(psize / 2) : psize / 2;
	const rsize = psize % 2 ? Math.floor(psize / 2) + 1 : psize / 2;
	let lpad = tpad.slice(0, lsize); // this is why you should avoid using colors in padders and stick to color option
	let rpad = tpad.slice(lsize + csize, lsize + csize + rsize);
	if (options.color) {
		lpad = lpad ? options.color(lpad) : "";
		rpad = options.color(rpad);
	}
	return `${lpad}${options.string}${rpad}`;
}

/** Options for wrapping a string. */
export interface WrapOptions {
	/** The string to be wrapped. */
	string: string;

	/** The desired width of each line. */
	width: number;

	/** Describe how to respect unrendered characters. */
	sizer?: Sizer;
}

/**
 * Wraps a string to a given size.
 * @param string The string to be wrapped.
 * @param width The desired width of each line.
 * @param sizer Sizer for respecting unrendered characters.
 */
export function wrap(string: string, width: number, sizer?: Sizer): string[];

/**
 * Wraps a string to a given size.
 * @param options The options for this wrap.
 * @returns {string[]} The lines of the wrapped string in an array.
 */
export function wrap(options: WrapOptions): string[];
export function wrap(
	options: WrapOptions | string,
	width?: number,
	sizer?: Sizer
): string[] {
	if (typeof options === "string")
		return wrapWithOptions({
			string: options,
			width: width as number,
			sizer: sizer || DEFAULT_SIZER,
		});
	return wrapWithOptions(options);
}

function wrapWithOptions(options: WrapOptions): string[] {
	const sizer = options.sizer || DEFAULT_SIZER;
	const lines: string[] = [];
	let last = 0;
	let cursor = options.width;
	while (cursor < options.string.length) {
		// accomodate non-rendering elements by adding extra width to this line
		// (expand cursor)
		let unrendered = 0;
		if (sizer.open) {
			for (let i = last; i <= cursor; i++) {
				if (options.string[i] === sizer.open) {
					// 2 escape characters in a row escape themselves and renders the escape code
					if (options.string[i + 1] === sizer.open) {
						cursor += 1;
						unrendered += 1;
						i += 1;
						continue;
					}
					// if there's no close character, it consumes the next character implicitly
					// this should have some kind of specific implementation
					if (!sizer.close) {
						cursor += 2;
						unrendered += 2;
						i += 1;
						continue;
					}
					while (true) {
						cursor++;
						unrendered++;
						// this is not approriate, sadly.
						if (options.string[i] === sizer.close) break; // account for closer and then end
						i++; // keep searching
					}
				}
			}
		}

		// calculate the breakpoint of the line
		let breakpoint = cursor;
		if (breakpoint >= options.string.length) break;

		const mid = (cursor + unrendered + last) / 2; // search halfway between last point and current point for whitespace
		for (let i = cursor; i >= mid; i--) {
			// search for nearby whitespace
			if ([" ", "\r", "\n", "\t"].includes(options.string[i])) {
				breakpoint = i;
				break;
			}
		}

		// if the breakpoint is whitespace, skip over it
		if ([" ", "\r", "\n", "\t"].includes(options.string[breakpoint])) {
			lines.push(options.string.slice(last, breakpoint));
			last = breakpoint + 1;

			// if it's not whitespace, add a hypen to break the string and start the next line at this point
		} else {
			lines.push(options.string.slice(last, breakpoint - 1) + "-");
			last = breakpoint - 1;
		}
		cursor = Math.min(last + options.width, options.string.length);
	}

	if (last < cursor) lines.push(options.string.slice(last));
	return lines;
}

/**
 * Describes the details of the box.
 */
export interface BoxOptions {
	/** The lines rendered in the box. */
	input: string[];

	/** The external width of the box. */
	width: number;

	/** The title of the box. */
	title?: string;

	/** The box style. */
	style?: BoxStyle;

	/** The sizer for any unrendered elements. */
	sizer?: Sizer;
}

/**
 * Generates a contained box of text.
 * @param options The options for the box.
 * @returns {string[]} The lines of the box in an array.
 */
export function box(options: BoxOptions): string[];
/**
 * Generates a contained box of text.
 * @param input An array of lines of text.
 * @param width The external width of the box.
 * @param title The title of the box.
 * @param style The box style.
 * @param sizer A sizer for handling unrendered characters in the input.
 */
export function box(
	input: string[],
	width: number,
	title?: string,
	style?: BoxStyle,
	sizer?: Sizer
): string[];
export function box(
	options: BoxOptions | string[],
	width?: number,
	title?: string,
	style?: BoxStyle,
	sizer?: Sizer
): string[] {
	if (Array.isArray(options))
		return boxWithOptions({
			input: options,
			width: width as number,
			title: title || undefined,
			style: style || undefined,
			sizer: sizer || undefined,
		});
	return boxWithOptions(options as BoxOptions);
}

function boxWithOptions(options: BoxOptions): string[] {
	const sizer = options.sizer || DEFAULT_SIZER; // default to string length
	const borderColor = options.style?.borderColor || ((str: string) => str);
	const bodyColor = options.style?.bodyColor || ((str: string) => str);
	const titleColor = options.style?.titleColor || ((str: string) => str);
	const lines: string[] = [];

	// consolidate top elements
	let topmiddle: string =
		options.style?.top?.middle || options.style?.horizontal || "";
	const topleft: string =
		options.style?.top?.left ||
		options.style?.top?.corner ||
		options.style?.corner ||
		"";
	const topright: string =
		options.style?.top?.right ||
		options.style?.top?.corner ||
		options.style?.corner ||
		"";

	// do we have top elements?
	if (topleft || topright || topmiddle) {
		if ((topleft || topright) && !topmiddle) topmiddle = " ";
		const ruleWidth = options.width - topleft.length - topright.length; // account for corners
		const rule = topmiddle.repeat(Math.ceil(ruleWidth / topmiddle.length)); // repeats the horizontal padder enough times to fit rule width
		const safeRule = rule.slice(0, ruleWidth); // only use what we need for the full size;

		// inject title into rule
		if (options.title) {
			// titles are offset from the edge character by 1 -- titles don't touch the edge by default
			// might make this an option later
			const offset = 1;
			let formattedTitle;

			// add padding to title -- might make this an option later
			if (options.style?.titleBorder) {
				const tLeftPadding = options.style.titleBorder?.left ? " " : "";
				const tRightPadding = options.style.titleBorder?.right ? " " : "";
				formattedTitle = `${
					options.style.titleBorder?.left
						? borderColor(options.style.titleBorder.left)
						: ""
				}${tLeftPadding}${titleColor(options.title)}${tRightPadding}${
					options.style.titleBorder?.right
						? borderColor(options.style.titleBorder.right)
						: ""
				}`;
			} else formattedTitle = ` ${titleColor(options.title)} `;

			// respect vertical alignment for titles
			//const titleWidth = formattedTitle.length;
			const safeTitleWidth = sizer.size(formattedTitle);
			let start = 0 + offset;
			if (options.style?.titleHAlign === PAD_SIDE.LEFT)
				start = ruleWidth - safeTitleWidth - offset;
			else if (options.style?.titleHAlign === PAD_SIDE.CENTER)
				start = Math.floor((ruleWidth - safeTitleWidth) / 2);
			const tLeft =
				(topleft || "") + (start > 0 ? safeRule.slice(0, start) : "");
			const tRight =
				(start + safeTitleWidth < ruleWidth
					? safeRule.slice(start + safeTitleWidth, ruleWidth)
					: "") + (topright || "");
			lines.push(
				`${borderColor(tLeft)}${formattedTitle}${borderColor(tRight)}`
			);

			// no title -- just a basic rule
		} else
			lines.push(borderColor(`${topleft || ""}${safeRule}${topright || ""}`));

		// has a title but no box visual elements
	} else if (options.title) {
		lines.push(
			pad({
				string: options.title,
				width: options.width,
				side: options.style?.titleHAlign || PAD_SIDE.RIGHT,
				sizer: sizer,
			})
		);
	}

	const addLine = (line: string) => {
		if (
			options.style?.vertical ||
			options.style?.left ||
			options.style?.right
		) {
			const leftVert = options.style?.left || options.style?.vertical || "";
			const leftHPadding = leftVert ? options.style?.hPadding || 1 : 0;
			const left = borderColor(leftVert) + " ".repeat(leftHPadding);
			const rightVert = options.style?.right || options.style?.vertical || "";
			const rightHPadding = rightVert ? options.style?.hPadding || 1 : 0;
			const right = " ".repeat(rightHPadding) + borderColor(rightVert);
			const wrapped: string[] = wrap({
				string: line,
				width: options.width - sizer.size(left) - sizer.size(right),
				sizer: sizer,
			});
			for (const _line of wrapped)
				lines.push(
					`${left}${pad({
						string: bodyColor(_line),
						width: options.width - sizer.size(left) - sizer.size(right),
						side: options.style?.hAlign || PAD_SIDE.RIGHT,
						sizer: sizer,
					})}${right}`
				);
		} else {
			const left = " ".repeat(options.style?.hPadding || 0);
			const right = left;
			const wrapped: string[] = wrap({
				string: line,
				width: options.width - sizer.size(left) - sizer.size(right),
				sizer: sizer,
			});
			for (const _line of wrapped)
				lines.push(
					`${left}${pad({
						string: bodyColor(_line),
						width: options.width - left.length - right.length,
						side: options.style?.hAlign || PAD_SIDE.RIGHT,
						sizer: sizer,
					})}${right}`
				);
		}
	};

	// construct content lines
	if (options.style?.vPadding)
		for (let i = 0; i < options.style.vPadding; i++) addLine("");
	for (let i = 0; i < options.input.length; i++) {
		const line = options.input[i];
		//if (i > 0) addLine("");
		addLine(line);
	}
	if (options.style?.vPadding)
		for (let i = 0; i < options.style.vPadding; i++) addLine("");

	// consolidate bottom elements
	let bottommiddle: string =
		options.style?.bottom?.middle || options.style?.horizontal || "";
	const bottomleft: string =
		options.style?.bottom?.left ||
		options.style?.bottom?.corner ||
		options.style?.corner ||
		"";
	const bottomright: string =
		options.style?.bottom?.right ||
		options.style?.bottom?.corner ||
		options.style?.corner ||
		"";

	// do we have any bottom elements?
	if (bottomleft || bottomright || bottommiddle) {
		if ((bottomleft || bottomright) && !bottommiddle) bottommiddle = " ";
		const ruleWidth = options.width - bottomleft.length - bottomright.length; // account for corners
		const rule = bottommiddle.repeat(
			Math.ceil(ruleWidth / bottommiddle.length)
		); // repeats the horizontal padder enough times to fit rule width
		const safeRule = rule.slice(0, ruleWidth); // only use what we need for the full size;
		lines.push(borderColor(`${bottomleft}${safeRule}${bottomright}`));
	}

	return lines;
}

/**
 * Check if a partial string autocompletes to another string.
 * @param partial A short string.
 * @param target A longer string to compare against.
 * @returns {boolean} If the partial matches the target string, return true; otherwise return false.
 */
export function autocomplete(partial: string, target: string): boolean {
	if (partial.length > target.length) return false;
	if (partial.toLowerCase() !== target.toLowerCase().slice(0, partial.length))
		return false;
	return true;
}

/**
 * Match a set of words to another set of words.
 * @param needle A set of words.
 * @param haystack A set of words to compare against.
 * @returns {boolean} If all of the words in the needle words have a match in the haystack, return true; otherwise return false.
 */
export function matchKeywords(needle: string, haystack: string) {
	const needleSplit = needle.split(/\s+/g);
	const haystackSplit = haystack.split(/\s+/g);
	for (const _needle of needleSplit) {
		let consumed = false;
		for (const _haystack of haystackSplit) {
			if (autocomplete(_needle, _haystack)) {
				consumed = true;
				break;
			}
		}

		if (!consumed) return false;
	}

	return true;
}
