const MAX_AMOUNT = 100000000;

module.exports = {
    name: 'bank',
    aliases: ['bk'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Shows the bank value of user',
    async execute(client, arg, M) {
        let bank = await client.credit.get(`${M.sender}.bank`) || 0;

        if (bank > MAX_AMOUNT) {
            bank = MAX_AMOUNT;
            await client.credit.set(`${M.sender}.bank`, bank);
            M.reply("Bank reached maximum amount; removing extra amount!");
        }

        let text = `🏦 *Bank* 🏦\n\n👤 *Name:* ${(await client.contact.getContact(M.sender, client)).username}\n🔖 *Tag:* #${M.sender.substring(3, 7)}\n💰 *Credits:* ${bank} 🪙`;

        let imageT = await client.utils.generateCreditCardImage(
            (await client.contact.getContact(M.sender, client)).username,
            '5/25'
        );

        await client.sendMessage(M.from, {image: imageT, caption: text}, {quoted: M});
    }
};