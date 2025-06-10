import * as apn from 'apn';
import * as fs from 'fs';

// Define types directly in this file
interface PushNotificationRequest {
  token: string;
  title: string;
  body: string;
  data: Record<string, any>;
  platform: string;
}

interface PushNotificationResult {
  success: boolean;
  token: string;
  platform: string;
  timestamp: string;
  result: any;
}

export class PushNotificationHandler {
  private apnProvider: apn.Provider;
  private retryDelay = 1000; // 1 second

constructor() {
  try {
    // Read certificate files
    const keyPath = process.env.APN_AUTH_KEY_PATH;
    const keyId = process.env.APN_KEY_ID;
    const teamId = process.env.APN_TEAM_ID;
    const bundleId = process.env.IOS_BUNDLE_ID;

    if (!keyPath || !keyId || !teamId || !bundleId) {
      throw new Error('Missing required APNs configuration');
    }

    // Log configuration
    console.log('APNs Configuration:');
    console.log('  Key Path:', keyPath);
    console.log('  Key ID:', keyId);
    console.log('  Team ID:', teamId);
    console.log('  Bundle ID:', bundleId);
    console.log('  Environment:', process.env.NODE_ENV);

    // Read the auth key
    const key = fs.readFileSync(keyPath, 'utf8');

    // Initialize APNs provider with JWT
    this.apnProvider = new apn.Provider({
      token: {
        key: key,
        keyId: keyId,
        teamId: teamId
      },
      production: process.env.NODE_ENV === 'production',
      rejectUnauthorized: true
    });

    console.log('APNs provider initialized successfully');
  } catch (error) {
    console.error('Failed to initialize APNs provider:', error);
    throw error;
  }
}

  private async testConnection(): Promise<void> {
    try {
      const testNotification = new apn.Notification({
        alert: 'Test connection',
        topic: process.env.IOS_BUNDLE_ID,
        priority: 10,
        expiration: Math.floor(Date.now() / 1000) + 3600,
        sound: 'default'
      });
  
      const testToken = process.env.TEST_DEVICE_TOKEN;
      if (!testToken) {
        throw new Error('Test device token not configured');
      }
      console.log('Testing APNs connection with token:', testToken);
  
      const result = await this.apnProvider.send(testNotification, testToken);
      if (result.failed && result.failed.length > 0) {
        console.error('APNs connection test failed:', result.failed[0].error);
        throw new Error('Failed to connect to APNs');
      }
      console.log('APNs connection test successful');
    } catch (connectionError) {
      console.error('APNs connection test failed:', connectionError);
      throw new Error('Failed to connect to APNs');
    }
  }

  private async validateRequest(request: PushNotificationRequest): Promise<void> {
    if (!request.token || !request.title || !request.body || !request.platform) {
      throw new Error('Missing required fields');
    }

    if (request.platform !== 'ios') {
      throw new Error('Only iOS platform is supported');
    }

    if (typeof request.data !== 'object') {
      throw new Error('Data must be an object');
    }
  }

  public async sendNotification(request: PushNotificationRequest): Promise<PushNotificationResult> {
    try {
      // Validate request
      await this.validateRequest(request);
  
      // Create notification
      const notification = new apn.Notification({
        alert: {
          title: request.title,
          body: request.body
        },
        topic: process.env.IOS_BUNDLE_ID,
        priority: 10,
        expiration: Math.floor(Date.now() / 1000) + 3600,
        sound: 'default',
        payload: {
          ...request.data,
          aps: {
            category: "default",
            contentAvailable: 1,
            mutableContent: 1
          }
        }
      });
  
      // Send notification
      const result = await this.apnProvider.send(notification, request.token);
  
      return {
        success: result.sent.length > 0,
        token: request.token,
        platform: request.platform,
        timestamp: new Date().toISOString(),
        result: {
          sent: result.sent,
          failed: result.failed
        }
      };
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }
}