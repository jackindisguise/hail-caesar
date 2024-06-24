import { createLogger, format, transports } from "winston";
import { pad, padLeft } from "./string.js";

/**
 * Generate date string for log file names.
 */
// time stuff
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();
const hour = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

// actual formatted date string
const dateString = `${year}${padLeft(month.toString(), 2, "0")}${padLeft(
	day.toString(),
	2,
	"0"
)}${padLeft(hour.toString(), 2, "0")}${padLeft(
	minutes.toString(),
	2,
	"0"
)}${padLeft(seconds.toString(), 2, "0")}`;

/**
 * The logger.
 */
export const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD hh:mm:ss.SSS A",
		}),
		format.align(),
		format.printf(
			(info) => `[${info.timestamp}] ${info.level}: ${info.message}`
		)
	),
	transports: [
		new transports.File({
			filename: `logs/${dateString}-error.log`,
			level: "error",
		}),
		new transports.File({
			filename: `logs/${dateString}.log`,
			level: "debug",
		}),
		new transports.Console({
			format: format.combine(
				format.colorize({ all: true }),
				format.timestamp({
					format: "YYYY-MM-DD hh:mm:ss.SSS A",
				}),
				format.align(),
				format.printf(
					(info) => `[${info.timestamp}] ${info.level}: ${info.message}`
				)
			),
			level: "debug",
		}),
	],
});

if (process.argv.includes("-nolog")) {
	console.log(process.argv);
	logger.transports.forEach((transport) => {
		transport.silent = true;
	});
}
