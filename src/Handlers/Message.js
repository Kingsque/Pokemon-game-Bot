const { getBinaryNodeChild } = require('@WhiskeySockets/baileys');
const { serialize } = require('../Structures/WAclient');
const { requirePokeExpToLevelUp, levelUpPokemon, canItEvolve, pokemonEvolve } = require('../Helpers/pokeStats');
const { getStats, ranks } = require('../Helpers/Stats');
const chalk = require('chalk');
const emojiStrip = require('emoji-strip');
const axios = require('axios');
const cron = require("node-cron");
const { Collection } = require('discord.js');
const cool = new Collection();

module.exports = MessageHandler = async (messages, client) => {
    try {
        if (messages.type !== 'notify') return;
        let M = serialize(JSON.parse(JSON.stringify(messages.messages[0])), client);
        if (!M.message) return;
        if (M.key && M.key.remoteJid === 'status@broadcast') return;
        if (M.type === 'protocolMessage' || M.type === 'senderKeyDistributionMessage' || !M.type || M.type === '')
            return;

        const { isGroup, isSelf, sender, from, body } = M;
        const gcMeta = isGroup ? await client.groupMetadata(from) : '';
        const gcName = isGroup ? gcMeta.subject : '';
        const args = body.trim().split(/ +/).slice(1);
        const isCmd = body.startsWith(client.prefix);
        const cmdName = body.slice(client.prefix.length).trim().split(/ +/).shift().toLowerCase();
        const arg = body.replace(cmdName, '').slice(1).trim();
        const groupMembers = gcMeta?.participants || [];
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id);
        const ActivateMod = (await client.DB.get('mod')) || [];
        const ActivateChatBot = (await client.DB.get('chatbot')) || [];
        const banned = (await client.DB.get('banned')) || [];
        const user = (await client.DB.get(`data`)) || [];
        const companion = await client.pkmn.get(`${sender}_Companion`);
        const economy = await client.econ.findOne({ userId: sender }); // Fixed the economy condition
        
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
                    await client.sendMessage(from, { delete: M.key });
                    await client.groupParticipantsUpdate(from, [sender], 'remove');
                    return M.reply('Successfully removed an intruder!!!!');
                }
            }
        }

        // auto reaction owner number 
        if ( body === 'Bot' || body === 'bot') return M.reply(`Everything is working fine ${M.pushName}`)
       /*
        const itachi = "919529426293@s.whatsapp.net"

        if (sender === itachi) {
            const reactionMessage = { react: { text: '🐼', key: M.key } };
            await client.sendMessage(from, reactionMessage);
        } else if (isCmd && sender === itachi) {
            const reactionMessage = { react: { text: '🐼', key: M.key } };
            await client.sendMessage(from, reactionMessage);
        }
        
        const itachi = ["919529426293@s.whatsapp.net", "916000764396@s.whatsapp.net", "917638889076@s.whatsapp.net"];

if (itachi.includes(sender)) {
    const reactionMessage = { react: { text: '💓', key: M.key } };
    await client.sendMessage(from, reactionMessage);
} */

// Random reactions made by REDZEOX..!!
   const itachi = ["919529426293@s.whatsapp.net", "917758924068@s.whatsapp.net", "917638889076@s.whatsapp.net", "917980329866@s.whatsapp.net", "916000764396@s.whatsapp.net"];

