import { CONFIG } from "./config.js";
import {
  getMatchesForDate
} from "./football.js";

import {
  getDateString,
  addDays
} from "./utils.js";

import {
  saveSchedule
} from "./state.js";

export async function syncSchedule(env) {
  console.log("Starting schedule synchronization...");

  const today = new Date();

  for (
    let i = 0;
    i <= CONFIG.DAYS_AHEAD;
    i++
  ) {
    const date = getDateString(
      addDays(today, i)
    );

    try {
      const data = await getMatchesForDate(
        env,
        date
      );

      const matches = data.matches || [];

      await saveSchedule(
        env,
        date,
        matches
      );

      console.log(
        `Cached ${matches.length} matches for ${date}`
      );

    } catch (error) {
      console.error(
        `Failed to sync ${date}:`,
        error
      );
    }
  }

  console.log(
    "Schedule synchronization completed."
  );
}