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
const ms = require('parse-ms');

module.exports = {
  name: 'help',
  aliases: ['h', 'menu', 'list'],
  category: 'general',
  exp: 10,
  cool: 4,
  react: "☃️",
  description: 'Displays the command list or specific command info',
  async execute(client, arg, M) {
    const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.help`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

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
          commands += `*🦋⃟≛⃝ 『${client.utils.capitalize(category, true)}』* \n\`\`\`${categories[category].join(', ')}\`\`\`\n\n`;
        }

        let message = `*${greeting}* ${pushName}. *Konnichiwa Sanpai How Are You..!?\n*𝓐𝓾𝓻𝓸𝓻𝓪 𝓫𝓸𝓽 𝄞*\n\n🎁 ᴍʏ ᴘʀᴇғɪx : [ ${client.prefix} ]\n\n☃️ *ᴛɪᴘs:*\n\n→ ᴛʏᴘᴇ *${client.prefix}ʜᴇʟᴘ* <ᴄᴏᴍᴍᴀɴᴅ-ɴᴀᴍᴇ> ᴛᴏ sᴇᴇ ᴄᴏᴍᴍᴀɴᴅ ᴅᴇsᴄʀɪᴘᴛɪᴏɴ ᴀɴᴅ ᴜsᴀɢᴇ.🐰 ʜᴇʀᴇ's ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅs ʟɪsᴛᴇᴅ ʙᴇʟᴏᴡ:\n\n${commands}`;
        message += `© _Team Aurora𝄞 \n\n📒ɴᴏᴛᴇs: \n1. ғᴏʀ ᴏғғɪᴄɪᴀʟ ɢʀᴏᴜᴘ : ᴛʏᴘᴇ *${client.prefix}sᴜᴘᴘᴏʀᴛ*\n\n2. ɪɴғᴏ ᴀʙᴏᴜᴛ ʟᴀᴛᴇsᴛ ᴜᴘᴅᴀᴛᴇ : ᴛʏᴘᴇ *${client.prefix}ɴᴏᴛɪᴄᴇʙᴏᴀʀᴅ*\n\n3. ᴛᴏᴘ ᴘʟᴀʏᴇʀs ɪɴғᴏ : ᴛʏᴘᴇ *${client.prefix}ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ*\n\n4. ʀᴇᴘᴏʀᴛ ɪssᴜᴇs ᴡɪᴛʜ ᴄᴏᴍᴍᴀɴᴅ : *${client.prefix}ʀᴇᴘᴘʀᴛ <ʏᴏᴜʀ_ᴡᴏʀᴅs>*\n\n ᴘʟᴇᴀsᴇ sʜᴀʀᴇ ᴍᴇ ᴡɪᴛʜ ʏᴏᴜʀ ғʀɪᴇɴᴅs ᴀɴᴅ ʟᴇᴀᴠᴇ ᴀ ʀᴇᴠɪᴇᴡ!!🎐*`;
        const buffer = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');
        await client.DB.set(`${M.sender}.help`, Date.now());

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

      const message = `*CMD INFO*\n\n*𒉽 Name:* ${command.name}\n*𒉽 Aliases:* ${command.aliases.join(', ')}\n*𒉽 Desc:* ${command.description}\n*𒉽 Exp:* ${command.exp}\n*𒉽 Col:* ${command.cool}\n*𒉽 Category:* ${command.category}`;

      M.reply(message);
    } catch (err) {
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  }
};