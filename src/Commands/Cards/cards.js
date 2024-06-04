const path = require('path');

module.exports = {
  name: "cards",
  aliases: ["cl"],
  react: '📜',
  exp: 0,
  cool: 4,
  category: "card game",
  description: "View all your collected cards and deck cards",
  async execute(client, arg, M) {
    try {
      const collection = (await client.DB.get(`${M.sender}_Collection`)) || [];
      const deck = (await client.DB.get(`${M.sender}_Deck`)) || [];
      
      const allCards = [...collection, ...deck];
      if (allCards.length === 0) {
        return M.reply("You currently don't have any cards in your collection or deck");
      }

      const uniqueCards = allCards.filter((card, index) => allCards.indexOf(card) === index);
      let tag = M.sender.substring(3, 7);
      let tr = `*Name:* ${(await client.contact.getContact(M.sender, client)).username}\n*🏷️ Tag:* #${tag}\n\n *🔖 Total unique cards:* ${uniqueCards.length}↯\n\n`;

      for (let i = 0; i < uniqueCards.length; i++) {
        let card = uniqueCards[i].split("-");
        const filePath = path.join(__dirname, '../../Helpers/card.json');
        const data = require(filePath);
        const obj = data.find((cardData) => cardData.title === card[0] && cardData.tier === card[1]);
        tr += `*${i + 1}) Name: ${card[0]} (Tier: ${card[1]})*\n\n`;
      }

      if (arg) {
        const index = parseInt(arg) - 1;
        if (isNaN(index) || index < 0 || index >= uniqueCards.length) {
          return M.reply(`Invalid card index. Your list has ${uniqueCards.length} unique cards.`);
        } else {
          const card = uniqueCards[index].split('-');
          const filePath = path.join(__dirname, '../../Helpers/card.json');
          const data = require(filePath);
          const cardData = data.find((cardData) => cardData.title === card[0] && cardData.tier === card[1]);
          const cardUrl = cardData.url;
          let text = `🃏 Total Unique Cards: ${uniqueCards.length}\n\n🏮 Username: ${(await client.contact.getContact(M.sender, client)).username}`
          text += `\n*#${index + 1}*\n🃏 *Name:* ${card[0]}\n🪄 *Tier:* ${card[1]}\n`;

          const file = await client.utils.getBuffer(cardUrl);
          if (cardUrl.endsWith('.gif')) {
            const giffed = await client.utils.gifToMp4(file);
            await client.sendMessage(M.from, {
              video: giffed,
              gifPlayback: true,
              caption: text
            });
          } else {
            await client.sendMessage(M.from , {image: {url: cardUrl} , caption: text}, {quoted: M});
          }
        }
      } else {
        await client.sendMessage(M.from, tr);
      }
    } catch (err) {
      console.log(err);
      await client.sendMessage(M.from, {image: {url: `${client.utils.errorChan()}`}, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`});
    }
  },
};
