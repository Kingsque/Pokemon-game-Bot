const { getBinaryNodeChild } = require('@WhiskeySockets/baileys')
const { serialize } = require('../Structures/WAclient')
const { response } = require('express')
const { getStats, ranks } = require('../Helpers/Stats')
const chalk = require('chalk')
const emojiStrip = require('emoji-strip')
const axios = require('axios')
const cron = require("node-cron")
const { Collection } = require('discord.js')
const cool=new Collection()

module.exports = MessageHandler = async (messages, client) => {
    try {
        if (messages.type !== 'notify') return
        let M = serialize(JSON.parse(JSON.stringify(messages.messages[0])), client)
        if (!M.message) return
        if (M.key && M.key.remoteJid === 'status@broadcast') return
        if (M.type === 'protocolMessage' || M.type === 'senderKeyDistributionMessage' || !M.type || M.type === '')
            return

        const { isGroup, isSelf, sender, from, body } = M
        const gcMeta = isGroup ? await client.groupMetadata(from) : ''
        const gcName = isGroup ? gcMeta.subject : ''
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(client.prefix)
        const cmdName = body.slice(client.prefix.length).trim().split(/ +/).shift().toLowerCase()
        const arg = body.replace(cmdName, '').slice(1).trim()
        const groupMembers = gcMeta?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        const ActivateMod = (await client.DB.get('mod')) || []
        const ActivateChatBot = (await client.DB.get('chatbot')) || []
        const banned = (await client.DB.get('banned')) || []
        
        

        // Antilink system
        if (
            isGroup &&
            ActivateMod.includes(from) &&
            groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') &&
            body
        ) {
            const groupCodeRegex = body.match(/chat.whatsapp.com\/(?:invite\/)?([\w\d]*)/)
            if (groupCodeRegex && groupCodeRegex.length === 2 && !groupAdmins.includes(sender)) {
                const groupCode = groupCodeRegex[1]
                const groupNow = await client.groupInviteCode(from)

                if (groupCode !== groupNow) {
                    await client.sendMessage(from, { delete: M.key })
                     await client.groupParticipantsUpdate(from, [sender], 'remove')
                     return M.reply('Successfully removed an intruder!!!!')
                }
            }
        }
         
        //Banned system
        if (banned.includes(sender)) return M.reply('You are banned from using the bot')
        
        // AI chatting using
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (
            M.mentions.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') &&
            !isCmd &&
            isGroup &&
            ActivateChatBot.includes(from)
        ) {
            const text = await axios.get(`https://api.simsimi.net/v2/?text=${emojiStrip(body)}&lc=en&cf=true`)
            M.reply(body == 'hi' ? `Hey ${M.pushName} whats up?` : text.data.messages[0].text)
        }

        // Logging Message
        client.log(
            `${chalk[isCmd ? 'red' : 'green'](`${isCmd ? '~EXEC' : '~RECV'}`)} ${
                isCmd ? `${client.prefix}${cmdName}` : 'Message'
            } ${chalk.white('from')} ${M.pushName} ${chalk.white('in')} ${isGroup ? gcName : 'DM'} ${chalk.white(
                `args: [${chalk.blue(args.length)}]`
            )}`,
            'yellow'
        )
        
   // Wrong commands
        if (!isCmd) return;

const command = client.cmd.get(cmdName) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName));

if (!command) {
    const similarCommands = client.cmd.filter(cmd => cmd.name.includes(cmdName) || (cmd.aliases && cmd.aliases.includes(cmdName)));

    if (similarCommands.size > 0) {
        const similarCommandsList = similarCommands.map(cmd => cmd.name).join(', ');
        return M.reply(`*No such command found! Did you mean: ${similarCommandsList}?*`);
    } else {
        return M.reply('No such command found! BAKA');
    }
}
                   // Check bot mode
const mode = await client.DB.get(`mode`);

if (mode === 'self' && !isSelf) {
    return;
}

if (mode === 'private' && !client.mods.includes(M.sender.split('@')[0])) {
    return;
}

        // Disabled commands handling
        const disabled = await client.DB.get('disable-commands') || [];
        if (disabled.includes(cmdName) || command.aliases.some(alias => disabled.includes(alias.toLowerCase()))) {
            return M.reply('This command is currently disabled.');
        }

    // Cooldown handling
    const cooldownAmount = (command.cool ?? 5) * 1000;
        const time = cooldownAmount + Date.now();
        const senderIsMod = client.mods.includes(sender.split('@')[0]);
            
        if (!senderIsMod && cool.has(`${sender}${command.name}`)) {
            const cd = cool.get(`${sender}${command.name}`);
            const remainingTime = client.utils.convertMs(cd - Date.now());
            return M.reply(`You are on a cooldown. Wait *${remainingTime}* ${remainingTime > 1 ? 'seconds' : 'second'} before using this command again.`);
        } else {
            if (!senderIsMod) {
                cool.set(`${sender}${command.name}`, time);
                setTimeout(() => cool.delete(`${sender}${command.name}`), cooldownAmount);
            }
        }
        
        //reactMessage
        if(command.react){
          const reactionMessage = {
            react: {
                text: command.react, // use an empty string to remove the reaction
                key: M.key
            }
        }
        await client.sendMessage(M.from, reactionMessage)
      }

      //Groups declarations
        if (!groupAdmins.includes(sender) && command.category == 'moderation')
            return M.reply('This command can only be used by group or community admins')
        if (!groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') && command.category == 'moderation')
            return M.reply('This command can only be used when bot is admin')
        if (!isGroup && command.category == 'moderation') return M.reply('This command is ment to use in groups')
        if(!isGroup && !client.mods.includes(sender.split('@')[0])) return M.reply("Bot can only be accessed in groups")
        if (!client.mods.includes(sender.split('@')[0]) && command.category == 'dev')
            return M.reply('This command only can be accessed by the mods')
        command.execute(client, arg, M)

        //Will add exp according to the commands
        await client.exp.add(sender, command.exp)

        //Level up
        let gifRandom = [
            "https://media.tenor.com/-n2jhe7c1MUAAAAC/anime-my-dress-up-darling.gif",
            "https://media.tenor.com/PcwaCZsRQuwAAAAC/marin-kitagawa.gif",
            "https://media.tenor.com/NJ7lf-8yDVsAAAAC/kitagawa-marin.gif",
            "https://media.tenor.com/DO2R1nI7hOcAAAAC/marin-kitagawa.gif",
            "https://media.tenor.com/evACdtEThkYAAAAC/marin-kitagawa.gif",
            "https://media.tenor.com/KRfvIWIgtToAAAAC/dress-up-darling-marin-kitagawa.gif"
        ]
        let ran = gifRandom[Math.floor(Math.random() * gifRandom.length)]
        const level = (await client.DB.get(`${sender}_LEVEL`)) || 0
        const experience = await client.exp.get(sender)
        const { requiredXpToLevelUp } = getStats(level)
        if (requiredXpToLevelUp > experience) return null
        await client.DB.add(`${sender}_LEVEL`, 1)
        client.sendMessage(
            from,
            {
                video: {
                    url: ran
                },
                caption: `\n\n\nCongratulations you leveled up from *${level} ---> ${level + 1}* 🎊\n\n\n`,
                gifPlayback: false
            },
            {
                quoted: M
            }
        )
    } catch (err) {
        client.log(err, 'red')
    }
}
