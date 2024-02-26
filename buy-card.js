module.exports = {
  name: "buy-card",
  aliases: ["b-c"],
  exp: 0,
  react: "✅",
  category: "card shop",
  async execute(client, arg, M) {
  const auction = (await client.DB.get('cshop')) || [];
    if (!auction.includes(M.from)) return M.reply(`join auction gc by using ${client.prefix}support`);
    
    let dime = await client.rpg.get(`${M.sender}.diamond`) || 0;

    if (arg === "1") {
      if (dime < 50000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Madara-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 50000);
      M.reply("You have succesfully purchased madara. it's in your collection");
    } else if (arg === "2") {
      if (dime < 40000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Goku-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 40000);
      M.reply("You have succesfully purchased goku. it's in your collection");
    } else if (arg === "3") {
      if (dime < 45000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Yuji Itadori and Sukuna-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 45000);
      M.reply("You have succesfully purchased yuji and sukuna. it's in your collection");
    } else if (arg === "4") {
      if (dime < 60000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Tanjiro Kamado-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 60000);
      M.reply("You have succesfully purchased tanjiro. it's in your collection");
    } else if (arg === "5") {
      if (dime < 40000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Genos-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 40000);
      M.reply("You have succesfully purchased genos. it's in your collection");
    } else if (arg === "6") {
      if (dime < 55000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Allen Walker-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 55000);
      M.reply("You have succesfully purchased Allen walker. it's in your collection");
    } else if (arg === "7") {
      if (dime < 65000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Yae Miko-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 65000);
      M.reply("You have succesfully purchased yae miko. it's in your collection");
    } else if (arg === "8") {
      if (dime < 50000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Broly-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 50000);
      M.reply("You have succesfully purchased broly. it's in your collection");
    } else if (arg === "9") {
      if (dime < 60000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Hayase Nagatoro-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 60000);
      M.reply("You have succesfully purchased nagataro. it's in your collection");
    } else if (arg === "10") {
      if (dime < 70000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Collection`, `Ace x Sabo x Luffy-6`);
      await client.rpg.sub(`${M.sender}.diamond`, 70000);
      M.reply("You have succesfully purchased Ace x Sabo x Luffy. it's in your collection");
    } else if (arg === "11") {
      if (dime < 10000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Deck`, `Denji's dream life-S`);
      await client.rpg.sub(`${M.sender}.diamond`, 100000);
      M.reply("You have succesfully purchased denji. it's in your collection");
    } else if (arg === "12") {
      if (dime < 120000) return M.reply('you dont have enough diamonds');
      await client.DB.push(`${M.sender}_Deck`, `Love & Mist Hashira vs Upper Moon-S`);
      await client.rpg.sub(`${M.sender}.diamond`, 120000);
      M.reply("You have succesfully purchased Love & Mist Hashira vs Upper Moon. it's in your collection");
    } else {
      M.reply("you didn't provide a card number");
    }
  },
};
