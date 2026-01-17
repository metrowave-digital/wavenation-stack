import type { NowPlayingTrack } from "./UpNextTypes";

// Replace with your Live365 station API endpoint:
const LIVE365_ENDPOINT = "https://api.live365.com/station/YOUR_STATION_ID/now";

export async function getNowPlaying(): Promise<NowPlayingTrack | null> {
  try {
    const res = await fetch(LIVE365_ENDPOINT, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    return {
      track: data?.title ?? "",
      artist: data?.artist ?? "",
      cover: data?.art?.large ?? null,
    };
  } catch {
    return null; // eslint-clean way of ignoring errors
  }
}
