module.exports = {
    name: 'invite',
    aliases: ['invt', 'gclink', 'grouplink'],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'moderation',
    description: 'Get the group link',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 

        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.invt`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        const code = await client.groupInviteCode(M.from);
        if (!code) {
            return M.reply('Failed to get the group invite link.');
        }

        if (/\d+/.test(arg)) {
            const number = arg.match(/\d+/)[0];
            await client.sendMessage(number + '@c.us', `Here's the group invite link: https://chat.whatsapp.com/${code}`);
            return M.reply('✅ Group invite link sent to the specified number.');
        } else {
            M.reply('https://chat.whatsapp.com/' + code);
        }

        await client.DB.set(`${M.sender}.invt`, Date.now());
    }
};
