module.exports = {
  name: "cswap",
  aliases: ["swapcards"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "card game",
  description: "Swap two cards in your deck",
  async execute(client, arg, M) {
      try {
          let pc = await client.DB.get(`${M.sender}_Deck`) || [];

          if (!arg[0] || isNaN(arg[0]) || parseInt(arg[0]) < 0 || parseInt(arg[0]) > pc.length) {
              M.reply("Please provide a valid first card index.");
              return;
          }

          if (!arg[1] || isNaN(arg[1]) || parseInt(arg[1]) < 0 || parseInt(arg[1]) > pc.length) {
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
      } catch (err) {
          console.error(err);
          await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
      }
  },
};
