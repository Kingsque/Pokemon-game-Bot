module.exports = {

    name: "setmoney",

    aliases: ["sm"],

    category: "dev",

    exp: 5,

    react: "✅",

    description: "sets money to mentioned user's wallet",

    async execute(client, arg, M) {

        if (!M.mentions.length) return M.reply('*You must mention someone to attend the robbery*')

        const amount = parseInt(arg.split(' ')[0])

        if (!amount) return M.reply('Please provide the amount')

        if (arg.split(' ')[0].startsWith('-') || arg.split(' ')[0].startsWith('+'))

            return M.reply('Please provide the amount')

        const userwallet = (await client.cradit.get(`${M.mentions[0]}.wallet`)) || 0

    //    if ((cradits - amount) < 0) return M.reply('You dont have that much in your wallet')

        await client.cradit.set(`${M.mentions[0]}.wallet`, amount)

      //  await client.cradit.sub(`${M.sender}.wallet`, amount)

        client.sendMessage(

            M.from,

            { text: `You gave *${amount}* to *@${M.mentions[0].split('@')[0]}* \nNew Balance: ${userwallet}`, mentions: [M.mentions[0]] },

            { quoted: M }

        )

    }

}
