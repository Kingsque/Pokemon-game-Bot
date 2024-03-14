module.exports = {
    name: 'information',
    aliases: ['info'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Get bot information',
    async execute(client, arg, M) {

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
        const modCount = client.mods.length;
        const website = 'https://kingshisui00.github.io/Aurora-web/';
        
        let text = `(¬‿¬) *${process.env.NAME}'s info*\n\n`;
        text += `• *UPTIME:* ${uptime}\n`;
        text += `• *USERS:* ${usersCount}\n`;
        text += `• *COMMANDS:* ${client.cmd.size}\n`;
        text += `• *Groups:* ${groupCount}\n`;
        text += `• *Mods:* ${modCount}\n`;
        text += `• *Website:* ${website}`;

        M.reply(text);
    }
}; 
