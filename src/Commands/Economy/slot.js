const { SlotMachine, SlotSymbol } = require('slot-machine');

module.exports = {
    name: 'slot',
    aliases: ['bet'],
    category: 'economy',
    exp: 5,
    cool: 8,
    react: "👍",
    usage: 'Use :slot <amount>',
    description: 'Bets the given amount of credits in a slot machine',
    async execute(client, arg, M) {

        const symbols = [
            new SlotSymbol('a', {
                display: '🍉',
                points: 3,
                weight: 30,
            }),
            new SlotSymbol('b', {
                display: '🥭',
                points: 2,
                weight: 20,
            }),
            new SlotSymbol('c', {
                display: '🍇',
                points: 1,
                weight: 10,
            }),
            new SlotSymbol('d', {
                display: '🍓',
                points: 2,
                weight: 10,
            }),
        ];

        if (!arg) return M.reply('Please provide the amount');
        const amount = parseInt(arg);

        if (isNaN(amount)) return M.reply('Please provide a valid amount');
        if (arg.startsWith('-') || arg.startsWith('+')) return M.reply('Please provide a valid amount');

        const credits = (await client.credit.get(`${M.sender}.wallet`)) || 0;

        if (amount > credits) return M.reply('You don\'t have sufficient funds');
        if (amount > 10000) return M.reply('You cannot bet more than 10000 gold in the slot machine');

        const machine = new SlotMachine(3, symbols).play();
        const lines = machine.lines.filter((line) => !line.diagonal);
        const points = machine.lines.reduce((total, line) => total + line.points, 0);

        let resultAmount = points <= 0 ? -amount : amount * points;

        const jackpotChance = Math.random();
        if (jackpotChance <= 0.01) {
            const jackpotWin = amount * 10;
            resultAmount += jackpotWin;
            M.reply(`🎉 Congratulations! You hit the jackpot and won ${jackpotWin} credits!`);
        }

        const luck = (await client.rpg.get(`${M.sender}.luckpotion`)) || 0;
        const luckFactor = 1 + (Math.random() * luck) / 10; 

        if (points > 0 || luckFactor > 1) {
            await client.credit.add(`${M.sender}.wallet`, resultAmount);
        }

        let text = '🎰 *SLOT MACHINE* 🎰\n\n';
        text += machine.visualize();
        
        if (points <= 0 && luck > 0) {
            resultAmount = 0;
            await client.rpg.sub(`${M.sender}.luckpotion`, 1);
            text += '\n\n🍀 You have been saved by your luck potion!';
        } else {
            text += points <= 0 ? `\n\n📉 You lost ${amount} credits` : `\n\n📈 You won ${resultAmount} credits`;
        }

        M.reply(text);
    },
};
