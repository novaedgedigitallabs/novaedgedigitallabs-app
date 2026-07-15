const sendEmail = require('./sendEmail');

/**
 * Send a welcome email to the newly registered user
 * @param {Object} params
 * @param {Object} params.user - The user object (name, email, referralCode)
 */
const sendWelcomeEmail = async ({ user }) => {
    const subject = `Welcome to NovaEdge, ${user.name}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f3f4f6;
                margin: 0;
                padding: 40px 20px;
                color: #1f2937;
            }
            .welcome-card {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                overflow: hidden;
                border: 1px solid #e5e7eb;
            }
            .header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                padding: 32px;
                text-align: center;
                color: #ffffff;
            }
            .header img {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                margin-bottom: 12px;
                background-color: #ffffff;
                padding: 6px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            .content {
                padding: 32px;
                line-height: 1.6;
            }
            .greeting {
                font-size: 18px;
                font-weight: bold;
                color: #4f46e5;
                margin-bottom: 16px;
            }
            .feature-list {
                background-color: #f9fafb;
                border-radius: 8px;
                padding: 20px;
                margin: 24px 0;
                border: 1px solid #f3f4f6;
            }
            .feature-item {
                margin-bottom: 14px;
                font-size: 14px;
            }
            .feature-item strong {
                color: #374151;
            }
            .referral-box {
                background: linear-gradient(to right, #e0e7ff, #f3e8ff);
                border-left: 4px solid #7c3aed;
                padding: 20px;
                border-radius: 8px;
                margin: 24px 0;
                text-align: center;
            }
            .referral-code {
                font-size: 24px;
                font-weight: 800;
                color: #4f46e5;
                letter-spacing: 2px;
                margin: 12px 0;
            }
            .footer {
                text-align: center;
                padding: 24px;
                background-color: #f9fafb;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
            }
        </style>
    </head>
    <body>
        <div class="welcome-card">
            <div class="header">
                <img src="cid:logo" alt="NovaEdge Logo" />
                <h1>Welcome to NovaEdge</h1>
            </div>
            <div class="content">
                <p class="greeting">Hello ${user.name},</p>
                <p>Thanks for creating an account on NovaEdge. You now have access to our developer and business suite.</p>
                
                <div class="feature-list">
                    <h3 style="margin-top: 0; color: #1f2937;">Available Features:</h3>
                    <div class="feature-item"><strong>Academy Courses</strong>: Access specialized courses to learn technical and business skills.</div>
                    <div class="feature-item"><strong>Job Board</strong>: Search and apply for active job listings, or post job openings to hire talent.</div>
                    <div class="feature-item"><strong>Digital Marketplace</strong>: Buy and sell developer assets, templates, and find freelance gigs.</div>
                    <div class="feature-item"><strong>Studio Services</strong>: Request custom web development, app creation, and custom software solutions.</div>
                    <div class="feature-item"><strong>Utility Tools</strong>: Access a variety of tools like QR Code Generator, GST/EMI Calculators, Image Compressor, JSON Formatter, and Base64 Converter.</div>
                </div>

                <div class="referral-box">
                    <h3 style="margin: 0; color: #374151;">Your Referral Code</h3>
                    <div class="referral-code">${user.referralCode}</div>
                    <p style="margin: 0; font-size: 13px; color: #4b5563;">You can share this code with others. When they sign up, both of you will receive 50 credits.</p>
                </div>

                <p>If you have any questions or feedback, you can reach us at app@novaedgedigitallabs.in.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} NovaEdge Digital Labs. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const message = `Welcome to NovaEdge, ${user.name}\n\nThanks for creating an account. Here are the features you can access:\n- Academy Courses: Learn technical and business skills.\n- Job Board: Find jobs or hire talent.\n- Digital Marketplace: Buy/sell assets and find freelance gigs.\n- Studio Services: Request custom web and app development.\n- Utility Tools: QR Code Generator, GST/EMI Calculators, Image Compressor, JSON and developer tools.\n\nYour Referral Code: ${user.referralCode}\nShare it with others to receive 50 credits.\n\nIf you have any questions, contact us at app@novaedgedigitallabs.in`;

    // Send the welcome email
    return await sendEmail({
        email: user.email,
        subject,
        message,
        html: htmlContent,
        attachments: [{
            filename: 'logo.png',
            path: '/home/amit/old_data/Development/myProject/novaedge-digital-labs-app/frontend/assets/icon.png',
            cid: 'logo'
        }]
    });
};

module.exports = sendWelcomeEmail;
