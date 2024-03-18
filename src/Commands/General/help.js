const now = new Date();
const hour = now.getHours();
let greeting;
if (hour >= 0 && hour < 12) {
  greeting = "💕 Good Morning";
} else if (hour >= 12 && hour < 18) {
  greeting = "💕 Good Afternoon";
} else {
  greeting = "💕 Good Evening";
}

module.exports = {
  name: 'help',
  aliases: ['h', 'menu', 'list'],
  category: 'general',
  exp: 10,
  cool: 4,
  react: "☃️",
  description: 'Displays the command list or specific command info',
  async execute(client, arg, M) {
    try {
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
          commands += `*❯─『${client.utils.capitalize(category, true)}』─❮* \n\`\`\`${categories[category].join(', ')}\`\`\`\n\n`;
        }

        let message = `*${greeting}* ${pushName}. *Konnichiwa Sanpai How Are You..!?\n*𝓐𝓾𝓻𝓸𝓻𝓪 𝓫𝓸𝓽 𝄞*\n\n☃️ ʜᴇʀᴇ's ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅs ʟɪsᴛᴇᴅ ʙᴇʟᴏᴡ:\n\n${commands}`;
        message += `© _Team Aurora𝄞 \n\n📒ɴᴏᴛᴇs: \n1. ғᴏʀ ᴏғғɪᴄɪᴀʟ ɢʀᴏᴜᴘ = ᴛʏᴘᴇ *${client.prefix}sᴜᴘᴘᴏʀᴛ*\n\n2.ғᴏʀ ᴄᴏᴍᴍᴀɴᴅs ɪɴғᴏ type = *:ᴄᴏᴍᴍᴀɴᴅ <ᴄᴏᴍᴍᴀɴᴅ_ɴᴀᴍᴇ>*\n\n3.ғᴏʀ ᴋɴᴏᴡɪɴɢ ᴀʙᴏᴜᴛ ᴏᴜʀ ʙᴏᴛ type = *:ɢᴜɪᴅᴇ*`;
        const buffer = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');

        await client.sendMessage(
          M.from,
          {
            video: { url: "https://graph.org/file/d2662e4c6a394dba9df06.mp4" },
            caption: message,
            gifPlayback: true
          },
          {
            quoted: M
          }
        );
        return;
      }

      const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg));

      if (!command) return M.reply('Command not found');

      const message = `*COMMAND INFO*\n\n*🟥 Name:* ${command.name}\n*🟩 Aliases:* ${command.aliases.join(', ')}\n*⬜ Exp:* ${command.exp}\n\n🟪 Cool:* ${command.cool}\n*🟦 Category:* ${command.category}*🟨 Desc:* ${command.description}`;

      M.reply(message);
    } catch (err) {
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  }
};