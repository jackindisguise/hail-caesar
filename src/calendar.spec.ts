import { expect } from "chai";
import { Calendar, Month, CalendarInterface } from "./calendar.js";

describe("calendar.ts", () => {
	describe("Calendar", () => {
		let calendarInterface: CalendarInterface;
		it("validateInterface", (done) => {
			const json: any = {
				name: "blah",
				hoursPerDay: 24,
				minutesPerHour: 10,
				secondsPerMinute: 5,
				months: [
					{ name: "January", days: 30 },
					{ name: "February", days: 28 },
				],
			};

			calendarInterface = Calendar.validateInterface(json);
			done();
		});

		it("fromJSON", (done) => {
			const c: Calendar = Calendar.fromJSON(calendarInterface);
			done();
		});

		let c: Calendar;
		const spm = 10;
		const mph = 10;
		const hpd = 24;
		const day = 1000 * spm * mph * hpd;
		it("new", (done) => {
			c = new Calendar(hpd, mph, spm);
			expect(c.period).is.equal(0);
			done();
		});

		it("add", (done) => {
			const jan = new Month("January", 30);
			const feb = new Month("February", 28);
			c.add(jan, feb);
			expect(c.period).is.equal(day * (30 + 28));
			done();
		});

		it("millisecond", (done) => {
			expect(c.millisecond(0)).is.equal(0);
			expect(c.millisecond(999)).is.equal(999);
			expect(c.millisecond(1000)).is.equal(0);
			done();
		});

		it("second", (done) => {
			expect(c.second(0)).is.equal(0);
			expect(c.second(500)).is.equal(0);
			expect(c.second(999)).is.equal(0);
			expect(c.second(1000)).is.equal(1);
			expect(c.second(1000 * (spm - 1))).is.equal(spm - 1);
			expect(c.second(1000 * spm)).is.equal(0);
			done();
		});

		it("minute", (done) => {
			expect(c.minute(0)).is.equal(0);
			expect(c.minute(1000 * spm * (mph - 1))).is.equal(mph - 1);
			expect(c.minute(1000 * spm * mph)).is.equal(0);
			done();
		});

		it("hour", (done) => {
			expect(c.hour(0)).is.equal(0);
			expect(c.hour(1000 * spm * mph * (hpd - 1))).is.equal(hpd - 1);
			expect(c.hour(1000 * spm * mph * hpd)).is.equal(0);
			done();
		});

		it("day", (done) => {
			expect(c.day(0)).is.equal(0);
			expect(c.day(day - 1)).is.equal(0);
			expect(c.day(day)).is.equal(1);
			expect(c.day(day * 5)).is.equal(5);
			expect(c.day(day * (30 + 28))).is.equal(0);
			done();
		});

		it("dayOfMonth", (done) => {
			expect(c.dayOfMonth(0)).is.equal(0);
			expect(c.dayOfMonth(day)).is.equal(1);
			expect(c.dayOfMonth(day * 5)).is.equal(5);
			expect(c.dayOfMonth(day * 30)).is.equal(0);
			done();
		});

		it("month", (done) => {
			expect(c.month(0)).is.equal(0);
			expect(c.month(day * 30)).is.equal(1);
			expect(c.month(day * (30 + 28))).is.equal(0);
			done();
		});

		it("monthName", (done) => {
			expect(c.monthName(0)).is.equal("January");
			expect(c.monthName(day * 30)).is.equal("February");
			expect(c.monthName(day * (30 + 28))).is.equal("January");
			done();
		});

		it("year", (done) => {
			expect(c.year(0)).is.equal(0);
			expect(c.year(day * (30 + 28))).is.equal(1);
			done();
		});
	});
});
