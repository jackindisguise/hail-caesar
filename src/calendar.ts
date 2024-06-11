export interface CalendarInterface {
	hoursPerDay: number;
	minutesPerHour: number;
	secondsPerMinute: number;
	months: MonthInterface[];
}

const millisecondsPerSecond = 1000;

export class Calendar {
	/**
	 * Seconds per year (as dictated by months within the calendar).
	 */
	#period: number = 0;
	get period(): number {
		return this.#period;
	}

	// conversion of timestamp into time
	hoursPerDay: number;
	minutesPerHour: number;
	secondsPerMinute: number;

	// months in this calendar
	#months: Month[] = [];

	static validateInterface(data: any): CalendarInterface {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.hoursPerDay !== "number")
			throw new TypeError("missing/bad field 'hoursPerDay'");
		if (typeof data.minutesPerHour !== "number")
			throw new TypeError("missing/bad field 'minutesPerHour'");
		if (typeof data.secondsPerMinute !== "number")
			throw new TypeError("missing/bad field 'secondsPerMinute'");
		if (!Array.isArray(data.months))
			throw new TypeError("missing/bad field 'months'");

		// convert month data to interfaces
		const MIs: MonthInterface[] = [];
		for (let entry of data.months) {
			const MI = Month.validateInterface(entry);
			MIs.push(MI);
		}

		return {
			hoursPerDay: data.hoursPerDay,
			minutesPerHour: data.minutesPerHour,
			secondsPerMinute: data.secondsPerMinute,
			months: MIs,
		};
	}

	static fromJSON(data: any): Calendar {
		// validate JSON
		const ci: CalendarInterface = Calendar.validateInterface(data);

		// load calendar
		const c = new Calendar(
			ci.hoursPerDay,
			ci.minutesPerHour,
			ci.secondsPerMinute
		);

		for (let mi of ci.months) {
			const month = Month.fromJSON(mi);
			if (month) c.add(month);
		}

		return c;
	}

	constructor(
		hoursPerDay: number,
		minutesPerHour: number,
		secondsPerMinute: number
	) {
		this.hoursPerDay = hoursPerDay;
		this.minutesPerHour = minutesPerHour;
		this.secondsPerMinute = secondsPerMinute;
	}

	add(...months: Month[]) {
		for (let month of months) {
			this.#months.push(month);
			this.#period +=
				month.days *
				millisecondsPerSecond *
				this.secondsPerMinute *
				this.minutesPerHour *
				this.hoursPerDay;
		}
	}

	periodify(timestamp: number) {
		return timestamp % this.#period;
	}

	day(timestamp: number) {
		return Math.floor(
			this.periodify(timestamp) /
				(this.hoursPerDay *
					this.minutesPerHour *
					this.secondsPerMinute *
					millisecondsPerSecond)
		);
	}

	dayOfMonth(timestamp: number): number {
		let day = this.day(timestamp);
		for (let i = 0; i < this.#months.length; i++) {
			const month = this.#months[i];
			if (month.days <= day) day -= month.days;
			else break;
		}

		return day;
	}

	year(timestamp: number): number {
		const now = Math.floor(timestamp / this.#period);
		return now;
	}

	month(timestamp: number): number {
		let day = this.day(timestamp);
		let month = 0;
		for (month; month < this.#months.length; month++) {
			let m = this.#months[month];
			if (m.days <= day) day -= m.days;
			else break;
		}

		return month;
	}

	monthName(timestamp: number): string {
		const month = this.#months[this.month(timestamp)];
		return month.name;
	}

	hour(timestamp: number) {
		const now =
			Math.floor(
				timestamp /
					(millisecondsPerSecond * this.secondsPerMinute * this.minutesPerHour)
			) % this.hoursPerDay;
		return now;
	}

	minute(timestamp: number) {
		const now =
			Math.floor(timestamp / (millisecondsPerSecond * this.secondsPerMinute)) %
			this.minutesPerHour;
		return now;
	}

	second(timestamp: number) {
		const now =
			Math.floor(timestamp / millisecondsPerSecond) % this.secondsPerMinute;
		return now;
	}

	millisecond(timestamp: number) {
		return timestamp % millisecondsPerSecond;
	}
}

export interface MonthInterface {
	name: string;
	days: number;
}

export class Month {
	name: string;
	days: number;
	constructor(name: string, days: number) {
		this.name = name;
		this.days = days;
	}

	static validateInterface(data: any): MonthInterface {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.name !== "string")
			throw new TypeError("missing/bad field 'name'");
		if (typeof data.days !== "number")
			throw new TypeError("missing/bad field 'days'");
		return {
			name: data.name,
			days: data.days,
		};
	}

	static fromJSON(data: any): Month {
		// validate JSON
		const obj: MonthInterface = Month.validateInterface(data);

		// load month
		const month = new Month(obj.name, obj.days);
		return month;
	}
}
