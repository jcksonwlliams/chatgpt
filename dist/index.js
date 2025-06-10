"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const auth_1 = require("./middleware/auth");
const push_notification_handler_1 = require("./handlers/push-notification-handler");
const cors_1 = __importDefault(require("cors"));
// Load environment variables
dotenv_1.default.config({ path: '.env.production' });
// Log environment variables to verify they're loaded
console.log('Environment Variables:');
console.log('APN_AUTH_KEY_PATH:', process.env.APN_AUTH_KEY_PATH);
console.log('APN_KEY_ID:', process.env.APN_KEY_ID);
console.log('APN_TEAM_ID:', process.env.APN_TEAM_ID);
console.log('IOS_BUNDLE_ID:', process.env.IOS_BUNDLE_ID);
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const pushNotificationHandler = new push_notification_handler_1.PushNotificationHandler();
app.post('/api/send-notification', auth_1.authenticateRequest, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
