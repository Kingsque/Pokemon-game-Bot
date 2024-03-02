const ms = require('parse-ms');

module.exports = {
    name: 'withdraw',
    aliases: ["wt", "with"],
    category: 'economy',
    exp: 5,
    cool:4,
    react: "✅",
    description: 'Withdraws golds in your bank',
    async execute(client, arg, M) {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.wd`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        if (!arg || isNaN(arg)) return M.reply('Please provide a valid amount')
        const amount = parseInt(arg)
        if (amount <= 0) return M.reply('Please provide a valid amount')
        const credits = (await client.credits.get(`${M.sender}.bank`)) || 0
        if (credits < amount) return M.reply('You do not have enough in your bank')
        await client.credits.add(`${M.sender}.wallet`, amount)
        await client.credits.sub(`${M.sender}.bank`, amount)
        M.reply(`You have successfully withdrawn ${amount} from your bank`)
        await client.DB.set(`${M.sender}.wd`, Date.now());
    }
}