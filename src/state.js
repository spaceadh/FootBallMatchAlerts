import { CONFIG } from "./config.js";

/*
|--------------------------------------------------------------------------
| Schedule
|--------------------------------------------------------------------------
*/

export async function saveSchedule(env, date, matches) {
  await env.MATCH_KV.put(
    `schedule:${date}`,
    JSON.stringify(matches),
    {
      expirationTtl: CONFIG.SCHEDULE_CACHE_TTL
    }
  );
}

export async function getSchedule(env, date) {
  return env.MATCH_KV.get(
    `schedule:${date}`,
    "json"
  );
}

/*
|--------------------------------------------------------------------------
| Match state
|--------------------------------------------------------------------------
*/

export async function getMatchState(env, matchId) {
  return env.MATCH_KV.get(
    `match:${matchId}`,
    "json"
  );
}

export async function saveMatchState(env, matchId, state) {
  await env.MATCH_KV.put(
    `match:${matchId}`,
    JSON.stringify(state),
    {
      expirationTtl: CONFIG.MATCH_STATE_TTL
    }
  );
}

/*
|--------------------------------------------------------------------------
| Event deduplication
|--------------------------------------------------------------------------
*/

export async function hasEventBeenSent(env, matchId, event) {
  return Boolean(
    await env.MATCH_KV.get(
      `event:${matchId}:${event}`
    )
  );
}

export async function markEventSent(env, matchId, event) {
  await env.MATCH_KV.put(
    `event:${matchId}:${event}`,
    "true",
    {
      expirationTtl: CONFIG.MATCH_STATE_TTL
    }
  );
}