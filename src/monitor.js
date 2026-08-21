import { CONFIG } from "./config.js";

import {
  getSchedule,
  getMatchState,
  saveMatchState,
  hasEventBeenSent,
  markEventSent
} from "./state.js";

import {
  getMatch
} from "./football.js";

import {
  getDateString,
  minutesUntil,
  minutesSince
} from "./utils.js";

import {
  sendUpcomingMatch,
  sendMatchStarted,
  sendGoal,
  sendHalfTime,
  sendFullTime
} from "./telegram.js";


export async function monitorMatches(env) {

  console.log("Starting match monitor...");

  const today = getDateString();

  const schedule = await getSchedule(
    env,
    today
  );

  if (!schedule || schedule.length === 0) {
    console.log("No cached matches found.");
    return;
  }

  let checked = 0;

  for (const match of schedule) {

    const kickoff = match.utcDate;

    const untilKickoff =
      minutesUntil(kickoff);

    const sinceKickoff =
      minutesSince(kickoff);


    /*
    |--------------------------------------------------------------------------
    | 1. Upcoming match
    |--------------------------------------------------------------------------
    */

    if (
      untilKickoff <= CONFIG.PRE_MATCH_MINUTES &&
      untilKickoff > 0
    ) {

      const event = "upcoming";

      if (
        !(await hasEventBeenSent(
          env,
          match.id,
          event
        ))
      ) {

        await sendUpcomingMatch(
          env,
          match
        );

        await markEventSent(
          env,
          match.id,
          event
        );
      }
    }


    /*
    |--------------------------------------------------------------------------
    | 2. Ignore matches that are far away
    |--------------------------------------------------------------------------
    */

    if (
      sinceKickoff < 0 ||
      sinceKickoff >
        CONFIG.LIVE_MATCH_WINDOW_MINUTES
    ) {
      continue;
    }


    /*
    |--------------------------------------------------------------------------
    | 3. Fetch current match state
    |--------------------------------------------------------------------------
    */

    try {

      const current =
        await getMatch(
          env,
          match.id
        );

      checked++;

      await processMatch(
        env,
        current
      );

    } catch (error) {

      console.error(
        `Failed to monitor match ${match.id}:`,
        error
      );
    }
  }

  console.log(
    `Monitoring completed. Checked ${checked} live/relevant matches.`
  );
}


/*
|--------------------------------------------------------------------------
| Process individual match
|--------------------------------------------------------------------------
*/

async function processMatch(env, match) {

  const previous =
    await getMatchState(
      env,
      match.id
    );

  const currentState = {
    status: match.status,

    homeScore:
      match.score?.fullTime?.home ?? 0,

    awayScore:
      match.score?.fullTime?.away ?? 0,

    updatedAt:
      Date.now()
  };


  /*
  |--------------------------------------------------------------------------
  | MATCH STARTED
  |--------------------------------------------------------------------------
  */

  if (
    match.status === "IN_PLAY" ||
    match.status === "PAUSED"
  ) {

    if (
      !(await hasEventBeenSent(
        env,
        match.id,
        "started"
      ))
    ) {

      await sendMatchStarted(
        env,
        match
      );

      await markEventSent(
        env,
        match.id,
        "started"
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | GOAL DETECTION
  |--------------------------------------------------------------------------
  */

  if (previous) {

    const scoreChanged =
      previous.homeScore !==
        currentState.homeScore ||
      previous.awayScore !==
        currentState.awayScore;

    if (scoreChanged) {

      const eventKey =
        `goal:${currentState.homeScore}-${currentState.awayScore}`;

      if (
        !(await hasEventBeenSent(
          env,
          match.id,
          eventKey
        ))
      ) {

        await sendGoal(
          env,
          match,
          currentState.homeScore,
          currentState.awayScore
        );

        await markEventSent(
          env,
          match.id,
          eventKey
        );
      }
    }
  }


  /*
  |--------------------------------------------------------------------------
  | HALF TIME
  |--------------------------------------------------------------------------
  */

  if (
    match.status === "PAUSED"
  ) {

    if (
      !(await hasEventBeenSent(
        env,
        match.id,
        "halftime"
      ))
    ) {

      await sendHalfTime(
        env,
        match,
        currentState.homeScore,
        currentState.awayScore
      );

      await markEventSent(
        env,
        match.id,
        "halftime"
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | FULL TIME
  |--------------------------------------------------------------------------
  */

  if (
    match.status === "FINISHED"
  ) {

    if (
      !(await hasEventBeenSent(
        env,
        match.id,
        "finished"
      ))
    ) {

      await sendFullTime(
        env,
        match,
        currentState.homeScore,
        currentState.awayScore
      );

      await markEventSent(
        env,
        match.id,
        "finished"
      );
    }
  }


  /*
  |--------------------------------------------------------------------------
  | Save latest state
  |--------------------------------------------------------------------------
  */

  await saveMatchState(
    env,
    match.id,
    currentState
  );
}