module.exports = {
  name: 'mine',
  aliases: ['mine'],
  category: 'rpg',
  exp: 5,
  react: '✅',
  description: 'mines items',
  async execute(client, arg, M) {
    const economy = (await client.DB.get('support')) || [];

    if (!economy.includes(M.from)) return M.reply("This command can only be used in support group");

    const ironaxe = await client.rpg.get(`${M.sender}.ironpickaxe`) || 0;
    const woodaxe = await client.rpg.get(`${M.sender}.woodpickaxe`) || 0;
     const goldaxe = await client.rpg.get(`${M.sender}.goldpickaxe`) || 0;
      const diamondaxe = await client.rpg.get(`${M.sender}.diamondpicaxe`) || 0;
      const emeraldaxe = await client.rpg.get(`${M.sender}.emeraldpickaxe`) || 0;

    if (arg === 'ironaxe') {
      if (ironaxe <= 0) return M.reply('you dont have an ironaxe to mine, buy one first');
      
      const wood = client.utils.getRandomInt(500, 700);
      const iron = client.utils.getRandomInt(5000, 9000);
      const gold = client.utils.getRandomInt(300, 500);
      const diamond = client.utils.getRandomInt(50, 100);
      const emerald = client.utils.getRandomInt(0, 50);
      
      await client.rpg.add(`${M.sender}.wood`, wood);
      await client.rpg.add(`${M.sender}.iron`, iron);
      await client.rpg.add(`${M.sender}.gold`, gold);
      await client.rpg.add(`${M.sender}.diamond`, diamond); 
      await client.rpg.add(`${M.sender}.emerald`, emerald);
      await client.rpg.sub(`${M.sender}.ironpickaxe`, 1);
      M.reply(`⛏️ *Mine Ended* ⛏️\n🎋 *Wood:* ${wood}\n🔩 *Iron:* ${iron}\n🏅 *Gold:* ${gold}\n💎 *Diamond:* ${diamond}\n🍀 *Emerald:* ${emerald}\nBy mining from ironaxe`);
    } else if (arg === 'woodaxe') {
      if (woodaxe <= 0) return M.reply('you dont have a woodaxe to mine, buy one first');
      
      const wood1 = client.utils.getRandomInt(5000, 9000);
      const iron1 = client.utils.getRandomInt(500, 700);
      const gold1 = client.utils.getRandomInt(300, 500);
      const diamond1 = client.utils.getRandomInt(50, 100);
      const emerald1 = client.utils.getRandomInt(0, 50);
      
      await client.rpg.add(`${M.sender}.wood`, wood1);
      await client.rpg.add(`${M.sender}.iron`, iron1);
      await client.rpg.add(`${M.sender}.gold`, gold1);
      await client.rpg.add(`${M.sender}.diamond`, diamond1); 
      await client.rpg.add(`${M.sender}.emerald`, emerald1);
       await client.rpg.sub(`${M.sender}.woodpickaxe`, 1);
      M.reply(`⛏️ *Mine Ended* ⛏️\n🎋 *Wood:* ${wood1}\n🔩 *Iron:* ${iron1}\n🏅 *Gold:* ${gold1}\n💎 *Diamond:* ${diamond1}\n🍀 *Emerald:* ${emerald1}\nBy mining from woodaxe`);
    } else if (arg === 'goldaxe') {
      if (gold <= 0) return M.reply('you dont have a goldaxe to mine, buy one first');
      
      const wood2 = client.utils.getRandomInt(500, 900);
      const iron2 = client.utils.getRandomInt(500, 700);
      const gold2 = client.utils.getRandomInt(300, 500);
      const diamond2 = client.utils.getRandomInt(50, 100);
      const emerald2 = client.utils.getRandomInt(0, 50);
      
      await client.rpg.add(`${M.sender}.wood`, wood2);
      await client.rpg.add(`${M.sender}.iron`, iron2);
      await client.rpg.add(`${M.sender}.gold`, gold2);
      await client.rpg.add(`${M.sender}.diamond`, diamond2); 
      await client.rpg.add(`${M.sender}.emerald`, emerald2);
       await client.rpg.sub(`${M.sender}.goldpickaxe`, 1);
      M.reply(`⛏️ *Mine Ended* ⛏️\n🎋 *Wood:* ${wood2}\n🔩 *Iron:* ${iron2}\n🏅 *Gold:* ${gold2}\n💎 *Diamond:* ${diamond2}\n🍀 *Emerald:* ${emerald2}\nBy mining from goldaxe`);
    } else if (arg === 'diamondaxe') {
      if (diamondaxe <= 0) return M.reply('you dont have an diamondaxe to mine, buy one first');
      
      const wood3 = client.utils.getRandomInt(500, 700);
      const iron3 = client.utils.getRandomInt(500, 900);
      const gold3 = client.utils.getRandomInt(300, 500);
      const diamond3 = client.utils.getRandomInt(500, 1000);
      const emerald3 = client.utils.getRandomInt(0, 100);
      
      await client.rpg.add(`${M.sender}.wood`, wood3);
      await client.rpg.add(`${M.sender}.iron`, iron3);
      await client.rpg.add(`${M.sender}.gold`, gold3);
      await client.rpg.add(`${M.sender}.diamond`, diamond3); 
      await client.rpg.add(`${M.sender}.emerald`, emerald3);
      await client.rpg.sub(`${M.sender}.diamondpickaxe`, 1);
      M.reply(`⛏️ *Mine Ended* ⛏️\n🎋 *Wood:* ${wood3}\n🔩 *Iron:* ${iron3}\n🏅 *Gold:* ${gold3}\n💎 *Diamond:* ${diamond3}\n🍀 *Emerald:* ${emerald3}\nBy mining from diamondaxe`);
    } else if (arg === 'emeraldaxe') {
      if (emeraldaxe <= 0) return M.reply('you dont have a emeraldaxe to mine, buy one first');
      
      const wood4 = client.utils.getRandomInt(5000, 9000);
      const iron4 = client.utils.getRandomInt(5000, 7000);
      const gold4 = client.utils.getRandomInt(3000, 5000);
      const diamond4 = client.utils.getRandomInt(1000, 2000);
      const emerald4 = client.utils.getRandomInt(500, 100);
      
      await client.rpg.add(`${M.sender}.wood`, wood4);
      await client.rpg.add(`${M.sender}.iron`, iron4);
      await client.rpg.add(`${M.sender}.gold`, gold4);
      await client.rpg.add(`${M.sender}.diamond`, diamond4); 
      await client.rpg.add(`${M.sender}.emerald`, emerald4);
       await client.rpg.sub(`${M.sender}.emeraldpickaxe`, 1);
      M.reply(`⛏️ *Mine Ended* ⛏️\n🎋 *Wood:* ${wood4}\n🔩 *Iron:* ${iron4}\n🏅 *Gold:* ${gold4}\n💎 *Diamond:* ${diamond4}\n🍀 *Emerald:* ${emerald4}\nBy mining from emerald`);
    } else {
       M.reply('you didnt mention any axe, Use :mine (woodaxe/ironaxe/goldaxe/diamondaxe/emeraldaxe)');
    }
  }
};
