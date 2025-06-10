export interface PushNotificationRequest {
  token: string;
  title: string;
  body: string;
  data: Record<string, any>;
  platform: string;
}

export interface PushNotificationResult {
  success: boolean;
  token: string;
  platform: string;
  timestamp: string;
  result: any; // Simplified for now
}