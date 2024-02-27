const axios = require("axios");
const path = require('path');
const ms = require('parse-ms');

module.exports = {
  name: "card-give",
  aliases: ["cg"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  description: "Give a card to another user",
  async execute(client, arg, M) {
    const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
    try {
      const cooldownMs = this.cool * 1000;
      const lastSlot = await client.DB.get(`${M.sender}.cg`);

      if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
          const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
          return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
      }
      const collection = await client.DB.get(`${M.sender}_Collection`) || [];
      const deck = await client.DB.get(`${M.sender}_Deck`) || [];

      if (!arg) {
        return await M.reply("🤖 Please select the card you wish to give by providing its index or name.");
      }

      const position = parseInt(arg[0], 10) - 1;

      if ([10, 11, 12].includes(position)) {
        return await M.reply("Sorry, but index 10-12 can't be used. You can swap and try again.");
      }

      if (isNaN(position)) return await M.reply('🔍 Please enter a valid index number for the card you want to give.');

      if (position < 0 || position >= deck.length) return await M.reply('🔍 Please enter a valid index number for the card you want to give.');

      if (!M.mentions[0]) {
        return await M.reply("Please tag the user you are giving the card to.");
      }

      if (position >= 9) return await M.reply('You can\'t give cards with an index of 9 or greater. Swap cards to give.');

      if (M.sender === M.mentions[0]) return await M.reply('Nice try, but you can\'t give cards to yourself.');

      const mentionedUserDeck = await client.DB.get(`${M.mentions[0]}_Deck`) || [];
      const card = deck[position];

      mentionedUserDeck.push(card);
      deck.splice(position, 1);

      await client.DB.set(`${M.sender}_Deck`, deck);
      await client.DB.set(`${M.mentions[0]}_Deck`, mentionedUserDeck);

      const filePath = path.join(__dirname, '../../Handlers/card.json');
      const data = require(filePath);
      const cardData = data.find((cardData) => cardData.title === card.split("-")[0] && cardData.tier === card.split("-")[1]);

      let url = cardData ? cardData.url : '';

      const mentionUser = M.mentions[0];

      const replyMsg = cardData ? `🃏 Card *${cardData.title} - ${cardData.tier}* has been gifted to @${mentionUser.split('@')[0]} ! 🎁` : `🃏 Card has been given to @${mentionUser.split('@')[0]} ! 🎁`;

      if (url.endsWith(".gif")) {
        await client.sendMessage(M.from, { video: { url: url }, gifPlayback: true, caption: replyMsg, mentions: [M.mentions[0]] }, { quoted: M });
      } else {
        await client.sendMessage(M.from, { image: { url: url }, caption: replyMsg, mentions: [M.mentions[0]] }, { quoted: M });
      }
      await client.DB.set(`${M.sender}.cg`, Date.now());
      let tr = `@${M.sender.split('@')[0]} gave 🃏 Card *${cardData.title} - ${cardData.tier} to @${M.mentions[0].split('@')[0]}`
      await client.sendMessage("120363062645637432@g.us", tr);
    } catch (err) {
      console.error(err);
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.errText()} Error-Chan Dis\n\nError:\n${err}` });
    }
  },
};