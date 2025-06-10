"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorHealthCheck = exports.monitorError = exports.monitorPushNotification = void 0;
const winston_1 = require("winston");
// Set up monitoring logger
const monitoringLogger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.File({ filename: "monitoring.log" }),
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
        })
    ],
    exceptionHandlers: [
        new winston_1.transports.File({ filename: "exceptions.log" })
    ]
});
const monitorPushNotification = async (result) => {
    try {
        monitoringLogger.info("Push notification metrics", {
            success: result.success,
            timestamp: result.timestamp,
            platform: result.platform,
            token: result.token,
            result: result.result
        });
    }
    catch (error) {
        monitoringLogger.error("Error monitoring push notification", {
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString()
        });
    }
};
exports.monitorPushNotification = monitorPushNotification;
const monitorError = (error, context = {}) => {
    monitoringLogger.error("Application error", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        ...context
    });
};
exports.monitorError = monitorError;
// Add health check monitoring
const monitorHealthCheck = async (status) => {
    monitoringLogger.info("Health check", {
        status,
        timestamp: new Date().toISOString()
    });
};
exports.monitorHealthCheck = monitorHealthCheck;
