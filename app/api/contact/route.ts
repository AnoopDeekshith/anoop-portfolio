import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Use Resend if API key is configured, otherwise return mailto fallback
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      const { error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "anoopdeekshith.ece@gmail.com",
        replyTo: email,
        subject: `Portfolio inquiry from ${name}`,
        html: `
          <div style="font-family:monospace;background:#0A0A0F;color:#E8EAF0;padding:24px;border:1px solid #00FF88;">
            <div style="color:#00FF88;font-size:12px;margin-bottom:16px;">// NEW CONTACT VIA PORTFOLIO</div>
            <div style="margin-bottom:8px;"><span style="color:#4A9EFF;">FROM:</span> ${name} &lt;${email}&gt;</div>
            <div style="margin-bottom:16px;border-top:1px solid #1E2A3A;padding-top:16px;color:#E8EAF0;">${message.replace(/\n/g, "<br/>")}</div>
            <div style="color:#8899AA;font-size:10px;">Sent via anoopdeekshith.com/contact</div>
          </div>
        `,
      });

      if (error) {
        return NextResponse.json({ error: "Failed to send" }, { status: 500 });
      }

      return NextResponse.json({ ok: true });
    }

    // No API key — return mailto fallback URL for client to open
    const mailto = `mailto:anoopdeekshith.ece@gmail.com?subject=${encodeURIComponent(
      `Portfolio inquiry from ${name}`
    )}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;

    return NextResponse.json({ ok: true, mailto });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
