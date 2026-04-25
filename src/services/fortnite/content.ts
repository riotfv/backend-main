import { Hono } from "hono";

import cache from "../../misc/middleware/Cache";
import ParseUserAgent from "../../utils/useragent/parseUseragent";
import { Errors } from "../../utils/errors/errors";

interface Background {
  stage: string;
  _type: string;
  key: string;
}

export default function initRoute(
  router: Hono<{
    Variables: {
      user: any;
      account: any;
      decodedToken: any;
    };
  }>,
) {
  router.get("/content/api/pages/fortnite-game", cache, async (c) => {
    const season = ParseUserAgent(c.req.header("User-Agent"));

    if (!season || ![10, 12].includes(season.season))
      return c.json(Errors.internal.invalidUserAgent, 400);

    const backgrounds: Background[] = [
      {
        stage: `season${season.season}`,
        _type: "DynamicBackground",
        key: "lobby",
      },
      {
        stage: `season${season.season}`,
        _type: "DynamicBackground",
        key: "vault",
      },
    ];

    const vaultBackground: Background = {
      stage: backgrounds[1].stage,
      _type: "DynamicBackground",
      key: "vault",
    };

    return c.json({
      "jcr:isCheckedOut": true,
      _title: "Fortnite Game",
      "jcr:baseVersion": "a7ca237317f1e74e4b8154-226a-4450-a3cd-c77af841e798",
      _activeDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      _locale: "en-US",

      battleroyalenewsv2: {
        news: {
          _type: "Battle Royale News v2",
          motds: [],
        },
        _title: "battleroyalenewsv2",
        _noIndex: false,
        alwaysShow: false,
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
        _templateName: "FortniteGameMOTD",
      },
      emergencynoticev2: {
        "jcr:isCheckedOut": true,
        _title: "emergencynoticev2",
        _noIndex: false,
        "jcr:baseVersion": "a7ca237317f1e71fad4bd6-1b21-4008-8758-5c13f080a7eb",
        emergencynotices: {
          _type: "Emergency Notices",
          emergencynotices: [],
        },
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
      },
      emergencynotice: {
        news: {
          platform_messages: [],
          _type: "Battle Royale News",
          messages: [],
        },
        _title: "emergencynotice",
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
      },
      battleroyalenews: {
        news: {
          _type: "Battle Royale News",
          messages: [],
          motds: [],
          platform_messages: [],
        },
        _title: "battleroyalenews",
        header: "",
        style: "None",
        _noIndex: false,
        alwaysShow: false,
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
        _templateName: "FortniteGameMOTD",
      },
      dynamicbackgrounds: {
        "jcr:isCheckedOut": true,
        backgrounds: {
          backgrounds,
          _type: "DynamicBackgroundList",
        },
        _title: "dynamicbackgrounds",
        _noIndex: false,
        "jcr:baseVersion": "a7ca237317f1e74e4b8154-226a-4450-a3cd-c77af841e798",
        _activeDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        _locale: "en-US",
      },
      shopSections: {
        sectionList: {
          sections: [
            {
              bSortOffersByOwnership: false,
              bShowIneligibleOffersIfGiftable: false,
              bEnableToastNotification: true,
              background: vaultBackground,
              _type: "ShopSection",
              landingPriority: 0,
              bHidden: false,
              sectionId: "Featured",
              bShowTimer: true,
              sectionDisplayName: "Featured",
              bShowIneligibleOffers: true,
            },
            {
              bSortOffersByOwnership: false,
              bShowIneligibleOffersIfGiftable: false,
              bEnableToastNotification: true,
              background: vaultBackground,
              _type: "ShopSection",
              landingPriority: 1,
              bHidden: false,
              sectionId: "Daily",
              bShowTimer: true,
              sectionDisplayName: "Daily",
              bShowIneligibleOffers: true,
            },
            {
              bSortOffersByOwnership: false,
              bShowIneligibleOffersIfGiftable: false,
              bEnableToastNotification: false,
              background: vaultBackground,
              _type: "ShopSection",
              landingPriority: 2,
              bHidden: false,
              sectionId: "Battlepass",
              bShowTimer: false,
              sectionDisplayName: "Battle Pass",
              bShowIneligibleOffers: false,
            },
          ],
        },
        lastModified: "9999-12-12T00:00:00.000Z",
      },
      tournamentinformation: {
        tournament_info: {
          tournaments: [
            {
              loading_screen_image: "",
              title_color: "0BFFAC",
              background_right_color: "41108C",
              background_text_color: "390087",
              _type: "Tournament Display Info",
              tournament_display_id: "arena_solo",
              highlight_color: "FFFFFF",
              primary_color: "0BFFAC",
              title_line_1: "ARENA",
              shadow_color: "5000BE",
              background_left_color: "B537FB",
              poster_fade_color: "420793",
              secondary_color: "FF1A40",
              playlist_tile_image: "",
              base_color: "FFFFFF",
            },
          ],
          _type: "Tournaments Info",
        },
        _title: "tournamentinformation",
        _noIndex: false,
        _activeDate: "2018-11-13T22:32:47.734Z",
        lastModified: "2019-11-01T17:33:35.346Z",
        _locale: "en-US",
      },
      playlistinformation: {
        frontend_matchmaking_header_style: "None",
        _title: "playlistinformation",
        frontend_matchmaking_header_text: "",
        playlist_info: {
          _type: "Playlist Information",
          // @ts-ignore
          playlists: playlists[season.season as number],
        },
        _noIndex: false,
        _activeDate: "2018-04-25T15:05:39.956Z",
        lastModified: "2019-10-29T14:05:17.030Z",
        _locale: "en-US",
      },
    });
  });
}
