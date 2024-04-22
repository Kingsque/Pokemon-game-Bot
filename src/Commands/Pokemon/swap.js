module.exports = {
  name: "swap",
  aliases: ["swap"],
  exp: 0,
  cool: 4,
  react: "✅",
  category: "pokemon",
  usage: 'Use :swap <index1> <imdex2>',
  description: "Swap two pokemons in your party",
  async execute(client, arg, M) {
      try {

      let pc = await client.DB.get(`${M.sender}_Party`) || [];

    if (!arg[0] || isNaN(arg[0]) || arg[0].includes("-") || arg[0].includes("+") || (pc.length - parseInt(arg[0])) < 0) {
        M.reply("Please provide a valid first pokemon index.");
        return;
    }

    if (!arg[1] || isNaN(arg[1]) || arg[1].includes("-") || arg[1].includes("+") || (pc.length - parseInt(arg[1])) < 0) {
        M.reply("Please provide a valid second pokemon index.");
        return;
    }

    const index1 = parseInt(arg.split(' ')[0]) - 1;
    const index2 = parseInt(arg.split(' ')[1]) - 1 ;

    if (index1 === index2) {
        M.reply("The two indexses provided cannot be the same.");
        return;
    }

    const newArray = [...pc];
    const temp = newArray[index1];
    newArray[index1] = newArray[index2];
    newArray[index2] = temp;

    await client.DB.delete(`${M.sender}_Party`);


    for (let i = 0; i < pc.length; i++) {
        await client.DB.push(`${M.sender}_Party`, newArray[i]);
      }
      

    await M.reply(`🔄 Successfully swapped ${pc[index1].name} and ${pc[index2].name} in your party!`);
    }catch(err){
      await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`})
    }
  },
};
