const ms = require('parse-ms');

module.exports = {
  name: "swap",
  aliases: ["swapcards"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  description: "Swap two cards in your deck",
  async execute(client, arg, M) {
      try {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.swap`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

          let pc = await client.DB.get(`${M.sender}_Deck`) || [];

          if (!arg[0] || isNaN(arg[0]) || arg[0].includes("-") || arg[0].includes("+") || (pc.length - parseInt(arg[0])) < 0) {
              M.reply("Please provide a valid first card index.");
              return;
          }

          if (!arg[1] || isNaN(arg[1]) || arg[1].includes("-") || arg[1].includes("+") || (pc.length - parseInt(arg[1])) < 0) {
              M.reply("Please provide a valid second card index.");
              return;
          }

          const index1 = parseInt(arg[0]) - 1;
          const index2 = parseInt(arg[1]) - 1;

          if (index1 === index2) {
              M.reply("The two indices provided cannot be the same.");
              return;
          }

          const newArray = [...pc];
          const temp = newArray[index1];
          newArray[index1] = newArray[index2];
          newArray[index2] = temp;

          await client.DB.set(`${M.sender}_Deck`, newArray);

          M.reply(`Cards at index ${index1} and ${index2} have been swapped.`);
          await client.DB.set(`${M.sender}.slot`, Date.now());
      } catch (err) {
          console.error(err);
          await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
      }
  },
};