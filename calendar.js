import { setAbsoluteInterval, setRelativeInterval } from "./build/time.js";
import { load, calendar, world } from "./build/database.js";
function nth(n) {
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

load((delay) => {
	console.log(`took ${delay} milliseconds to load database.`);
	const report = () => {
		const now = world.runtime;
		console.log(
			`Today is the ${nth(calendar.dayOfMonth(now))} of ${calendar.monthName(
				now
			)}, year #${calendar.year(now)}`
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
