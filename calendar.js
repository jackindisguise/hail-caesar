import { setAbsoluteInterval, setRelativeInterval } from "./build/time.js";
import { load, calendar, world } from "./build/database.js";
import { toOrdinal } from "./build/string.js";

console.log("Loading game database...");
load((delay) => {
	console.log(`Took ${delay} milliseconds to load database.`);
	console.log(`Loaded ${world.name} (@1.0.0)`);
	const report = () => {
		const now = world.runtime;
		console.log(
			`Today is the ${toOrdinal(
				calendar.dayOfMonth(now)
			)} of ${calendar.monthName(now)}, year #${calendar.year(now)}`
		);
		const hour = calendar.hour(now);
		const minute = calendar.minute(now);
		const second = calendar.second(now);
		const ms = calendar.millisecond(now);
		console.log(
			`It is currently ${hour < 10 ? "0" + hour : hour}:${
				minute < 10 ? "0" + minute : minute
			}:${second < 10 ? "0" + second : second}.${ms}`
		);
	};

	report();
	setRelativeInterval(report, 1000);
	// setAbsoluteInterval(report, 1000);
	//	setInterval(report, 500);
});
