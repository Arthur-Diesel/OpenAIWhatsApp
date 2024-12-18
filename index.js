const { Client } = require("whatsapp-web.js");
const OpenAI = require("openai");
const qrcode = require("qrcode");
const fs = require("fs");
require("dotenv").config();

const openaiClient = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const client = new Client();

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.toFile("./qr.png", qr, { width: 300 });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  if (msg.body.includes("!ask")) {
    const question = msg.body.split("!ask")[1].trim();

    const response = await openaiClient.chat.completions.create({
      messages: [{ role: "developer", content: question }],
      model: "gpt-3.5-turbo",
    });

    msg.reply(response.choices[0].message.content);
  }
});

client.initialize();
