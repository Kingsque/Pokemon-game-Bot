const ms = require('parse-ms');

module.exports = {
    name: 'vote',
    aliases: ['vote'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Get information about vote for auction, feature or decision',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get('disabledCommands');
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.vote`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        const option1 = await client.DB.get('option1');
        const option2 = await client.DB.get('option2');
        const option3 = await client.DB.get('option3');
        const option4 = await client.DB.get('option4');
        if (arg == 1) {
            await client.DB.push('option1vote', M.sender);
            await client.DB.push('voters', M.sender);
            M.reply('Okay! your vote has been submitted');
        } else if (arg == 2) {
            await client.DB.push('option2vote', M.sender);
            await client.DB.push('voters', M.sender);
            M.reply('Okay! your vote has been submitted');
        } else if (arg == 3) {
            await client.DB.push('option3vote', M.sender);
            await client.DB.push('voters', M.sender);
            M.reply('Okay! your vote has been submitted');
        } else if (arg == 4) {
            await client.DB.push('option4vote', M.sender);
            await client.DB.push('voters', M.sender);
            M.reply('Okay! your vote has been submitted');
        } else {
            M.reply(`VOTING OPTIONS\nOPTION 1 = ${option1}\nOPTION 2 = ${option2}\nOPTION 3 = ${option3}\nOPTION 4 = ${option4}\nTO GIVE VOTE USE :vote (option number)`);
        }
        await client.DB.set(`${M.sender}.vote`, Date.now());
    }
};