//viewcard
const axios = require("axios");
const path = require('path');

module.exports = {
  name: "viewcard",
  aliases: ["view"],
  exp: 0,
  react: "✅",
  category: "card game",
  description: "Views any card from the bot",
  async execute(client, arg, M) {
    const cardName = arg.trim(); // Accept card name as input

    const filePath = path.join(__dirname, '../../Helpers/card.json');
    const data = require(filePath);
    const cardData = data.find((cardData) => cardData.title === cardName); // Search by card name

    if (!cardData) {
      return M.reply("❗ Card data not found.");
    }

    const cardTier = cardData.tier;
    const cardUrl = cardData.url;
    const imageUrl = cardUrl;
    const isGif = imageUrl.endsWith('.gif');
    const file = await client.utils.getBuffer(imageUrl);
    const text = `💎 Card Details 💎\n\n🌊 Name: ${cardName}\n\n🌟 Tier: ${cardTier}\n\n${cardData.description}`;

    if (isGif) {
      const giffed = await client.utils.gifToMp4(file);
      await client.sendMessage(M.from, {
        video: giffed,
        gifPlayback: true,
        caption: text
      }, { quoted: M });
    } else {
      await client.sendMessage(M.from, {
        image: file,
        caption: text
      }, { quoted: M });
    }
  }
}
