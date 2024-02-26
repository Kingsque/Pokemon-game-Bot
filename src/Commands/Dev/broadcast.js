module.exports = {
    name: 'broadcast',
    aliases: ['bc'],
    category: 'dev',
    exp: 0,
    react: "✅",
    description: 'Will make a broadcast for groups where the bot is in. Can be used to make announcements',
    async execute(client, arg, M) {
       try{
        
        if (!arg) return M.reply('🚫 Oops! It seems like you forgot to provide a query for the broadcast. Please enter a message or query to proceed.')

        const getGroups = await client.groupFetchAllParticipating()
     
        const groups = Object.entries(getGroups)
        .slice(0)
        .map((entry) => entry[1])
        
        const res = groups.map((v) => v.id)
        console.log(res)
        M.reply(`Broadcasting in ${res.length} Group Chat, in ${res.length * 1.5} seconds`)
        
        for (let i of res) {
            const groupMetadata = await client.groupMetadata(i)
            const groupMembers = groupMetadata?.participants.map((x) => x.id) || []
            const text = `🔰*「 ${client.name.toUpperCase()} BROADCAST 」*🔰\n\n🏮 Message: ${arg}\n\n🌺 *Regards:* @${M.sender.split("@")[0]}`
            await client.sendMessage(i, {
                video: {
                    url: 'https://cdn.shoob.gg/images/cards/S/ff0dc509bf545270287c88ff4a1c3478be303f01145dda85e30349ec3b6b720d.gif'
                },
                gifPlayback: true,
                mentions: groupMembers,
                caption: `${text}`,
            })
        }
        
        M.reply(`✅ Broadcast Message sent to *${res.length} groups*.`)
    
    }catch(err){
        await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`})
      }
    }
}
//M.quoted.mtype === 'imageMessage',
