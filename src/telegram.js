export async function sendTelegram(env, text) {
  const url =
    `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text,
      parse_mode: "Markdown"
    })
  });

  const body = await response.text();

  if (!response.ok) {
    console.error("Telegram API ERROR:", {
      status: response.status,
      body
    });

    throw new Error(
      `Telegram API ${response.status}: ${body}`
    );
  }

  console.log("Telegram message sent:", body);

  return JSON.parse(body);
}
/*
|--------------------------------------------------------------------------
| Message builders
|--------------------------------------------------------------------------
*/

export async function sendUpcomingMatch(env, match) {
  const home = match.homeTeam.shortName ||
               match.homeTeam.name;

  const away = match.awayTeam.shortName ||
               match.awayTeam.name;

  const message =
`⏰ *KICKOFF IN 5 MINUTES*

*${home}* vs *${away}*

🏆 ${match.competition.name}`;

  return sendTelegram(env, message);
}

export async function sendMatchStarted(env, match) {
  const home = match.homeTeam.shortName ||
               match.homeTeam.name;

  const away = match.awayTeam.shortName ||
               match.awayTeam.name;

  const message =
`⚽ *MATCH STARTED*

*${home}* vs *${away}*

🏆 ${match.competition.name}`;

  return sendTelegram(env, message);
}

export async function sendGoal(
  env,
  match,
  homeScore,
  awayScore
) {
  const home = match.homeTeam.shortName ||
               match.homeTeam.name;

  const away = match.awayTeam.shortName ||
               match.awayTeam.name;

  const message =
`⚽ *GOAL!*

*${home}* ${homeScore} - ${awayScore} *${away}*

🏆 ${match.competition.name}`;

  return sendTelegram(env, message);
}

export async function sendHalfTime(
  env,
  match,
  homeScore,
  awayScore
) {
  const home = match.homeTeam.shortName ||
               match.homeTeam.name;

  const away = match.awayTeam.shortName ||
               match.awayTeam.name;

  const message =
`⏸ *HALF TIME*

*${home}* ${homeScore} - ${awayScore} *${away}*

🏆 ${match.competition.name}`;

  return sendTelegram(env, message);
}

export async function sendFullTime(
  env,
  match,
  homeScore,
  awayScore
) {
  const home = match.homeTeam.shortName ||
               match.homeTeam.name;

  const away = match.awayTeam.shortName ||
               match.awayTeam.name;

  const message =
`🏁 *FULL TIME*

*${home}* ${homeScore} - ${awayScore} *${away}*

🏆 ${match.competition.name}`;

  return sendTelegram(env, message);
}