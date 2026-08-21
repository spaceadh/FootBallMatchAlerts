export const CONFIG = {
  // How often the schedule cache should remain valid.
  SCHEDULE_CACHE_TTL: 3 * 60 * 60,

  // How many days of fixtures we want to know about.
  DAYS_AHEAD: 2,

  // Alert before kickoff.
  PRE_MATCH_MINUTES: 5,

  // Don't monitor matches indefinitely.
  LIVE_MATCH_WINDOW_MINUTES: 150,

  // API retry configuration.
  API_RETRIES: 3,
  API_RETRY_DELAY: 1000,

  // KV state expiration.
  MATCH_STATE_TTL: 3 * 60 * 60,

  // Cron expressions.
  CRONS: {
    SCHEDULE: "0 */3 * * *",
    MONITOR: "*/5 * * * *"
  }
};