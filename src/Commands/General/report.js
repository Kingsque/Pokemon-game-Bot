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
    
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
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