const { shizobtn1, shizobtn1img, shizobtn1gif } = require('./shizofunc.js')
module.exports = {
    name: 'info',
    aliases: ['information'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "📢",
    usage: 'Use :info',
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
        const usersCount = await client.DB.get(`data`) || []
        const usersCounts = usersCount.length
        const modCount = client.mods.length;
        const website = 'coming soon...';
        
        let text = `*┏─━══─| ꜱᴀʏ.ꜱᴄᴏᴛᴄʜ |─══━─∘⦿ꕹ᛫*\n`;
        text += `*╏🏮 BOT INFO:* ${process.env.NAME}\n`;
        text += `*╏🕘 UPTIME:* ${uptime}\n`;
        text += `*╏👥 USERS:* ${usersCounts || 0}\n`;
        text += `*╏🎟️ COMMANDS:* ${client.cmd.size}\n`;
        text += `*╏🌐 GROUPS:* ${groupCount}\n`;
        text += `*╏📢 MODS:* ${modCount}\n`;
        text += `*╏🔥 OWNER:* @ꜱᴀʏ.ꜱᴄᴏᴛᴄʜ\n`;
        text += `*╏🎭 WEBSITE:* ${website}\n`;
        text += `*┗─══─━══─| ✾ |─══━─══─∘⦿ꕹ᛫*`;

        return shizobtn1img(client, M.from, text, "https://i.ibb.co/KsmPKys/images-4.jpg", "owner", "-owner", "red")
       
    }
}; 
