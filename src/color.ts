/** ANSI escape codes for foreground colors */
const FG_COLORS = {
	k: "\x1b[30m", // black
	r: "\x1b[31m", // red
	g: "\x1b[32m", // green
	y: "\x1b[33m", // yellow
	b: "\x1b[34m", // blue
	m: "\x1b[35m", // magenta
	c: "\x1b[36m", // cyan
	w: "\x1b[37m", // white
	// Bright variants
	K: "\x1b[90m", // bright black (gray)
	R: "\x1b[91m", // bright red
	G: "\x1b[92m", // bright green
	Y: "\x1b[93m", // bright yellow
	B: "\x1b[94m", // bright blue
	M: "\x1b[95m", // bright magenta
	C: "\x1b[96m", // bright cyan
	W: "\x1b[97m", // bright white
} as const;

/** ANSI escape codes for background colors */
const BG_COLORS = {
	k: "\x1b[40m", // black
	r: "\x1b[41m", // red
	g: "\x1b[42m", // green
	y: "\x1b[43m", // yellow
	b: "\x1b[44m", // blue
	m: "\x1b[45m", // magenta
	c: "\x1b[46m", // cyan
	w: "\x1b[47m", // white
	// Bright variants
	K: "\x1b[100m", // bright black (gray)
	R: "\x1b[101m", // bright red
	G: "\x1b[102m", // bright green
	Y: "\x1b[103m", // bright yellow
	B: "\x1b[104m", // bright blue
	M: "\x1b[105m", // bright magenta
	C: "\x1b[106m", // bright cyan
	W: "\x1b[107m", // bright white
} as const;

const RESET = "\x1b[0m";

/** Options for color parsing */
export interface ColorOptions {
	/** The escape character to use (default: '{') */
	escapeChar?: string;
	/** Whether to strip color codes instead of processing them */
	strip?: boolean;
	/** Whether to enable background colors with '/' prefix */
	enableBackground?: boolean;
}

/**
 * Processes a string containing color codes and returns the colored version
 * @param text Text containing color codes
 * @param options Color processing options
 * @returns Processed text with ANSI color codes
 *
 * Color Codes:
 * - {k: black     {K: bright black (gray)
 * - {r: red       {R: bright red
 * - {g: green     {G: bright green
 * - {y: yellow    {Y: bright yellow
 * - {b: blue      {B: bright blue
 * - {m: magenta   {M: bright magenta
 * - {c: cyan      {C: bright cyan
 * - {w: white     {W: bright white
 * - {x: reset to default
 *
 * Background colors (when enableBackground is true):
 * Use '/' after escape char, e.g. '{/r' for red background
 */
export function colorize(text: string, options: ColorOptions = {}): string {
	const { escapeChar = "{", strip = false, enableBackground = true } = options;

	// Escape the escape character for regex
	const escapedChar = escapeChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	// Create regex pattern
	const pattern = new RegExp(
		`${escapedChar}(${enableBackground ? "\\/" : ""})?([krgybmcwKRGYBMCWx])`,
		"g"
	);

	if (strip) {
		return text.replace(pattern, "");
	}

	let result = text;
	let lastIndex = 0;
	let output = "";
	let currentFg: string | null = null;
	let currentBg: string | null = null;

	// Process each color code
	pattern.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(result)) !== null) {
		// Add text before the color code
		output += result.slice(lastIndex, match.index);

		const [fullMatch, isBackground, colorCode] = match;

		if (colorCode === "x") {
			// Reset all colors
			output += RESET;
			currentFg = null;
			currentBg = null;
		} else {
			if (isBackground && enableBackground) {
				// Background color
				currentBg = BG_COLORS[colorCode as keyof typeof BG_COLORS];
				output += currentBg;
			} else {
				// Foreground color
				currentFg = FG_COLORS[colorCode as keyof typeof FG_COLORS];
				output += currentFg;
			}
		}

		lastIndex = pattern.lastIndex;
	}

	// Add remaining text
	output += result.slice(lastIndex);

	// Ensure colors are reset at the end
	if (currentFg !== null || currentBg !== null) {
		output += RESET;
	}

	return output;
}

/**
 * Strips all color codes from a string
 * @param text Text containing color codes
 * @param escapeChar The escape character used (default: '{')
 * @returns Text with all color codes removed
 */
export function stripColors(text: string, escapeChar = "{"): string {
	return colorize(text, { escapeChar, strip: true });
}
