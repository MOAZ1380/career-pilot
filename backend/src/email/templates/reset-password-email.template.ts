/**
 * Email template for password reset OTP
 * Used when user requests password reset
 */
export class ResetPasswordEmailTemplate {
  static getHtml(
    userName: string,
    otp: string,
    expirationMinutes: number = 10,
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            line-height: 1.6;
            color: #333;
          }
          
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
          }
          
          .otp-section {
            background-color: #f8f9fa;
            border-left: 4px solid #f5576c;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
          }
          
          .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: #f5576c;
            text-align: center;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
          }
          
          .otp-note {
            font-size: 13px;
            color: #666;
            text-align: center;
            margin-top: 10px;
          }
          
          .expiration {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 14px;
            text-align: center;
          }
          
          .security-section {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 13px;
          }
          
          .security-section strong {
            display: block;
            margin-bottom: 8px;
          }
          
          .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
          }
          
          .footer a {
            color: #f5576c;
            text-decoration: none;
          }
          
          .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CareerPilot</h1>
            <p>Password Reset Request</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              <p>Hi ${this.escapeHtml(userName)},</p>
              <p style="margin-top: 10px;">We received a request to reset your password. Use the code below to proceed with your password reset:</p>
            </div>
            
            <div class="otp-section">
              <p style="text-align: center; color: #666; margin-bottom: 15px;">Your password reset code:</p>
              <div class="otp-code">${otp}</div>
              <div class="otp-note">This code is valid for ${expirationMinutes} minutes</div>
            </div>
            
            <div class="expiration">
              ⏱️ This reset code expires in ${expirationMinutes} minutes
            </div>
            
            <p style="margin: 20px 0;">
              If you did not request a password reset, no action is needed. Your account remains secure and your password will not be changed.
            </p>
            
            <div class="security-section">
              <strong>🔒 Important Security Information:</strong>
              <ul style="margin-left: 20px; margin-top: 8px;">
                <li>Never share this reset code with anyone</li>
                <li>Our team will never ask for this code</li>
                <li>Always reset your password through our secure link</li>
                <li>If you didn't request this, your account may be compromised. Change your password immediately</li>
              </ul>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 13px; color: #999;">
              Questions? Contact our support team at <a href="mailto:support@careerpilot.com" style="color: #f5576c;">support@careerpilot.com</a>
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CareerPilot. All rights reserved.</p>
            <p style="margin-top: 10px;">
              <a href="https://careerpilot.com">Visit CareerPilot</a> • 
              <a href="https://careerpilot.com/privacy">Privacy Policy</a> • 
              <a href="https://careerpilot.com/terms">Terms of Service</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static getText(
    userName: string,
    otp: string,
    expirationMinutes: number = 10,
  ): string {
    return `
CareerPilot - Password Reset Request

Hi ${userName},

We received a request to reset your password. Use the code below to proceed:

${otp}

This code is valid for ${expirationMinutes} minutes.

---

IMPORTANT SECURITY INFORMATION:
- Never share this reset code with anyone
- Our team will never ask for this code
- If you did not request this reset, your account may be compromised
- Immediately change your password to protect your account

---

Need help? Contact us at: support@careerpilot.com

Best regards,
CareerPilot Team
    `.trim();
  }

  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
