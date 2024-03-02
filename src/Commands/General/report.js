const ms = require('parse-ms');

module.exports = {
    name: 'report',
    aliases: ['report'],
    category: 'general',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Reports user issues',
    async execute(client, arg, M) {
    
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.report`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        let user = M.sender;
        let group = M.from;
        let tr = arg;
        let code = client.groupInviteCode(M.from);
        let report = `*『 Report Received! 』*\n\nGroup = ${group}\n\nSender = ${user}\n\nMessage: ${tr}\n\nCode = ${code}`;
        let text = `Your report has been successfully sent to the Mods group. Hope the mods will reply soon.`;

        // Send the report message to the Mods group
        await client.sendMessage("120363062645637432@g.us", { text: report }, { quoted: M });
        
        // Send a confirmation message to the user
        await client.sendMessage(M.from, { text: text }, { quoted: M });
        await client.DB.set(`${M.sender}.report`, Date.now());
    }
};