require('dotenv').config();
const sendEmail = require('./src/utils/sendEmail');
async function test() {
    await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: 'Test Notification',
        html: '<p>This is a test email to verify backend notifications are working.</p>'
    });
}
test();
