const MAX_AMOUNT = 100000000000;
const ms = require('parse-ms');

module.exports = {
    name: 'bank',
    aliases: ['bk'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Shows the bank value',
    async execute(client, arg, M) {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.bank`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        let bank = await client.cradit.get(`${M.sender}.bank`) || 0;

        if (bank > MAX_AMOUNT) {
            bank = MAX_AMOUNT;
            await client.cradit.set(`${M.sender}.bank`, bank);
            M.reply("Bank reached maximum amount; removing extra amount!");
        }

        let text = `🏦 *Bank* 🏦\n\n👤 *Name:* ${(await client.contact.getContact(M.sender, client)).username}\n🔖 *Tag:* #${M.sender.substring(3, 7)}\n💰 *Gold:* ${bank} 🪙`;

        let imageT = await client.utils.generateCreditCardImage(
            (await client.contact.getContact(M.sender, client)).username,
            '5/25'
        );
        await client.DB.set(`${M.sender}.bank`, Date.now());

        await client.sendMessage(M.from, {image: imageT, caption: text}, {quoted: M});
    }
};