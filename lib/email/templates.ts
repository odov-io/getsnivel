/**
 * Email Templates
 * HTML templates for transactional emails with Snivel branding
 */

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .card {
    background: white;
    border-radius: 8px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .logo {
    color: #111827;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
    letter-spacing: -0.5px;
  }
  h1 {
    color: #111;
    font-size: 20px;
    margin: 0 0 16px 0;
  }
  p {
    color: #555;
    margin: 0 0 16px 0;
  }
  .button {
    display: inline-block;
    background: #111827;
    color: white !important;
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    margin: 8px 0 24px 0;
  }
  .button:hover {
    background: #000;
  }
  .footer {
    color: #888;
    font-size: 13px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #eee;
  }
  .expires {
    color: #888;
    font-size: 13px;
  }
  .org-name {
    color: #111827;
    font-weight: 600;
  }
`;

/**
 * Org admin login email
 */
export function orgLoginEmail(params: {
  loginUrl: string;
  orgName: string;
  expiresIn: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to SNIVEL</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">SNIVEL</div>
      <h1>Sign in to <span class="org-name">${params.orgName}</span></h1>
      <p>Click the button below to sign in to your organization dashboard.</p>
      <a href="${params.loginUrl}" class="button">Sign In</a>
      <p class="expires">This link expires in ${params.expiresIn}.</p>
      <div class="footer">
        <p>If you didn't request this email, you can safely ignore it.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * New signup email
 */
export function signupEmail(params: {
  signupUrl: string;
  expiresIn: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete your SNIVEL signup</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">SNIVEL</div>
      <h1>Complete Your Signup</h1>
      <p>Click the button below to finish setting up your organization on SNIVEL.</p>
      <a href="${params.signupUrl}" class="button">Complete Signup</a>
      <p class="expires">This link expires in ${params.expiresIn}.</p>
      <div class="footer">
        <p>If you didn't start this signup, you can safely ignore this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * User invite email
 */
export function userInviteEmail(params: {
  inviteUrl: string;
  userName: string;
  orgName: string;
  expiresIn: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're invited to ${params.orgName}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">SNIVEL</div>
      <h1>You're Invited!</h1>
      <p>Hi ${params.userName},</p>
      <p>You've been invited to join <span class="org-name">${params.orgName}</span> on SNIVEL. Click the button below to accept the invitation and set up your account.</p>
      <a href="${params.inviteUrl}" class="button">Accept Invitation</a>
      <p class="expires">This invitation expires in ${params.expiresIn}.</p>
      <div class="footer">
        <p>If you weren't expecting this invitation, you can safely ignore it.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ============================================================
// Booking Email Templates
// ============================================================

const bookingStyles = `
  ${baseStyles}
  .meeting-details {
    background: #f9fafb;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  .meeting-time {
    font-size: 18px;
    font-weight: 600;
    color: #111;
    margin-bottom: 8px;
  }
  .meeting-date {
    color: #555;
    margin-bottom: 4px;
  }
  .meeting-link {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }
  .meeting-link a {
    color: #2563eb;
    text-decoration: underline;
  }
  .attendee {
    color: #666;
    font-size: 14px;
  }
  .notes {
    background: #fefce8;
    border-left: 4px solid #eab308;
    padding: 12px 16px;
    margin: 16px 0;
    font-size: 14px;
    color: #713f12;
  }
`;

/**
 * Booking confirmation email for the booker (guest)
 */
export function bookingConfirmationEmail(params: {
  bookerName: string;
  hostName: string;
  orgName: string;
  date: string;
  time: string;
  duration: string;
  timezone: string;
  meetingLink?: string;
  manageUrl: string;
  notes?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
  <style>${bookingStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">SNIVEL</div>
      <h1>Booking Confirmed!</h1>
      <p>Hi ${params.bookerName},</p>
      <p>Your meeting with <strong>${params.hostName}</strong> at <span class="org-name">${params.orgName}</span> has been confirmed.</p>

      <div class="meeting-details">
        <div class="meeting-date">${params.date}</div>
        <div class="meeting-time">${params.time} (${params.duration})</div>
        <div class="attendee">${params.timezone}</div>
        ${params.meetingLink ? `
        <div class="meeting-link">
          <strong>Join meeting:</strong><br>
          <a href="${params.meetingLink}">${params.meetingLink}</a>
        </div>
        ` : ''}
      </div>

      ${params.notes ? `
      <div class="notes">
        <strong>Your notes:</strong><br>
        ${params.notes}
      </div>
      ` : ''}

      <a href="${params.manageUrl}" class="button">Manage Booking</a>

      <div class="footer">
        <p>Need to make changes? Click the button above to cancel or reschedule.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * New booking notification email for the host
 */
export function newBookingNotificationEmail(params: {
  hostName: string;
  bookerName: string;
  bookerEmail: string;
  orgName: string;
  date: string;
  time: string;
  duration: string;
  timezone: string;
  meetingLink?: string;
  notes?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking</title>
  <style>${bookingStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">SNIVEL</div>
      <h1>New Booking!</h1>
      <p>Hi ${params.hostName},</p>
      <p>You have a new booking from <strong>${params.bookerName}</strong> (${params.bookerEmail}).</p>

      <div class="meeting-details">
        <div class="meeting-date">${params.date}</div>
        <div class="meeting-time">${params.time} (${params.duration})</div>
        <div class="attendee">${params.timezone}</div>
        ${params.meetingLink ? `
        <div class="meeting-link">
          <strong>Meeting link:</strong><br>
          <a href="${params.meetingLink}">${params.meetingLink}</a>
        </div>
        ` : ''}
      </div>

      ${params.notes ? `
      <div class="notes">
        <strong>Notes from ${params.bookerName}:</strong><br>
        ${params.notes}
      </div>
      ` : ''}

      <div class="footer">
        <p>This meeting has been added to your calendar.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Booking cancelled email
 */
export function bookingCancelledEmail(params: {
  recipientName: string;
  otherPartyName: string;
  date: string;
  time: string;
  cancelledBy: "host" | "booker";
}): string {
  const canceller = params.cancelledBy === "host" ? params.otherPartyName : "You";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled</title>
  <style>${bookingStyles}</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">SNIVEL</div>
      <h1>Booking Cancelled</h1>
      <p>Hi ${params.recipientName},</p>
      <p>${canceller} cancelled the meeting scheduled for:</p>

      <div class="meeting-details">
        <div class="meeting-date">${params.date}</div>
        <div class="meeting-time">${params.time}</div>
      </div>

      <div class="footer">
        <p>This event has been removed from your calendar.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
