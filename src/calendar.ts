import { Serializable } from "./serializable.js";

/**
 * Provides data for instantiating a calendar.
 */
export interface CalendarInterface {
	hoursPerDay: number;
	minutesPerHour: number;
	secondsPerMinute: number;
	months: MonthInterface[];
}

/**
 * Not sure if I should make this a parameter on the calendar or not.
 * The calendar can convert seconds to any other unit of time, but
 * it might make sense to enforce a 1 second = 1 second rule.
 */
const MILLISECONDS_PER_SECOND = 1000;

/**
 * Provides the parameters for telling the time of day, as well as the days and months of the year.
 */
export class Calendar implements Serializable<CalendarInterface> {
	/**
	 * Milliseconds per year, as dictated by months within the calendar.
	 */
	#period: number = 0;

	/**
	 * Milliseconds per year, as dictated by months within the calendar.
	 */
	get period(): number {
		return this.#period;
	}

	/**
	 * How many hours are in a day.
	 */
	hoursPerDay: number;
	/**
	 * How many minutes are in an hour.
	 */
	minutesPerHour: number;
	/**
	 * How many seconds are in a minute.
	 */
	secondsPerMinute: number;

	/**
	 * The months of the year.
	 */
	months: Month[] = [];

	constructor(
		hoursPerDay: number,
		minutesPerHour: number,
		secondsPerMinute: number
	) {
		this.hoursPerDay = hoursPerDay;
		this.minutesPerHour = minutesPerHour;
		this.secondsPerMinute = secondsPerMinute;
	}

	/**
	 * Checks a generic object to ensure it has all of the data necessary to act as an interface.
	 * @param data A generic object presumably returned from parsing a file.
	 * @returns A valid interface for the calendar.
	 */
	static validateData(data: any): CalendarInterface {
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
			const MI = Month.validateData(entry);
			MIs.push(MI);
		}

		return {
			hoursPerDay: data.hoursPerDay,
			minutesPerHour: data.minutesPerHour,
			secondsPerMinute: data.secondsPerMinute,
			months: MIs,
		};
	}

	/**
	 * Use a generic object to create a new calendar.
	 * @param data A generic object presumably returned from parsing a file.
	 * @returns A new calendar.
	 */
	static fromData(data: any): Calendar {
		// validate JSON
		const ci: CalendarInterface = Calendar.validateData(data);

		// load calendar
		const c = new Calendar(
			ci.hoursPerDay,
			ci.minutesPerHour,
			ci.secondsPerMinute
		);

		for (let mi of ci.months) {
			const month = Month.fromData(mi);
			if (month) c.add(month);
		}

		return c;
	}

	toData() {
		const months = [];
		for (let month of this.months) {
			const monthInterface = month.toData();
			months.push(monthInterface);
		}

		return {
			hoursPerDay: this.hoursPerDay,
			minutesPerHour: this.minutesPerHour,
			secondsPerMinute: this.secondsPerMinute,
			months: months,
		};
	}

	/**
	 * Add months to the calendar.
	 * Internally tracks the "length" of a month for the purposes of quickly determining how long a year is.
	 * @param months The months that should be added to the calendar.
	 */
	add(...months: Month[]) {
		for (let month of months) {
			this.months.push(month);
			this.#period +=
				month.days *
				MILLISECONDS_PER_SECOND *
				this.secondsPerMinute *
				this.minutesPerHour *
				this.hoursPerDay;
		}
	}

	/**
	 * Fetch only the time relevant to this period.
	 * @param timestamp A timestamp.
	 * @returns A relative timestamp for this period.
	 */
	periodify(timestamp: number) {
		return timestamp % this.#period;
	}

	/**
	 * Check the absolute day of the current period.
	 * @param timestamp A timestamp.
	 * @returns The current day of the current period.
	 */
	day(timestamp: number) {
		return Math.floor(
			this.periodify(timestamp) /
				(this.hoursPerDay *
					this.minutesPerHour *
					this.secondsPerMinute *
					MILLISECONDS_PER_SECOND)
		);
	}
	/**
	 * Check the day of the current month.
	 * @param timestamp A timestamp.
	 * @returns The current day of the current month.
	 */
	dayOfMonth(timestamp: number): number {
		let day = this.day(timestamp);
		for (let i = 0; i < this.months.length; i++) {
			const month = this.months[i];
			if (month.days <= day) day -= month.days;
			else break;
		}

		return day;
	}

	/**
	 * Check the year of a timestamp.
	 * @param timestamp A timestamp.
	 * @returns The current year.
	 */
	year(timestamp: number): number {
		const now = Math.floor(timestamp / this.#period);
		return now;
	}

	/**
	 * Check the month of a timestamp.
	 * @param timestamp A timestamp.
	 * @returns The current month.
	 */
	month(timestamp: number): number {
		let day = this.day(timestamp);
		let month = 0;
		for (month; month < this.months.length; month++) {
			let m = this.months[month];
			if (m.days <= day) day -= m.days;
			else break;
		}

		return month;
	}

	/**
	 * Check the name of the month of a timestamp.
	 * @param timestamp A timestamp.
	 * @returns The current month.
	 */
	monthName(timestamp: number): string {
		const month = this.months[this.month(timestamp)];
		return month.name;
	}

	/**
	 * Check the hour of a timestamp.
	 * @param timestamp A timestamp.
	 * @returns The current hour.
	 */
	hour(timestamp: number) {
		const now =
			Math.floor(
				timestamp /
					(MILLISECONDS_PER_SECOND *
						this.secondsPerMinute *
						this.minutesPerHour)
			) % this.hoursPerDay;
		return now;
	}

	/**
	 * Check the minute of a timestamp.
	 * @param timestamp A timestamp.
	 * @returns The current minute.
	 */
	minute(timestamp: number) {
		const now =
			Math.floor(
				timestamp / (MILLISECONDS_PER_SECOND * this.secondsPerMinute)
			) % this.minutesPerHour;
		return now;
	}

	/**
	 * Check the second of a timestamp.
	 * @param timestamp A timestamp.
	 * @returns The current second.
	 */
	second(timestamp: number) {
		const now =
			Math.floor(timestamp / MILLISECONDS_PER_SECOND) % this.secondsPerMinute;
		return now;
	}

	/**
	 * Check the millisecond of a timestamp.
	 * @param timestamp A timestamp.
	 * @returns The current millisecond.
	 */
	millisecond(timestamp: number) {
		return timestamp % MILLISECONDS_PER_SECOND;
	}
}

/**
 * Provides data for instantiating a month.
 */
export interface MonthInterface {
	name: string;
	days: number;
}

/**
 * Provides the parameters for telling the name and length of a month.
 */
export class Month {
	/**
	 * The name of the month.
	 */
	name: string;

	/**
	 * How many days are in this month.
	 */
	days: number;
	constructor(name: string, days: number) {
		this.name = name;
		this.days = days;
	}

	/**
	 * Checks a generic object to ensure it has all of the data necessary to act as an interface.
	 * @param data A generic object presumably returned from parsing a file.
	 * @returns A valid interface for the month.
	 */
	static validateData(data: any): MonthInterface {
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

	/**
	 * Use a generic object to create a new month.
	 * @param data A generic object presumably returned from parsing a file.
	 * @returns A new month.
	 */
	static fromData(data: any): Month {
		// validate JSON
		const validated: MonthInterface = Month.validateData(data);

		// load month
		const month = new Month(validated.name, validated.days);
		return month;
	}

	toData() {
		return {
			name: this.name,
			days: this.days,
		};
	}
}
