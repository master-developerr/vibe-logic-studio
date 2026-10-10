type SendWelcomeEmailArgs = {
  to: string;
  name: string;
  courseTitle: string;
  claimUrl: string;
};

export async function sendWelcomeAccessEmail({
  to,
  name,
  courseTitle,
  claimUrl,
}: SendWelcomeEmailArgs): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND;

  if (!apiKey) {
    console.warn("[Resend] RESEND_API_KEY is not configured on the server. Email delivery simulated.");
    return { success: true, messageId: `sim_${Date.now()}` };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "VibeLogic Studio <access@vibelogic.studio>";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Course Access — VibeLogic Studio</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF7F3; margin: 0; padding: 40px 20px; color: #0D0D0D;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E6E2DC; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    <div style="margin-bottom: 24px;">
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #FF5A1F;">Payment Confirmed</span>
      <h1 style="font-size: 24px; font-weight: 800; margin: 8px 0 0 0; color: #0D0D0D;">Welcome to ${courseTitle}!</h1>
    </div>
    
    <p style="font-size: 15px; line-height: 1.6; color: #404040; margin-bottom: 24px;">
      Hello ${name},<br><br>
      Your payment has been successfully verified. To access your classroom, live cohort schedules, and course materials, click the link below to set up or sign in to your student account.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${claimUrl}" style="background-color: #FF5A1F; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 9999px; display: inline-block; box-shadow: 0 2px 8px rgba(255, 90, 31, 0.25);">
        Access Your Dashboard & Cohort →
      </a>
    </div>

    <div style="background-color: #FAF7F3; border-radius: 12px; padding: 16px; font-size: 12px; color: #737373; line-height: 1.5; margin-top: 32px;">
      <strong>Security note:</strong> For your security, this claim link requires that you sign in or register with the same email address (<strong>${to}</strong>) used during checkout.
    </div>

    <hr style="border: none; border-top: 1px solid #E6E2DC; margin: 32px 0 20px 0;">
    <p style="font-size: 11px; color: #A3A3A3; text-align: center; margin: 0;">
      © 2026 VibeLogic Studio · Build software with AI
    </p>
  </div>
</body>
</html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: `Your Course Access: ${courseTitle} — VibeLogic Studio`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Resend] API Error:", data);
      return { success: false, error: data.message || "Failed to deliver email" };
    }

    return { success: true, messageId: data.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.error("[Resend] Network Error:", msg);
    return { success: false, error: msg };
  }
}
