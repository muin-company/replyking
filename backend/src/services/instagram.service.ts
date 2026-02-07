import axios from 'axios';

export interface InstagramComment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  from: {
    id: string;
    username: string;
  };
}

export class InstagramService {
  private baseUrl = 'https://graph.instagram.com';

  async getRecentComments(accessToken: string, mediaId?: string): Promise<InstagramComment[]> {
    try {
      // If no mediaId, get recent media first
      if (!mediaId) {
        const mediaResponse = await axios.get(`${this.baseUrl}/me/media`, {
          params: {
            access_token: accessToken,
            fields: 'id,caption,media_type,timestamp'
          }
        });

        if (!mediaResponse.data.data || mediaResponse.data.data.length === 0) {
          return [];
        }

        mediaId = mediaResponse.data.data[0].id;
      }

      // Get comments for the media
      const commentsResponse = await axios.get(`${this.baseUrl}/${mediaId}/comments`, {
        params: {
          access_token: accessToken,
          fields: 'id,username,text,timestamp,from'
        }
      });

      return commentsResponse.data.data || [];
    } catch (error: any) {
      console.error('Error fetching Instagram comments:', error.response?.data || error.message);
      throw new Error(`Failed to fetch comments: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async getAllRecentComments(accessToken: string, limit: number = 5): Promise<InstagramComment[]> {
    try {
      // Get recent media
      const mediaResponse = await axios.get(`${this.baseUrl}/me/media`, {
        params: {
          access_token: accessToken,
          fields: 'id,caption,media_type,timestamp',
          limit
        }
      });

      const mediaItems = mediaResponse.data.data || [];
      const allComments: InstagramComment[] = [];

      // Fetch comments for each media item
      for (const media of mediaItems) {
        try {
          const comments = await this.getRecentComments(accessToken, media.id);
          allComments.push(...comments);
        } catch (error) {
          console.error(`Error fetching comments for media ${media.id}:`, error);
        }
      }

      return allComments;
    } catch (error: any) {
      console.error('Error fetching all Instagram comments:', error.response?.data || error.message);
      throw new Error(`Failed to fetch all comments: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async getUserProfile(accessToken: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,username,account_type,media_count'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching Instagram profile:', error.response?.data || error.message);
      throw new Error(`Failed to fetch profile: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
