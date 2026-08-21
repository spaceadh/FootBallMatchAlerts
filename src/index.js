import { CONFIG } from "./config.js";
import { syncSchedule } from "./schedule.js";
import { monitorMatches } from "./monitor.js";

export default {

  /*
  |--------------------------------------------------------------------------
  | Cloudflare Cron
  |--------------------------------------------------------------------------
  */

  async scheduled(event, env, ctx) {

    console.log(
      `Cron triggered: ${event.cron}`
    );

    if (
      event.cron === CONFIG.CRONS.SCHEDULE
    ) {

      ctx.waitUntil(
        syncSchedule(env)
      );

      return;
    }


    if (
      event.cron === CONFIG.CRONS.MONITOR
    ) {

      ctx.waitUntil(
        monitorMatches(env)
      );

      return;
    }

    console.warn(
      `Unknown cron expression: ${event.cron}`
    );
  },


  /*
  |--------------------------------------------------------------------------
  | Manual HTTP endpoint
  |--------------------------------------------------------------------------
  */

  async fetch(request, env, ctx) {

    const url =
      new URL(request.url);


    /*
    |--------------------------------------------------------------------------
    | Health check
    |--------------------------------------------------------------------------
    */

    if (
      url.pathname === "/health"
    ) {

      return Response.json({
        status: "ok",
        service: "football-alert",
        time: new Date().toISOString()
      });
    }


    /*
    |--------------------------------------------------------------------------
    | Manual schedule sync
    |--------------------------------------------------------------------------
    */

    if (
      url.pathname === "/sync"
    ) {

      try {

        await syncSchedule(env);

        return Response.json({
          success: true,
          message:
            "Schedule synchronized."
        });

      } catch (error) {

        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }


    /*
    |--------------------------------------------------------------------------
    | Manual monitoring
    |--------------------------------------------------------------------------
    */

    if (
      url.pathname === "/monitor"
    ) {

      try {

        await monitorMatches(env);

        return Response.json({
          success: true,
          message:
            "Match monitoring completed."
        });

      } catch (error) {

        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }


    return new Response(
      "Football Alert Worker"
    );
  }
};