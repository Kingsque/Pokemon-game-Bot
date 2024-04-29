// Savings Command
const MAX_AMOUNT = 100000000;

module.exports = {
    name: 'savings',
    aliases: ['ss'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :savings',
    description: 'Shows the savings value of user',
    async execute(client, arg, M) {
        let bank = await client.gem.get(`${M.sender}.bank`) || 0;

        // Convert negative amount to 0
        if (bank < 0) {
            bank = 0;
            await client.gem.set(`${M.sender}.bank`, bank);
        }

        // Convert decimal or fraction amounts to nearest integer
        if (!Number.isInteger(bank)) {
            bank = Math.round(bank);
            await client.gem.set(`${M.sender}.bank`, bank);
        }

        if (bank > MAX_AMOUNT) {
            bank = MAX_AMOUNT;
            await client.gem.set(`${M.sender}.bank`, bank);
            M.reply("Bank reached maximum amount; removing extra amount!");
        }

        let text = `🏦 *Your Savings* 🏦\n\n👤 *Name:* ${(await client.contact.getContact(M.sender, client)).username}\n🔖 *Tag:* #${M.sender.substring(3, 7)}\n💰 *Credits:* ${bank} `;

        let imageT = await client.utils.generateCreditCardImage(
            (await client.contact.getContact(M.sender, client)).username,
            '5/25'
        );

        M.reply(text);
    }
};
