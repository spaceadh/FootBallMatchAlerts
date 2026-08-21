export default {
  async scheduled(event, env, ctx) {
    const today = new Date().toISOString().split('T')[0];

    try {
      const res = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${today}`, {
        headers: { 'X-Auth-Token': env.FOOTBALL_API_KEY }
      });

      if (!res.ok) {
        console.error("API Error:", res.statusText);
        return;
      }

      const data = await res.json();
      const matches = data.matches || [];

      for (const match of matches) {
        const matchId = match.id;
        const home = match.homeTeam.shortName || match.homeTeam.name;
        const away = match.awayTeam.shortName || match.awayTeam.name;

        // Kick-off Alert
        if (match.status === 'IN_PLAY' || match.status === 'PAUSED') {
          const alreadyAlerted = await env.MATCH_KV.get(`started_${matchId}`);
          if (!alreadyAlerted) {
            const message = `⚽ *MATCH STARTED*\n\n*${home}* vs *${away}*\n🏆 ${match.competition.name}`;
            await sendTelegram(env, message);
            await env.MATCH_KV.put(`started_${matchId}`, 'true', { expirationTtl: 86400 });
          }
        }

        // Full-Time Alert
        if (match.status === 'FINISHED') {
          const alreadyAlerted = await env.MATCH_KV.get(`finished_${matchId}`);
          if (!alreadyAlerted) {
            const homeScore = match.score.fullTime.home ?? 0;
            const awayScore = match.score.fullTime.away ?? 0;
            const message = `🏁 *FULL TIME*\n\n*${home}* ${homeScore} - ${awayScore} *${away}*\n🏆 ${match.competition.name}`;
            await sendTelegram(env, message);
            await env.MATCH_KV.put(`finished_${matchId}`, 'true', { expirationTtl: 86400 });
          }
        }
      }
    } catch (err) {
      console.error("Worker execution failed:", err);
    }
  }
};

async function sendTelegram(env, text) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    })
  });
}