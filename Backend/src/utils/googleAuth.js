import https from "https";

const GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";

const requestGoogleTokenInfo = (idToken) => {
  const url = new URL(GOOGLE_TOKEN_INFO_URL);
  url.searchParams.set("id_token", idToken);

  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let body = "";

      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });

      response.on("end", () => {
        let payload;

        try {
          payload = JSON.parse(body);
        } catch (error) {
          reject(new Error("Invalid Google verification response."));
          return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          const message = payload.error_description || payload.error;
          reject(new Error(message || "Google token verification failed."));
          return;
        }

        resolve(payload);
      });
    });

    request.on("error", () => {
      reject(new Error("Unable to reach Google token verification service."));
    });

    request.setTimeout(5000, () => {
      request.destroy(new Error("Google token verification timed out."));
    });
  });
};

export const verifyGoogleIdToken = async (idToken) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    const error = new Error("Google authentication is not configured.");
    error.code = "GOOGLE_CONFIG_MISSING";
    throw error;
  }

  const payload = await requestGoogleTokenInfo(idToken);

  if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
    const error = new Error("Google token audience mismatch.");
    error.code = "GOOGLE_AUDIENCE_MISMATCH";
    throw error;
  }

  if (payload.email_verified !== "true" && payload.email_verified !== true) {
    const error = new Error("Google email is not verified.");
    error.code = "GOOGLE_EMAIL_UNVERIFIED";
    throw error;
  }

  if (!payload.email) {
    const error = new Error("Google account did not provide an email.");
    error.code = "GOOGLE_EMAIL_MISSING";
    throw error;
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    emailVerified: true,
    name: payload.name,
    picture: payload.picture,
  };
};
