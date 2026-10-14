type SendWelcomeEmailArgs = {
  to: string;
  name: string;
  courseTitle?: string;
  claimUrl: string;
};

export async function sendWelcomeAccessEmail({
  to,
  name,
  courseTitle = "AI Build Sprint",
  claimUrl,
}: SendWelcomeEmailArgs): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND;

  if (!apiKey) {
    console.warn("[ONBOARDING] RESEND_API_KEY is not configured on the server. Email delivery simulated.");
    return { success: true, messageId: `sim_${Date.now()}` };
  }

  const configuredFrom = process.env.RESEND_FROM_EMAIL || "Vibe Logic Studio <access@vibelogic.studio>";
  const fallbackFrom = "Vibe Logic Studio <onboarding@resend.dev>";

  const subject = "Your Vibe Logic Studio Dashboard Access";

  const plainText = `Hi ${name},

Welcome to Vibe Logic Studio.

Your bootcamp registration is confirmed for ${courseTitle}.

You can now access your personal student dashboard:

ACCESS MY DASHBOARD:
${claimUrl}

Dashboard:
${claimUrl}

Your dashboard contains:
• Class schedule
• Meeting links
• Recordings
• Study materials
• Assignments
• Course progress
• Important announcements

Your account email:
${to}

For your security, we never send passwords in plain text. Please use the secure dashboard access link above to set your password and access your account.

Thanks,
Vibe Logic Studio
`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F3; margin: 0; padding: 32px 16px; color: #171717;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #E6E2DC; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    <!-- Header Badge -->
    <tr>
      <td style="padding: 36px 36px 12px 36px;">
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; color: #FF5722; background: rgba(255,87,34,0.08); padding: 5px 12px; border-radius: 999px; border: 1px solid rgba(255,87,34,0.18); display: inline-block;">
          Registration Confirmed
        </span>
        <h1 style="font-size: 24px; font-weight: 800; margin: 16px 0 0 0; color: #171717; letter-spacing: -0.02em;">
          Welcome to Vibe Logic Studio
        </h1>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 12px 36px 24px 36px; font-size: 15px; line-height: 1.65; color: #333333;">
        <p style="margin: 0 0 16px 0;">Hi <strong>${name}</strong>,</p>
        <p style="margin: 0 0 16px 0;">Welcome to Vibe Logic Studio.</p>
        <p style="margin: 0 0 24px 0;">Your bootcamp registration is confirmed for <strong>${courseTitle}</strong>.</p>
        <p style="margin: 0 0 20px 0;">You can now access your personal student dashboard:</p>

        <!-- CTA Button -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0 28px 0;">
          <tr>
            <td align="center">
              <a href="${claimUrl}" style="background-color: #FF5722; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 15px 36px; border-radius: 999px; display: inline-block; box-shadow: 0 3px 12px rgba(255,87,34,0.3);">
                ACCESS MY DASHBOARD →
              </a>
            </td>
          </tr>
        </table>

        <!-- Direct Dashboard URL -->
        <div style="background-color: #F8F6F1; border-radius: 12px; padding: 14px 18px; border: 1px solid #ECE7DF; margin-bottom: 24px; word-break: break-all;">
          <span style="font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">Dashboard:</span>
          <a href="${claimUrl}" style="color: #FF5722; font-size: 13px; text-decoration: underline; font-family: monospace;">${claimUrl}</a>
        </div>

        <!-- Dashboard Inclusions Checklist -->
        <div style="background-color: #FFFFFF; border-radius: 14px; padding: 18px 20px; border: 1px solid #E6E2DC; margin-bottom: 24px;">
          <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #525252; margin: 0 0 10px 0;">
            Your dashboard contains:
          </p>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #404040; line-height: 1.75;">
            <li>Class schedule</li>
            <li>Meeting links</li>
            <li>Recordings</li>
            <li>Study materials</li>
            <li>Assignments</li>
            <li>Course progress</li>
            <li>Important announcements</li>
          </ul>
        </div>

        <!-- Account Email -->
        <div style="background-color: #F8F6F1; border-radius: 12px; padding: 14px 18px; border: 1px solid #ECE7DF; margin-bottom: 24px;">
          <span style="font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">Your account email:</span>
          <span style="font-size: 14px; font-weight: 700; color: #171717;">${to}</span>
        </div>

        <p style="font-size: 12px; line-height: 1.6; color: #737373; margin: 0 0 20px 0;">
          <strong>Security note:</strong> For your security, we never send passwords in plain text. Use the secure link above to set your password and access your account.
        </p>

        <p style="margin: 28px 0 0 0; font-size: 14px; color: #171717;">
          Thanks,<br>
          <strong>Vibe Logic Studio</strong>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 36px 28px 36px; border-top: 1px solid #E6E2DC; background-color: #FAFAFA; text-align: center;">
        <p style="font-size: 11px; color: #A3A3A3; margin: 0;">
          © 2026 Vibe Logic Studio · Think it. Build it. Ship it.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Internal helper to post to Resend
  async function executeSend(sender: string) {
    return await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: sender,
        to: [to],
        subject,
        text: plainText,
        html,
      }),
    });
  }

  try {
    let res = await executeSend(configuredFrom);
    let data = await res.json();

    // If 403 domain unverified error occurs on custom domain, attempt automatic fallback to onboarding@resend.dev
    if (!res.ok && res.status === 403 && configuredFrom !== fallbackFrom) {
      console.warn(
        `[ONBOARDING] Resend 403 on ${configuredFrom}: ${data.message}. Retrying via fallback sender ${fallbackFrom}...`
      );
      res = await executeSend(fallbackFrom);
      data = await res.json();
    }

    if (!res.ok) {
      const errorMsg = data.message || `Resend delivery failed (Status: ${res.status})`;
      console.error("[ONBOARDING] Email failed:", errorMsg);
      return { success: false, error: errorMsg };
    }

    console.log(`[ONBOARDING] Email sent successfully to ${to} (ID: ${data.id})`);
    return { success: true, messageId: data.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error during email dispatch";
    console.error("[ONBOARDING] Email failed:", msg);
    return { success: false, error: msg };
  }
}

