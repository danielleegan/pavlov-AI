function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export async function onRequestPost({ request, env }) {
  try {
    var data = await request.json();
    var email = String(data.email || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: "Invalid email" }, 400);
    }

    if (!env.APPS_SCRIPT_WAITLIST_URL) {
      return json({ ok: false, error: "Waitlist is not configured" }, 500);
    }

    var response = await fetch(env.APPS_SCRIPT_WAITLIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        email: email,
        source: "pavlov-ai.com"
      })
    });

    if (!response.ok) {
      return json({ ok: false, error: "Submission failed" }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: "Submission failed" }, 500);
  }
}

export function onRequestGet() {
  return json({ ok: false, error: "Method not allowed" }, 405);
}
