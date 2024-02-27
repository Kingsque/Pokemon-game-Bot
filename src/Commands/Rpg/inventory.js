const ms = require('parse-ms');

module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    category: 'rpg',
    exp: 7,
    cool: 4,
    react: "✅",
    description: 'Gives you details about your inventory',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.inv`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        const inventory = await client.rpg.get(M.sender)
        if (!inventory) return M.reply('You have no inventory')

        let text = '===🗻 *INVENTORY* 🗻===\n\n'
        for (const [key, value] of Object.entries(inventory)) {
            text += `> *${key}:* ${typeof value === 'number' ? value : JSON.stringify(value, null, 2)}\n`
        }
        M.reply(text)
        await client.DB.set(`${M.sender}.inv`, Date.now());
    }
}