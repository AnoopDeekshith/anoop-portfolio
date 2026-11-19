"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1.5 w-full border border-rule bg-bg px-3 py-2.5 text-fg outline-none transition-colors focus:border-fg";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      // No email service configured — hand off to the visitor's mail app
      if (json.mailto) window.location.href = json.mailto;
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-rule p-8">
        <p className="font-display text-2xl font-bold">Thanks — message received.</p>
        <p className="mt-2 text-muted">I&apos;ll get back to you soon.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm underline underline-offset-4">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset>
        <legend className="text-sm font-bold">Name</legend>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            First Name <span className="text-faint">(required)</span>
            <input name="firstName" required autoComplete="given-name" className={field} />
          </label>
          <label className="block text-sm">
            Last Name <span className="text-faint">(required)</span>
            <input name="lastName" required autoComplete="family-name" className={field} />
          </label>
        </div>
      </fieldset>
      <label className="block text-sm">
        Email <span className="text-faint">(required)</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block text-sm">
        Message <span className="text-faint">(required)</span>
        <textarea name="message" required rows={6} className={`${field} resize-y`} />
      </label>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-fg px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        {status === "error" && (
          <p role="alert" className="text-sm text-danger">
            Something went wrong — please email me directly.
          </p>
        )}
      </div>
    </form>
  );
}
