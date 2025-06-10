import dotenv from 'dotenv';
import express from 'express';
import { authenticateRequest } from './middleware/auth';
import { PushNotificationHandler } from './handlers/push-notification-handler';
import cors from 'cors';

// Load environment variables
dotenv.config({ path: '.env.production' });

// Log environment variables to verify they're loaded
console.log('Environment Variables:');
console.log('APN_AUTH_KEY_PATH:', process.env.APN_AUTH_KEY_PATH);
console.log('APN_KEY_ID:', process.env.APN_KEY_ID);
console.log('APN_TEAM_ID:', process.env.APN_TEAM_ID);
console.log('IOS_BUNDLE_ID:', process.env.IOS_BUNDLE_ID);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pushNotificationHandler = new PushNotificationHandler();

app.post('/api/send-notification', authenticateRequest, async (req, res) => {
  try {
    const { token, title, body, data, platform } = req.body;
    
    if (!token || !title || !body || !platform) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const request = {
      token,
      title,
      body,
      data: data || {},
      platform
    };

    const result = await pushNotificationHandler.sendNotification(request);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});