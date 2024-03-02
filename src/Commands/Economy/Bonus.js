const ms = require('parse-ms');
const path = require('path');

module.exports = {
    name: 'bonus',
    aliases: ['bonus'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Claims your bonus',
    async execute(client, arg, M) {

        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.bonus`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }
        const deck = await client.DB.get(`${M.sender}_Deck`) || [];
        const user = client.DB.get(`users`);
        const filePath = path.join(__dirname, '../../Handlers/card.json');
        const data = require(filePath);
        const bonusTimeout = 31536000000; // 1 year in milliseconds
        const bonusAmount = 50000;
        const bonus = await client.credit.get(`${M.sender}.bonus`);
        let text = '';

        if (bonus !== null && bonusTimeout - (Date.now() - bonus) > 0) {
            const bonusTime = ms(bonusTimeout - (Date.now() - bonus));
            text += `*You have already claimed your bonus reward. You cannot claim it again. Time left: ${bonusTime.days}d ${bonusTime.hours}h ${bonusTime.minutes}m ${bonusTime.seconds}s.*`;
        } else {
            text += `*Welcome to our Celestic family! We are really happy to have you as our member. You have claimed your bonus reward 🎉: ${bonusAmount}.*`;

            // Check if user is among the first ten
            const firstTenUsers = Object.values(await client.contactDB.all());
            if (firstTenUsers.length < 10) {
                // Give a random T6 card
                const randomT6Index = Math.floor(Math.random() * data.t6.length);
                const randomT6 = data.t6[randomT6Index];
                deck.push(randomT6);
                await client.DB.set(`${M.sender}_Deck`, deck);

                text += `You are also one of the first ten users and have received a free random T6 card: ${randomT6}.`;
            } 

            await client.credit.add(`${M.sender}.wallet`, bonusAmount);
            await client.DB.set(`${M.sender}.bonus`, Date.now());
            await client.credit.set(`${M.sender}.bonus`, Date.now());
        }

        M.reply(text);
    }
};