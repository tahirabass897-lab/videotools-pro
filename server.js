
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "VideoTools Pro"
  });
});

// TikTok public link validation
app.post("/.netlify/functions/tiktok-check", (req, res) => {
  try {
    const value =
      typeof req.body?.url === "string"
        ? req.body.url.trim()
        : "";

    const parsed = new URL(value);

    const allowedHosts = [
      "tiktok.com",
      "www.tiktok.com",
      "m.tiktok.com",
      "vm.tiktok.com",
      "vt.tiktok.com"
    ];

    if (
      parsed.protocol !== "https:" ||
      !allowedHosts.includes(parsed.hostname.toLowerCase()) ||
      parsed.pathname === "/"
    ) {
      return res.status(400).json({
        valid: false,
        message: "Invalid TikTok video link."
      });
    }

    return res.json({
      valid: true,
      message: "Link checked successfully. Use TikTok's Save Video option when available.",
      url: parsed.href
    });

  } catch (error) {
    return res.status(400).json({
      valid: false,
      message: "Please enter a valid TikTok URL."
    });
  }
});

// Serve website files
app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("VideoTools Pro running on port " + PORT);
});
