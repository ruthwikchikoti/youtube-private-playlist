const { google } = require('googleapis');
require('dotenv').config();

class YouTubeConfig {
  constructor() {
    this.youtube = google.youtube('v3');
    this.apiKey = process.env.YOUTUBE_API_KEY;
    
    this.oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );
  }

  getAuthenticatedClient() {
    return this.youtube;
  }

  getAPIKey() {
    return this.apiKey;
  }

  getOAuth2Client() {
    return this.oauth2Client;
  }
}

module.exports = new YouTubeConfig();