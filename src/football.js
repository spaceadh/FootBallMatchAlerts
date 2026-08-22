import { CONFIG } from "./config.js";
import { retry } from "./utils.js";

const API_BASE = "https://api.football-data.org/v4";

export async function footballFetch(env, endpoint) {
  return retry(
    async () => {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          "X-Auth-Token": env.FOOTBALL_API_KEY
        }
      });

      if (!response.ok) {
        const body = await response.text();

        throw new Error(
          `Football API ${response.status}: ${body}`
        );
      }

      return response.json();
    },
    CONFIG.API_RETRIES,
    CONFIG.API_RETRY_DELAY
  );
}

/*
|--------------------------------------------------------------------------
| Get matches for a specific competition/date
|--------------------------------------------------------------------------
*/

export async function getCompetitionMatches(
  env,
  competitionCode,
  date
) {

  return footballFetch(
    env,
    `/competitions/${competitionCode}/matches?dateFrom=${date}&dateTo=${date}`
  );
}


export async function getMatchesForDate(env, date) {
  return footballFetch(
    env,
    `/matches?dateFrom=${date}&dateTo=${date}`
  );
}

export async function getMatch(env, matchId) {
  return footballFetch(
    env,
    `/matches/${matchId}`
  );
}