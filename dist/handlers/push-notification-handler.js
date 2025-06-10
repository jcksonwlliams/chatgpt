"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationHandler = void 0;
const apn = __importStar(require("apn"));
const fs = __importStar(require("fs"));
class PushNotificationHandler {
    constructor() {
        this.retryDelay = 1000; // 1 second
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
        }
        catch (error) {
            console.error('Failed to initialize APNs provider:', error);
            throw error;
        }
    }
    async testConnection() {
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
        }
        catch (connectionError) {
            console.error('APNs connection test failed:', connectionError);
            throw new Error('Failed to connect to APNs');
        }
    }
    async validateRequest(request) {
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
    async sendNotification(request) {
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
        }
        catch (error) {
            console.error('Failed to send notification:', error);
            throw error;
        }
    }
}
exports.PushNotificationHandler = PushNotificationHandler;
