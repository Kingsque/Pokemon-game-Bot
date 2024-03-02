// prettier-ignore
const checks = ['awesome', 'great', 'gay', 'cute', 'lesbian', 'horny', 'pretty', 'lovely', 'ugly', 'beautiful', 'handsome', 'character']
const ms = require('parse-ms');

module.exports = {
    name: 'checkuser',
    aliases: ['cu', ...checks.map(check => `${check}check`)],
    exp: 10,
    cool: 4,
    react: "✅",
    category: 'fun',
    description: 'Checks on user',
    async execute(client, arg, M) {
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }
        const text = arg.trim()
        const command = M.body.split(' ')[0].toLowerCase().slice(client.prefix.length).trim()
        if (command === 'checkuser' || command === 'cu') {
            if (!text) {
                const CheckList = `🎃 *Available Checks:*\n\n- ${checks
                    .map((check) => client.utils.capitalize(check))
                    .join('\n- ')}\n🛠️ *Usage:* ${client.prefix}check [tag/quote user] | ${
                    client.prefix
                }(check) [tag/quote user]\nExample: ${client.prefix}awesomecheck`
                return await M.reply(CheckList)
            }
        }
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (!M.mentions.length) M.mentions.push(M.sender)
        const types = [
            'Compassionate',
            'Generous',
            'Grumpy',
            'Forgiving',
            'Obedient',
            'Good',
            'Simp',
            'Kind-Hearted',
            'Patient',
            'UwU',
            'Top, anyway',
            'Helpful'
        ]
        const character = types[Math.floor(Math.random() * types.length)]
        const percentage = Math.floor(Math.random() * 100) + 1
        const sentence = command.split('check')
        const title = command.toUpperCase()
        await client.sendMessage(
            M.from,
            {
                text: `*=======[${title}]=======*\n\n @${M.mentions[0].split('@')[0]} is ${
                    command !== 'charactercheck' ? `${percentage}% ${sentence[0]}` : `${percentage}% ${character}`
                }`,
                mentions: [M.mentions[0]]
            },
            {
                quoted: M
            }
        )
        await client.DB.set(`${M.sender}.cu`, Date.now());
    }
}