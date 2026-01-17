let tokenCache: { token: string; expires: number } | null = null;

export async function getSpotifyToken() {
  if (tokenCache && Date.now() < tokenCache.expires) {
    return tokenCache.token;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  tokenCache = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}
