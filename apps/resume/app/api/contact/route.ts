import { NextRequest, NextResponse } from "next/server";
import { profile } from "@anoop/content";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const firstName = String(body.firstName ?? "").trim().slice(0, 100);
    const lastName = String(body.lastName ?? "").trim().slice(0, 100);
    const email = String(body.email ?? "").trim().slice(0, 200);
    const message = String(body.message ?? "").trim().slice(0, 5000);
    const name = `${firstName} ${lastName}`.trim();

    if (!firstName || !lastName || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const subject = `Website inquiry from ${name}`;
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      const { Resend } = await import("resend");
      const { error } = await new Resend(apiKey).emails.send({
        from: "Website Contact <onboarding@resend.dev>",
        to: profile.email,
        replyTo: email,
        subject,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
      });
      if (error) {
        return NextResponse.json({ error: "Failed to send" }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    }

    // No email service configured — the client opens a prefilled mail draft instead
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `From: ${name} <${email}>\n\n${message}`
    )}`;
    return NextResponse.json({ ok: true, mailto });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
