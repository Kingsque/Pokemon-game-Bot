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
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
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