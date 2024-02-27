const axios = require("axios");
const path = require('path');
const ms = require('parse-ms');

module.exports = {
  name: "card",
  aliases: ["cards"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  description: "View your all cards, by numbers or by tiers",
  async execute(client, arg, M) {
    const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.cards`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

    const collection = await client.DB.get(`${M.sender}_Collection`) || [];
    const deck = await client.DB.get(`${M.sender}_Deck`) || [];
    
    try {
      if (collection.length === 0) {
        return M.reply("Sorry, you don't have any cards in your collection and deck.");
      }

      const uniqueCards = collection.filter((card, index) => {
        return collection.indexOf(card) === index;
      });

      let tag = M.sender.substring(3, 7);
      let tr = `*🃏 Name:* ${(await client.contact.getContact(M.sender, client)).username} #${tag}*\n\n*🔖 Total claimed Cards:* ${uniqueCards.length + deck.length}↯\n\n`;

      if (deck.length > 0) {
        tr += "*🎴 Your Deck:*\n";
        const sortedDeck = deck.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
        sortedDeck.forEach((card, index) => {
          const [name, tier] = card.split("-");
          tr += `${index + 1}. ${name} (Tier: ${tier})\n\n`;
        });
      }

      tr += "*🎴 Your Collection:*\n";
      const sortedCollection = uniqueCards.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
      
      // Check if --tier is provided in the argument
      if (arg && arg.includes("--tier")) {
        const tierArg = arg.split("--tier")[1].trim();
        const tierFilteredCollection = sortedCollection.filter(card => card.split("-")[1] === tierArg);
        tierFilteredCollection.forEach((card, index) => {
          const [name, tier] = card.split("-");
          tr += `${index + 1}. ${name} (Tier: ${tier})\n`;
        });
      } else {
        sortedCollection.forEach((card, index) => {
          const [name, tier] = card.split("-");
          tr += `${index + 1}. ${name} (Tier: ${tier})\n`;
        });
      }
      
      // Randomize cards 
      const index = Math.floor(Math.random() * uniqueCards.length);
      const card = uniqueCards[index].split("-");
      const filePath = path.join(__dirname, '../../Handlers/card.json');
      const data = require(filePath);
      const newArray = data.filter(function (I) {
        return I.tier == card[1];
      });
      const cardData = newArray.find((cardData) => cardData.title == card[0]);
      const imageUrl = cardData.url;
      await client.DB.set(`${M.sender}.cards`, Date.now());
      
      if (imageUrl.endsWith(".gif")) {
        return await client.sendMessage(M.from, { video: { url: imageUrl }, caption: tr, gifPlayback: true }, { quoted: M });
      } else {
        return await client.sendMessage(M.from, { image: { url: imageUrl }, caption: tr }, { quoted: M });
      }
    } catch(err) {
      await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`});
    }
  },
};