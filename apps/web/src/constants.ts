const oAuthGoogleUrl =
  process.env.NODE_ENV === "production"
    ? "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fapi.2048vs.com%2Foauth%2Fgoogle&client_id=482391058353-k88vp1pp8at0tmufhoiljh8ukc1epjup.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email"
    : "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Foauth%2Fgoogle&client_id=482391058353-k88vp1pp8at0tmufhoiljh8ukc1epjup.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email"

export default {
  oAuthGoogleUrl,
}
