const { SlotMachine, SlotSymbol } = require('slot-machine');
const ms = require('ms');

module.exports = {
    name: 'slot',
    aliases: ['bet'],
    category: 'economy',
    exp: 5,
    react: "👍",
    description: 'Bets the given amount of gold in a slot machine',
    async execute(client, arg, M) {
        const economy = (await client.DB.get('economy')) || [];
        const luck = (await client.rpg.get(`${M.sender}.luckpotion`)) || 0;

        if (!economy.includes(M.from)) return M.reply("join casino peeps");

        const cooldown = 300000;
        const lastmine = await client.DB.get(`${M.sender}.mine`);

        if (lastmine !== null && cooldown - (Date.now() - lastmine) > 0) {
            const lastminetime = ms(cooldown - (Date.now() - lastmine));
            return M.reply(`*You have to wait ${ms(lastminetime, { long: true })} for another mine*`);
        }

        const symbols = [
            new SlotSymbol('a', {
                display: '🍂',
                points: 1,
                weight: 30, // 30% chance of winning
            }),
            new SlotSymbol('b', {
                display: '🌱',
                points: 2,
                weight: 20, // 20% chance of winning
            }),
            new SlotSymbol('c', {
                display: '🍁',
                points: 0,
                weight: 20, // 20% chance of winning
            }),
            new SlotSymbol('d', {
                display: '🌾',
                points: 3,
                weight: 30, // 30% chance of winning
            }),
        ];

        if (!arg) return M.reply('Please provide the amount');
        const amount = parseInt(arg);

        if (isNaN(amount)) return M.reply('Please provide a valid amount');

        if (arg.startsWith('-') || arg.startsWith('+')) return M.reply('Please provide a valid amount');

        const credits = (await client.cradit.get(`${M.sender}.wallet`)) || 0;

        if (amount > 10000) return M.reply('You cannot bet more than 10000 gold in the slot machine');

        const machine = new SlotMachine(3, symbols).play();
        const lines = machine.lines.filter((line) => !line.diagonal);
        const points = machine.lines.reduce((total, line) => total + line.points, 0);

        let resultAmount = points <= 0 ? -amount : amount * points;

        if (luck > 0) {
            // Increase the winning rate by 20% and deduct 1 luck point
            resultAmount = resultAmount * 1.2;
            await client.rpg.subtract(`${M.sender}.luckpotion`, 1);
        }

        await client.cradit.add(`${M.sender}.wallet`, resultAmount);
        await client.DB.set(`${M.sender}.mine`, Date.now());

        let text = '🎰 *SLOT MACHINE* 🎰\n\n';
        text += machine.visualize();
        text += points <= 0 ? `\n\n📉 You lost ${amount} gold` : `\n\n📈 You won ${resultAmount} gold`;

        if (luck > 0) text += `\nYou get an additional 20% from luck potion and 1 luck point has been deducted.`;

        M.reply(text);
    },
};
