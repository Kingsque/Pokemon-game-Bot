const ms = require('parse-ms');

module.exports = {
    name: 'information',
    aliases: ['info'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Get information bot information',
    async execute(client, arg, M) {
    
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }

        const getGroups = await client.groupFetchAllParticipating();
        const groups = Object.entries(getGroups).map((entry) => entry[1]);
        const groupCount = groups.length;
        const pad = (s) => (s < 10 ? '0' : '') + s;
        const formatTime = (seconds) => {
            const hours = Math.floor(seconds / (60 * 60));
            const minutes = Math.floor((seconds % (60 * 60)) / 60);
            const secs = Math.floor(seconds % 60);
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
        };
        const uptime = formatTime(process.uptime());
        const usersCount = Object.values(await client.contactDB.all()).length;
        
        M.reply(
            `(¬‿¬) *${process.env.NAME}'s info*\n\n🚦 *UPTIME:* ${uptime}\n📛 *USERS:* ${usersCount}\n🔰 *COMMANDS:* ${client.cmd.size}\n*👥 Groups:* ${groupCount}\n*👑 Users:* ${userCount}`
        );
        await client.DB.set(`${M.sender}.info`, Date.now());
    }
};