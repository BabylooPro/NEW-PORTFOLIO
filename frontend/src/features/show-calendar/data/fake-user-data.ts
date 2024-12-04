import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { availableTimes } from "./available-times";

// FAKE CALENDAR DATA INTERFACE
export interface FakeCalendarData {
	[key: string]: number;
}

// SEEDED RANDOM NUMBER GENERATOR
function seededRandom(seed: number) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

// GENERATE FAKE CALENDAR DATA
export function generateFakeCalendarData(year: number): FakeCalendarData {
	const data: FakeCalendarData = {}; // INITIALIZE DATA OBJECT

	// LOOP THROUGH EACH MONTH
	for (let month = 1; month <= 12; month++) {
		const daysInMonth = new Date(year, month, 0).getDate(); // GET DAYS IN MONTH

		// LOOP THROUGH EACH DAY
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new CalendarDate(year, month, day); // CREATE DATE OBJECT
			const dateString = date.toString(); // CONVERT DATE TO STRING

			// USE A SEEDED RANDOM NUMBER GENERATOR
			const seed = year * 10000 + month * 100 + day;
			const randomValue = seededRandom(seed);

			// GENERATE A NUMBER OF AVAILABLE TIMES BASED ON RANDOM VALUE
			let availableTimesCount;
			if (randomValue < 0.1) {
				availableTimesCount = 0; // 10% CHANCE OF NO AVAILABLE TIMES
			} else if (randomValue < 0.3) {
				// 20% CHANCE OF 1-5 AVAILABLE TIMES (YELLOW STATUS)
				availableTimesCount = Math.floor(randomValue * 10) + 1;
			} else {
				// 70% CHANCE OF 6+ AVAILABLE TIMES (GREEN STATUS)
				availableTimesCount = Math.floor(randomValue * (availableTimes.length - 6)) + 6;
			}

			data[dateString] = availableTimesCount; // STORE AVAILABLE TIMES COUNT IN DATA OBJECT
		}
	}

	return data;
}

// GENERATE FAKE DATA FOR CURRENT YEAR
const currentDate = today(getLocalTimeZone());
export const fakeCalendarData = generateFakeCalendarData(currentDate.year);

// FUNCTION TO GET FAKE DATA FOR A SPECIFIC DATE
export function getFakeDataForDate(date: CalendarDate): number {
	const dateString = date.toString();
	return fakeCalendarData[dateString] || 0;
}
