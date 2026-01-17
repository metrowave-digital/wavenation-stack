let cachedToken: {
  value: string;
  expiresAt: number;
} | null = null;

async function getSpotifyAccessToken(): Promise<string> {
  if (
    cachedToken &&
    Date.now() < cachedToken.expiresAt
  ) {
    return cachedToken.value;
  }

  const res = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }
  );

  const data = await res.json();

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 60_000,
  };

  return cachedToken.value;
}

export async function getSpotifyArtwork(
  artist: string,
  title: string
): Promise<string | null> {
  try {
    const token = await getSpotifyAccessToken();

    const query = `track:${title} artist:${artist}`;

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    const track = data?.tracks?.items?.[0];

    return (
      track?.album?.images?.[0]?.url ?? null
    );
  } catch {
    return null;
  }
}
