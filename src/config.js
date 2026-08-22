export const CONFIG = {
  // Schedule cache
  SCHEDULE_CACHE_TTL: 3 * 60 * 60,

  // How many days ahead we fetch
  DAYS_AHEAD: 2,

  // Upcoming match alert
  PRE_MATCH_MINUTES: 5,

  // How long after kickoff we continue monitoring
  LIVE_MATCH_WINDOW_MINUTES: 150,

  // Football API retry configuration
  API_RETRIES: 3,
  API_RETRY_DELAY: 1000,

  // Match state expiration
  MATCH_STATE_TTL: 3 * 60 * 60,

  // Cron expressions
  CRONS: {
    SCHEDULE: "0 */3 * * *",
    MONITOR: "*/5 * * * *"
  }
};


/*
|--------------------------------------------------------------------------
| PRIMARY COMPETITIONS
|--------------------------------------------------------------------------
|
| These are the only competitions the system will fetch and monitor.
|
*/

export const COMPETITIONS = [
  {
    code: "PL",
    name: "Premier League"
  },

  {
    code: "PD",
    name: "La Liga"
  },

  {
    code: "BL1",
    name: "Bundesliga"
  },

  {
    code: "SA",
    name: "Serie A"
  },

  {
    code: "FL1",
    name: "Ligue 1"
  },

  {
    code: "CL",
    name: "Champions League"
  },

  {
    code: "EL",
    name: "Europa League"
  }
];