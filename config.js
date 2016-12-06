module.exports =
{
    API_URL: 'http://localhost:8080/',

    /**
     * Google config
     */
    GOOGLE_OAUTH2_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    GOOGLE_REDIRECT_URI: 'http://localhost:8080/login/google/callback',
    GOOGLE_CLIENT_ID: '651507887620-bt5a0apbbfjii1pfpr8kvrumurcs8ush.apps.googleusercontent.com',
    // Secret in plain view is wrong
    GOOGLE_CLIENT_SECRET: 'ct2ku0Y2BqQqdjgYvUybLFap',
    // The base endpoint for token retrieval.
    GOOGLE_OAUTH2_TOKEN_URL: 'https://www.googleapis.com/oauth2/v4/token',

    /**
     * Github config
     */
    GITHUB_OAUTH2_URL: 'https://github.com/login/oauth/authorize',
    GITHUB_REDIRECT_URI: 'http://localhost:8080/login/github/callback',
    GITHUB_CLIENT_ID: '762c2a6bfcbc27cff09c',
    // Secret in plain view is wrong
    GITHUB_CLIENT_SECRET: 'a530b7a1e35ff51c720431bd2845c1cfbd2a13ce',
    // The base endpoint for token retrieval.
    GITHUB_OAUTH2_TOKEN_URL: 'https://github.com/login/oauth/access_token',
}
