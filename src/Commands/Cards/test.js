const axios = require('axios');
const fs = require('fs');
const path = require('path');
const SVG = require('svg.js');

module.exports = {
  name: 'test',
  aliases: ['t'],
  exp: 0,
  cool: 4,
  react: "✅",
  category: 'card game',
  description: 'Claim the card',
  async execute(client, arg, M) {
    const user = M.sender;
    const deck = await client.DB.get(`${M.sender}_Deck`);
    if (!deck || deck.length === 0) {
      M.reply('No Deck Found');
      return;
    } 
    try {
      const maxCardsInDeck = 12;
      const cardsToMove = deck.slice(maxCardsInDeck);
      const cardsToKeep = deck.slice(0, maxCardsInDeck);
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      await client.DB.set(`${M.sender}_Collection`, [...collection, ...cardsToMove]);
      await client.DB.set(`${M.sender}_Deck`, cardsToKeep);
      const bgPath = path.join(__dirname, '../../Helpers/bg.json');
      const bgData = require(bgPath);
      const backgroundTitle = await client.DB.get(`${M.sender}_BG`);

      let backgroundImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmru1INQycEtNqouDSnB0XU7_CS3MzEpORvw&usqp=CAU';

      if (backgroundTitle) {
        const background = bgData.find(bg => bg.Name === backgroundTitle);
        if (background) {
          backgroundImageUrl = background.Url;
        }
      }

      if (arg) { 
        const index = parseInt(arg) - 1; // The index in the array is 0-based
        if (isNaN(index) || index < 0 || index >= deck.length) {
          M.reply(`Invalid card index. Your deck has ${deck.length} cards.`);
        } else {
          const card = deck[index].split('-');
          const filePath = path.join(__dirname, '../../Helpers/card.json');
          const data = require(filePath);
          const cardsInTier = data.filter((cardData) => cardData.tier === card[1]);
          const cardData = cardsInTier.find((cardData) => cardData.title === card[0]);
          const cardUrl = cardData.url;
          let text = `🃏 Total Deck Cards: ${deck.length}\n\n🏮 Username: @${user.split("@")[0]} \n*#${index + 1}*\n🃏 *Name:* ${card[0]}\n🪄 *Tier:* ${card[1]} \n`;
          const file = await client.utils.getBuffer(cardUrl);
          if (cardUrl.endsWith('.gif')) {
            const giffed = await client.utils.gifToMp4(file);
            await client.sendMessage(M.from, {
              video: giffed,
              gifPlayback: true,
              caption: text
            });
          } else {
            await client.sendMessage(M.from, {image: {url: cardUrl}, caption: text}, {quoted: M});
          }
        }
      } else {
        const images = [];
        let cardText = "";
        const cardSet = new Set();
        for (let i = 0; i < deck.length; i++) {
          const card = deck[i].split('-');
          const filePath = path.join(__dirname, '../../Helpers/card.json');
          const data = require(filePath);
          const cardsInTier = data.filter((cardData) => cardData.tier === card[1]);
          const cardData = cardsInTier.find((cardData) => cardData.title === card[0]);
          const cardKey = `${cardData.title}-${card[1]}`;
          let cardUrl = cardData.url;
          if (!cardSet.has(cardKey)) {
            cardSet.add(cardKey);
            images.push(cardUrl);
          }
          cardText += `🔰Card ${i+1}:\n🌟Tier: ${card[1]}\n💎Name ${card[0]}\n\n`;
        }

        const draw = SVG().size(1050, 1800);
        
        // Add background image
        draw.image(backgroundImageUrl, 1050, 1800).move(0, 0);
        
        for (let i = 0; i < images.length; i++) {
          const x = (i % 3) * 360;
          const y = Math.floor(i / 3) * 460;
          draw.image(images[i], 350, 450).move(x, y);
        }
        
        const directory = require('os').tmpdir();
        const filePath = path.join(directory, 'collage.svg');
        fs.writeFileSync(filePath, draw.svg());
        
        const caption = `@${user.split("@")[0]} 's Deck\n\n Total Cards: ${deck.length}\n${cardText}`;
        client.sendMessage(M.from, {
          document: filePath,
          caption: caption
        });
      } 
    } catch(err) {
      console.log(err);
      await client.sendMessage(M.from, {image: {url: `${client.utils.errorChan()}`}, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`});
    }
  },
};
                                                                                                                                                    
