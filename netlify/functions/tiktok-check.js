exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "POST method required" })
    };
  }

  try {
    const { url } = JSON.parse(event.body || "{}");
    const parsed = new URL(url);

    const hosts = [
      "tiktok.com",
      "www.tiktok.com",
      "m.tiktok.com",
      "vm.tiktok.com",
      "vt.tiktok.com"
    ];

    if (parsed.protocol !== "https:" ||
        !hosts.includes(parsed.hostname.toLowerCase()) ||
        parsed.pathname === "/") {
      return {
        statusCode: 400,
        body: JSON.stringify({ valid: false, message: "Invalid TikTok link" })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valid: true,
        message: "TikTok link accepted. Open the video in TikTok and use Save video if the creator allows downloads.",
        url: parsed.href
      })
    };
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ valid: false, message: "Please enter a valid TikTok URL." })
    };
  }
};
