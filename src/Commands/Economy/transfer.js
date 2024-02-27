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
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.transfer`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
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