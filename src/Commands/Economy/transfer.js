const ms = require('parse-ms');

module.exports = {
    name: 'transfer',
    aliases: ['pay', 'give'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Transfer golds to your friend',
    async execute(client, arg, M) {
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }
        if (M.mentions.length === 0) return M.reply('*You must mention someone to attend the robbery*');
        const amount = parseInt(arg.split(' ')[0]);
        if (isNaN(amount)) return M.reply('Please provide a valid amount');
        if (amount <= 0) return M.reply('Please provide a positive amount');
        const credits = (await client.credits.get(`${M.sender}.wallet`)) || 0;
        if (credits < amount) return M.reply('You don\'t have that much in your wallet');
        await client.credits.add(`${M.mentions[0]}.wallet`, amount);
        await client.credits.sub(`${M.sender}.wallet`, amount);
        client.sendMessage(
            M.from,
            { text: `You gave *${amount}* to *@${M.mentions[0].split('@')[0]}*`, mentions: [M.mentions[0]] },
            { quoted: M }
        );
        let tr = `@${M.sender.split('@')[0]} gave ${amount} to @${M.mentions[0].split('@')[0]}`;
        await client.sendMessage("120363062645637432@g.us", tr);
        await client.DB.set(`${M.sender}.transfer`, Date.now());
    }
};