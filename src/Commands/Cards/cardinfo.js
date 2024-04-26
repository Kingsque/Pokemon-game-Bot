const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { createDeflate } = require('zlib');

module.exports = {
  name: 'cardinfo',
  aliases: ['cardinfo'],
  exp: 0,
  cool: 4,
  react: "✅",
  category: 'card game',
  usage: ':cardinfo <card name> <tier>',
  description: 'Retrieve information about a specific card.',
  async execute(client, arg, M) {
    try {
      if (!arg || arg.split(' ').length < 2) {
        M.reply('Please provide both the card name and tier.');
        return;
      }

      const [cardName, tier] = arg.split(' ');
      
      const filePath = path.join(__dirname, '../../Helpers/card.json');
      const data = require(filePath);
      const cardData = data.find((cardData) => cardData.title.toLowerCase() === cardName.toLowerCase() && cardData.tier.toLowerCase() === tier.toLowerCase());

      if (!cardData) {
        M.reply('Card not found.');
        return;
      }

      const cardUrl = cardData.url;
      const text = `🃏 Card Name: ${cardData.title}\n🪄 Tier: ${cardData.tier}\n🌟 Rarity: ${cardData.rarity}\n💥 Attack: ${cardData.attack}\n🛡️ Defense: ${cardData.defense}\n`;

      if (cardUrl.endsWith('.gif')) {
        const giffed = await client.utils.gifToMp4(file);
        await client.sendMessage(M.from, {
          video: giffed,
          gifPlayback: true,
          caption: text
        });
      } else {
        await client.sendMessage(M.from, { image: { url: cardUrl }, caption: text }, { quoted: M });
      }
    } catch (err) {
      console.log(err);
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  },
};
        
