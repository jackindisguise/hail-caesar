import { load, calendar } from "./build/database.js";
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
	const then = Date.now();
	const report = () => {
		const now = Date.now() - then;
		console.log(
			`Today is ${calendar.monthName(now)} ${nth(
				calendar.dayOfMonth(now)
			)}, year #${calendar.year(now)}`
		);
		const hour = calendar.hour(now);
		const minute = calendar.minute(now);
		const second = calendar.second(now);
		console.log(
			`It is currently ${hour < 10 ? "0" + hour : hour}:${
				minute < 10 ? "0" + minute : minute
			}:${second < 10 ? "0" + second : second}`
		);
	};

	report();
	setInterval(report, 1000);
});
