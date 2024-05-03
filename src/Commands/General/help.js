const fs = require('fs'); 
const now = new Date();
const hour = now.getHours();
let greeting;
if (hour >= 0 && hour < 12) {
  greeting = "Good Morning 🌅";
} else if (hour >= 12 && hour < 18) {
  greeting = "Good Afternoon 🏜️";
} else {
  greeting = "Good Evening 🌌";
}

module.exports = {
  name: 'help',
  aliases: ['h', 'menu', 'list'],
  category: 'general',
  exp: 10,
  cool: 4,
  react: "🌩️",
  usage: 'Use -help for helplist or -help <command_name> to get command info',
  description: 'Displays the command list or specific command info',
  async execute(client, arg, M) {
    try {
      const user = await client.DB.get(`data`);
        const m = M.sender;
        // If user is not in data, push the user
        if (!m.includes(user)) {
            await client.DB.push(`data`, m);
        }
      
      if (!arg) {
        let pushName = M.pushName.trim();
        if (pushName.split(' ').length === 1) {
          pushName = `${pushName} san`;
        }

        const categories = client.cmd.reduce((obj, cmd) => {
          const category = cmd.category || 'Uncategorized';
          obj[category] = obj[category] || [];
          obj[category].push(cmd.name);
          return obj;
        }, {});

        const commandList = Object.keys(categories);

        let commands = '';

        for (const category of commandList) {
          commands += `*𓊈𒆜 ${client.utils.capitalize(category, true)} 𒆜𓊉* \n\`\`\`${categories[category].join(', ')}\`\`\`\n\n`;
        }

        let message = `*${greeting}* ${pushName}.\n*👋 Hello!! Dear senpai!! 🤭*\n*❄️ You are feeling fine, 🤗 I hope I can help you..?? 🥰*\n*© 𝕹𝖎𝖊𝖗 𝕬𝖚𝖙𝖔𝖒𝖆𝖙𝖆*\n\n☃️ ʜᴇʀᴇ's ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅs ʟɪsᴛᴇᴅ ʙᴇʟᴏᴡ:\n\n${commands}`;
        message += `© 𝕹𝖎𝖊𝖗 𝕬𝖚𝖙𝖔𝖒𝖆𝖙𝖆 \n\n📒ɴᴏᴛᴇs: \n1. ғᴏʀ ᴏғғɪᴄɪᴀʟ ɢʀᴏᴜᴘ = ᴛʏᴘᴇ *${client.prefix}sᴜᴘᴘᴏʀᴛ*\n\n2.ғᴏʀ ᴄᴏᴍᴍᴀɴᴅs ɪɴғᴏ type = *:ᴄᴏᴍᴍᴀɴᴅ <ᴄᴏᴍᴍᴀɴᴅ_ɴᴀᴍᴇ>*`;
        
        await client.sendMessage(
          M.from,
          {
            video:fs.readFileSync('./assets/Nier Automata.mp4'),gifPlayback:true,
            caption: message
          },
          {
            quoted: M
          }
        );
        return;
      }

      const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg));

      if (!command) return M.reply('Command not found');

      const message = `🔸 *Name:* ${command.name}\n♓ *Aliases:* ${command.aliases.join(', ')}\n🌐 *Category:* ${command.category}\n⚜️ *Exp:* ${command.exp}\n🌀 *Cool:* ${command.cool}\n☣️ *Usage:* ${command.usage}\n🔰 *Desc:* ${command.description}`;

      M.reply(message);
    } catch (err) {
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  }
};