if (itachi.includes(sender)) {
    let reactRandom = [
        "👻","🐼","🙈","🐨","🐷",
        "🐹","🦄","🐸","🐶","🦊" ];
    let ran = reactRandom[Math.floor(Math.random() * reactRandom.length)];
    
    const reactionMessage = { react: { text: ran, key: M.key } };
    await client.sendMessage(from, reactionMessage);
}
        
     //auto chat bot
     if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (
            M.mentions.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') &&
            !isCmd &&
            isGroup 
        ) {
            const text = await axios.get(`https://hercai.onrender.com/beta/hercai?question=${encodeURI(body)}`, {
            headers: {
                'content-type': 'application/json'
            }
        })
             M.reply(body == 'hi' ? `Hey ${M.pushName} whats up?` : text.data.reply)
        }

        // Link handling code
        if (!isGroup && body.includes('chat.whatsapp.com')) {
            const senderInfo = M.pushName || sender;
            const messageToMods = `WhatsApp link sent by: ${senderInfo}\nLink: ${body}`;
            await client.sendMessage(from, { text: 'Your request has been sent.' });
            const modsGroupJid = client.groups.adminsGroup;
            await client.sendMessage(modsGroupJid, { text: messageToMods, mentions: [M.sender] });
        }

        if (isCmd && !user.includes(sender) && cmdName !== 'help') {
            return M.reply('You are not registered. Please use -help to get started.');
        }

        if (isCmd && banned.includes(sender)) return M.reply('You are banned from using the bot');

        if (isCmd && !cmdName) return M.reply('I am alive user, use -help to get started');

        client.log(
            `${chalk[isCmd ? 'red' : 'green'](`${isCmd ? '~EXEC' : '~RECV'}`)} ${
                isCmd ? `${client.prefix}${cmdName}` : 'Message'
            } ${chalk.white('from')} ${M.pushName} ${chalk.white('in')} ${isGroup ? gcName : 'DM'} ${chalk.white(
                `args: [${chalk.blue(args.length)}]`
            )}`,
            'yellow'
        );

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

        const disabledCommands = await client.DB.get('disable-commands') || [];
        const disabledCmd = disabledCommands.find(
            (cmd) => cmd.command === cmdName || (command.aliases && command.aliases.includes(cmd.command))
        );
        if (disabledCmd) {
            const disabledAt = new Date(disabledCmd.disabledAt).toLocaleString();
            const reason = disabledCmd.reason || 'No reason provided.';
            const disabledBy = client.contact.getContact(disabledCmd.disabledBy, client).username;
            return M.reply(`This command is currently disabled by ${disabledBy}. Reason: ${reason}. Disabled at: ${disabledAt}`);
        }

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

        if (command.react) {
            const reactionMessage = {
                react: {
                    text: command.react,
                    key: M.key
                }
            };
            await client.sendMessage(M.from, reactionMessage);
        }

        if (!groupAdmins.includes(sender) && command.category == 'moderation')
            return M.reply('This command can only be used by group or community admins');
        if (!groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') && command.category == 'moderation')
            return M.reply('This command can only be used when bot is admin');
        if (!isGroup && command.category == 'moderation') return M.reply('This command is meant to be used in groups');
        if (!isGroup && !client.mods.includes(sender.split('@')[0])) return M.reply("Bot can only be accessed in groups")
        if (isGroup && (command.name === 'auction' || command.name === 'bid') && from !== client.groups.auctionGroup) {
            return M.reply(`The auction commands can only be used in the casino group.`);
        }
        if (!client.mods.includes(sender.split('@')[0]) && command.category == 'dev')
            return M.reply('This command only can be accessed by the mods');
         if (command.category === 'economy' && !economy && command.name !== 'bonus') return M.reply('Use :bonus to get started')
        
        command.execute(client, arg, M);
       
        if (isCmd && command.category === 'pokemon') {
            const party = await client.DB.get(`${sender}_Party`) || [];
            if (party.length > 0) {
                const firstPokemon = party[0];
                const randomExp = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
                firstPokemon.exp += randomExp;

                // Level up logic
                const requiredExpToLevelUp = requirePokeExpToLevelUp(firstPokemon.exp, firstPokemon.level);
                if (requiredExpToLevelUp <= 0) {
                    const currentLevel = firstPokemon.level;
                    levelUpPokemon(firstPokemon);
                    if (firstPokemon.level > currentLevel) {
                        const levelUpMessage = `Congratulations! Your Pokémon has leveled up to level ${firstPokemon.level}!`;
                        client.sendMessage(from, { text: levelUpMessage });

                        // Check if the Pokemon can evolve
                        const canEvolveResult = await canItEvolve(firstPokemon.name, firstPokemon.level);
                        if (canEvolveResult) {
                            // Get evolution details
                            const evolutionDetails = await pokemonEvolve(firstPokemon.name);
                            if (evolutionDetails) {
                                const evolveMessage = `Your Pokémon is ready to evolve into ${evolutionDetails.name}! Use :evolve 1 to evolve it.`;
                                client.sendMessage(from, { text: evolveMessage });
                            }
                        }
                    }
                }

                await client.DB.set(`${sender}_Party`, party);
            }
        }
        

        await client.exp.add(sender, command.exp);

        let imageRandom = [
            "https://i.ibb.co/FYkrfLC/images-8.jpg",
            "https://i.ibb.co/9hbg7K9/images-7.jpg",
            "https://i.ibb.co/NKvbSvy/images-9.jpg",
            "https://i.ibb.co/1Q5w1hs/images-10.jpg",
            "https://i.ibb.co/1J4H4Zz/images-11.jpg",
            "https://i.ibb.co/qpzrv2h/images-12.jpg"
        ];
        let ran = imageRandom[Math.floor(Math.random() * imageRandom.length)];
        const level = (await client.DB.get(`${sender}_LEVEL`)) || 0;
        const experience = await client.exp.get(sender);
        const { requiredXpToLevelUp } = getStats(level);
        if (requiredXpToLevelUp > experience) return null;
        await client.DB.add(`${sender}_LEVEL`, 1);
        client.sendMessage(
            from,
            {
                image: {
                    url: ran
                },
                caption: `\n\n\nCongratulations you leveled up from *${level} ---> ${level + 1}* 🎊\n\n\n`,
            },
            {
            quoted: M
            }
        );
    } catch (err) {
        client.log(err, 'red');
    }
                                     }
        
