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
          
          // Check if arguments are provided
          if (arg.length < 2) {
              M.reply("Please provide two valid card indices to swap.");
              return;
          }

          // Check if inputs are valid integers
          const index1 = parseInt(arg[0]);
          const index2 = parseInt(arg[1]);

          if (isNaN(index1) || isNaN(index2) || index1 <= 0 || index2 <= 0 || index1 > pc.length || index2 > pc.length) {
              M.reply("Please provide valid integer indices within the range of your deck.");
              return;
          }

          // Adjust indices to array indexing
          const actualIndex1 = index1 - 1;
          const actualIndex2 = index2 - 1;

          // Check if the indices are the same
          if (actualIndex1 === actualIndex2) {
              M.reply("The two indices provided cannot be the same.");
              return;
          }

          // Swap the cards
          const newArray = [...pc];
          const temp = newArray[actualIndex1];
          newArray[actualIndex1] = newArray[actualIndex2];
          newArray[actualIndex2] = temp;

          // Update the deck with the swapped cards
          await client.DB.set(`${M.sender}_Deck`, newArray);

          M.reply(`Cards at index ${index1} and ${index2} have been swapped.`);
      } catch (err) {
          console.error(err);
          await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
      }
  },
};
