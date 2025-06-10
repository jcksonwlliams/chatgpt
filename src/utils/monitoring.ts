import { PushNotificationResult } from "../types";
import { createLogger, format, transports } from "winston";

// Set up monitoring logger
const monitoringLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "monitoring.log" }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: "exceptions.log" })
  ]
});

export const monitorPushNotification = async (result: PushNotificationResult) => {
  try {
    monitoringLogger.info("Push notification metrics", {
      success: result.success,
      timestamp: result.timestamp,
      platform: result.platform,
      token: result.token,
      result: result.result
    });
  } catch (error) {
    monitoringLogger.error("Error monitoring push notification", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
};

export const monitorError = (error: Error, context: any = {}) => {
  monitoringLogger.error("Application error", {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  });
};

// Add health check monitoring
export const monitorHealthCheck = async (status: string) => {
  monitoringLogger.info("Health check", {
    status,
    timestamp: new Date().toISOString()
  });
};
