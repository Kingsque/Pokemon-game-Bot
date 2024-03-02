const ms = require('parse-ms');

module.exports = {
  name: 'mine',
  aliases: ['mine'],
  category: 'rpg',
  exp: 5,
  cool: 4,
  react: '✅',
  description: 'mines items',
  async execute(client, arg, M) {
    
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.mine`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
    const participant = await client.DB.get('cshop') || [];
    if (!participant.includes(M.from)) {
      return M.reply(`To use rpg commands, join the games group by using ${client.prefix}support`);
    }

    const pickaxes = {
      ironaxe: { type: 'ironpickaxe', wood: 0, iron: [5000, 9000], gold: [300, 500], diamond: [50, 100], emerald: [0, 50] },
      woodaxe: { type: 'woodpickaxe', wood: [5000, 9000], iron: [500, 700], gold: [300, 500], diamond: [50, 100], emerald: [0, 50] },
      goldaxe: { type: 'goldpickaxe', wood: [500, 900], iron: [500, 700], gold: [300, 500], diamond: [50, 100], emerald: [0, 50] },
      diamondaxe: { type: 'diamondpickaxe', wood: [500, 700], iron: [500, 900], gold: [300, 500], diamond: [500, 1000], emerald: [0, 100] },
      emeraldaxe: { type: 'emeraldpickaxe', wood: [5000, 9000], iron: [5000, 7000], gold: [3000, 5000], diamond: [1000, 2000], emerald: [500, 100] }
    };

    const pickaxe = pickaxes[arg];
    if (!pickaxe) return M.reply('you didnt mention any axe, Use :mine (woodaxe/ironaxe/goldaxe/diamondaxe/emeraldaxe)');

    const pickaxeCount = await client.rpg.get(`${M.sender}.${pickaxe.type}`) || 0;
    if (pickaxeCount <= 0) return M.reply(`you dont have a ${arg} to mine, buy one first`);

    const woodAmount = client.utils.getRandomInt(pickaxe.wood[0], pickaxe.wood[1]);
    const ironAmount = client.utils.getRandomInt(pickaxe.iron[0], pickaxe.iron[1]);
    const goldAmount = client.utils.getRandomInt(pickaxe.gold[0], pickaxe.gold[1]);
    const diamondAmount = client.utils.getRandomInt(pickaxe.diamond[0], pickaxe.diamond[1]);
    const emeraldAmount = client.utils.getRandomInt(pickaxe.emerald[0], pickaxe.emerald[1]);

    await client.rpg.add(`${M.sender}.wood`, woodAmount);
    await client.rpg.add(`${M.sender}.iron`, ironAmount);
    await client.rpg.add(`${M.sender}.gold`, goldAmount);
    await client.rpg.add(`${M.sender}.diamond`, diamondAmount);
    await client.rpg.add(`${M.sender}.emerald`, emeraldAmount);
    await client.rpg.sub(`${M.sender}.${pickaxe.type}`, 1);

    M.reply(`⛏️ *Mine Ended* ⛏️\n🎋 *Wood:* ${woodAmount}\n🔩 *Iron:* ${ironAmount}\n🏅 *Gold:* ${goldAmount}\n💎 *Diamond:* ${diamondAmount}\n🍀 *Emerald:* ${emeraldAmount}\nBy mining from ${arg}`);
    await client.DB.set(`${M.sender}.shop`, Date.now());
  }
};