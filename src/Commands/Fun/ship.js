const { Ship } = require('@shineiichijo/canvas-chan');
const { writeFile } = require('fs-extra');
const ms = require('parse-ms');

module.exports = {
    name: 'ship',
    aliases: ['shipper'],
    category: 'fun',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Ship People! ♥',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.ship`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        const shipArray = [];
        let users = M.mentions;
        if (M.quoted && !users.includes(M.quoted.participant)) users.push(M.quoted.participant);
        while (users.length < 2) users.push(M.sender);
        if (users.includes(M.sender)) users = users.reverse();

        for (const user of users) {
            const contact = await client.getContactById(user);
            const name = contact.name || contact.notify || contact.pushname || 'Unknown';
            let image;
            try {
                image = await client.getProfilePicUrl(user);
            } catch (error) {
                console.error('Error fetching profile picture:', error);
                // Provide a default image URL if fetching fails
                image = 'https://icon2.cleanpng.com/20180703/lzk/kisspng-computer-icons-error-clip-art-checklist-5b3c119612f6e8.7675651415306633180777.jpg';
            }
            shipArray.push({ name, image });
        }

        const percentage = Math.floor(Math.random() * 101);

        let text = '';
        if (percentage < 10) text = 'Awful';
        else if (percentage < 25) text = 'Very Bad';
        else if (percentage < 40) text = 'Poor';
        else if (percentage < 55) text = 'Average';
        else if (percentage < 75) text = 'Good';
        else if (percentage < 90) text = 'Great';
        else text = 'Amazing';

        let sentence = '';
        if (percentage < 40) sentence = `There's still time to reconsider your choices.`;
        else if (percentage < 60) sentence = `Good enough, I guess! 💫`;
        else if (percentage < 75) sentence = `Stay together and you'll find a way ⭐️`;
        else if (percentage < 90) sentence = `Amazing! You two will be a good couple 💖`;
        else sentence = `You two are fated to be together 💙`;

        const caption = `❣️ *Matchmaking...* ❣️\n` +
                        `---------------------------------\n` +
                        `*@${users[0].split('@')[0]} x @${users[1].split('@')[0]}*\n` +
                        `---------------------------------\n` +
                        `\t\t${percentage < 40 ? '💔' : percentage < 75 ? '❤' : '💗'} *ShipCent: ${percentage}%*\n\n` +
                        `💗 *Type:* ${text}\n\n` +
                        `*${sentence}*`;

        const shipImage = await new Ship(shipArray, percentage, text).build();
        const imageBuffer = Buffer.from(shipImage.split(",")[1], 'base64');
        await client.DB.set(`${M.sender}.ship`, Date.now());

        try {
            await writeFile('shipImage.png', imageBuffer);
        } catch (error) {
            console.error('Error writing ship image:', error);
        }

        client.sendMessage(
            M.from,
            {
                image: imageBuffer,
                caption,
                mentions: [users[0], users[1]]
            },
            {
                quoted: M
            }
        );
    }
};