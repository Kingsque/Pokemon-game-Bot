const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

module.exports = {
  name: 'test',
  aliases: ['testt'],
  exp: 0,
  cool: 4,
  react: "✅",
  category: 'card game',
  description: 'Claim the card',
  async execute(client, arg, M) {
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

      const gifCards = [];
      const images = [];
      let cardText = "";
      const cardSet = new Set();
      
      if (arg) {
        const index = parseInt(arg) - 1;
        if (isNaN(index) || index < 0 || index >= deck.length) {
          M.reply(`Invalid card index. Your deck has ${deck.length} cards.`);
          return;
        }
        const card = deck[index].split('-');
        const filePath = path.join(__dirname, '../../Helpers/card.json');
        const data = require(filePath);
        const cardsInTier = data.filter((cardData) => cardData.tier === card[1]);
        const cardData = cardsInTier.find((cardData) => cardData.title === card[0]);
        const cardUrl = cardData.url;
        cardText = `🃏 Total Deck Cards: ${deck.length}\n\n🏮 Username: ${(await client.contact.getContact(M.sender, client)).username}\n*#${index + 1}*\n🃏 *Name:* ${card[0]}\n🪄 *Tier:* ${card[1]} \n`;
        if (cardUrl.endsWith('.gif')) {
          gifCards.push(cardUrl);
        } else {
          images.push(cardUrl);
        }

        // Send single card
        if (cardUrl.endsWith('.gif')) {
          const imageBuffer = await client.utils.gifToMp4(await client.utils.getBuffer(cardUrl));
          await client.sendMessage(M.from, { video: imageBuffer, gifPlayback: true, caption: cardText });
        } else {
          await client.sendMessage(M.from, { image: { url: cardUrl }, caption: cardText });
        }
      } else {
        for (let i = 0; i < deck.length; i++) {
          let text = "";
          const card = deck[i].split('-');
          const filePath = path.join(__dirname, '../../Helpers/card.json');
          const data = require(filePath);
          const cardsInTier = data.filter((cardData) => cardData.tier === card[1]);
          const cardData = cardsInTier.find((cardData) => cardData.title === card[0]);
          const cardKey = `${cardData.title}-${card[1]}`;
          let cardUrl = cardData.url;

          if (cardUrl.endsWith('.gif')) {
            gifCards.push(cardUrl);
          } else {
            images.push(cardUrl);
          }

          if (!cardSet.has(cardKey)) {
            cardSet.add(cardKey);
            text += `🔰Card ${i+1}:\n🌟Tier: ${card[1]}\n💎Name ${card[0]}\n\n`;
          }
        }

        // Convert GIF cards to MP4 videos
        for (const gifCardUrl of gifCards) {
          const mp4Buffer = await client.utils.gifToMp4(await client.utils.getBuffer(gifCardUrl));
          const directory = require('os').tmpdir();
          const filePath = path.join(directory, `gif_card_${gifCards.indexOf(gifCardUrl)}.mp4`);
          fs.writeFileSync(filePath, mp4Buffer);
          images.push(filePath);
        }

        // Send collage
        const canvasWidth = 1050;
        const canvasHeight = 1800;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        const backgroundImage = await loadImage(backgroundImageUrl);
        ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
        const imageWidth = 350;
        const imageHeight = 450;
        const imagePadding = 10;
        const imagesPerRow = 3;
        const rows = 4;
        const xStart = (canvasWidth - (imageWidth * imagesPerRow + imagePadding * (imagesPerRow - 1))) / 2;
        const yStart = (canvasHeight - (imageHeight * rows + imagePadding * (rows - 1))) / 2;

        for (let i = 0; i < images.length; i++) {
          const image = await loadImage(images[i]);
          const x = xStart + (i % imagesPerRow) * (imageWidth + imagePadding);
          const y = yStart + Math.floor(i / imagesPerRow) * (imageHeight + imagePadding);
          ctx.drawImage(image, x, y, imageWidth, imageHeight);
        }

        const directory = require('os').tmpdir();
        const filePath = path.join(directory, 'collage.png');
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
        const caption = `${(await client.contact.getContact(M.sender, client)).username}'s Deck\n\n Total Cards: ${deck.length}\n${text}`;
        await client.sendMessage(M.from, { image: { url: filePath }, caption: caption });
      }
    } catch(err) {
      console.log(err);
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  },
};
          
