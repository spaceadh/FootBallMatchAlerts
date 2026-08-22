import { CONFIG, COMPETITIONS } from "./config.js";
import {
  getMatchesForDate,
  getCompetitionMatches
} from "./football.js";

import {
  getDateString,
  addDays
} from "./utils.js";

import {
  saveSchedule
} from "./state.js";

export async function syncSchedule(env) {
  console.log("Starting primary competition schedule synchronization...");

  const today = new Date();

  for (
    let dayOffset = 0;
    dayOffset <= CONFIG.DAYS_AHEAD;
    dayOffset++
  ) {
    const date = getDateString(
      addDays(today, dayOffset)
    );

    console.log(
      `Fetching matches for ${date}...`
    );

    /*
    |--------------------------------------------------------------------------
    | Collect matches from all competitions
    |--------------------------------------------------------------------------
    */

    const allMatches = [];


    for (
      const competition
      of COMPETITIONS
    ) {

      try {

        console.log(
          `Fetching ${competition.name}...`
        );


        const data =
          await getCompetitionMatches(
            env,
            competition.code,
            date
          );


        const matches =
          data.matches || [];


        /*
        |--------------------------------------------------------------------------
        | Add competition metadata
        |--------------------------------------------------------------------------
        */

        for (
          const match
          of matches
        ) {

          allMatches.push({
            ...match,

            trackedCompetition: {
              code: competition.code,
              name: competition.name
            }
          });
        }


        console.log(
          `${competition.name}: ${matches.length} matches`
        );


      } catch (error) {

        console.error(
          `Failed to fetch ${competition.name} for ${date}:`,
          error
        );
      }
    }


    /*
    |--------------------------------------------------------------------------
    | Save combined schedule
    |--------------------------------------------------------------------------
    */

    await saveSchedule(
      env,
      date,
      allMatches
    );


    console.log(
      `Cached ${allMatches.length} primary competition matches for ${date}`
    );
  }

  console.log(
    "Primary competition schedule synchronization completed."
  );
}