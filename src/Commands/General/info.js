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
        
        let text = `*┏─━══─| ꜱᴀʏ.ꜱᴄᴏᴛᴄʜ |─══━─┓*\n`;
        text += `🏮 *BOT INFO:* ${process.env.NAME}\n`;
        text += `🕘 *UPTIME:* ${uptime}\n`;
        text += `👥 *USERS:* ${usersCounts || 0}\n`;
        text += `🎟️ *COMMANDS:* ${client.cmd.size}\n`;
        text += `🌐 *Groups:* ${groupCount}\n`;
        text += `📢 *Mods:* ${modCount}\n`;
        text += `🎭 *Website:* ${website}\n`;
        text += `*┗─══─━══─| ✾ |─══━─══─┛*`;

         await client.sendMessage(
          M.from,
          {
            image: { url: "https://i.ibb.co/KsmPKys/images-4.jpg" },
            caption: text
          },
          {
            quoted: M
          }
        );
    }
}; 
