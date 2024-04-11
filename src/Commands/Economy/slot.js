const { SlotMachine, SlotSymbol } = require('slot-machine');

module.exports = {
    name: 'slot',
    aliases: ['bet'],
    category: 'economy',
    exp: 5,
    cool: 8,
    react: "👍",
    usage: 'Use: !slot <amount>',
    description: 'Bets the given amount of credits in a slot machine',
    async execute(client, arg, M) {

        const symbols = [
            new SlotSymbol('a', {
                display: '🍉',
                points: 1,
                weight: 2, // Adjusted weight for winning approximately 2 out of 10 times
            }),
            new SlotSymbol('b', {
                display: '🥭',
                points: 0,
                weight: 3, // Adjusted weight
            }),
            new SlotSymbol('c', {
                display: '🍇',
                points: 0,
                weight: 4, // Adjusted weight
            }),
            new SlotSymbol('d', {
                display: '🍓',
                points: 1,
                weight: 1, // Adjusted weight
            }),
        ];

        if (!arg) return M.reply('Please provide the amount');
        const amount = parseInt(arg);

        if (isNaN(amount) || amount <= 0 || amount % 1 !== 0) return M.reply('Please provide a valid integer amount');
        if (arg.startsWith('-') || arg.startsWith('+')) return M.reply('Please provide a valid amount');

        const credits = (await client.credit.get(`${M.sender}.wallet`)) || 0;

        if (amount > credits) return M.reply("You don't have sufficient funds");
        if (amount > 10000) return M.reply('You cannot bet more than 10000 credits in the slot machine');
        if (amount < 500) return M.reply('You cannot bet less than 500 credits in the slot machine');

        const machine = new SlotMachine(3, symbols).play();
        const lines = machine.lines.filter((line) => line.symbols.every((symbol) => symbol === machine.grid[0][0]));
        const points = lines.length ? lines[0].points : 0;

        let resultAmount = points <= 0 ? -amount : amount * points;

        const jackpotChance = Math.random();
        const isJackpotTriggered = jackpotChance < 0.05 && lines.length > 0; // Jackpot only if all symbols match in a row
        
        if (isJackpotTriggered) {
            const jackpotWin = Math.min(amount * 20, 200000); // Set the result amount to jackpot win with max of 200000
            resultAmount = jackpotWin;
            await client.credit.add(`${M.sender}.wallet`, resultAmount);
            return M.reply(`🎉 Congratulations! You hit the jackpot and won ${resultAmount} credits!`);
        } else {
            const luck = (await client.rpg.get(`${M.sender}.luckpotion`)) || 0;
            const luckFactor = 1 + (Math.random() * luck) / 10 * 0.6; // Reduce luck potion potency
            
            if (points > 0 || Math.random() < luckFactor) { // Introduce luck probability here
                resultAmount *= luckFactor; // Multiply result amount by luck factor
            }
        }

        resultAmount = Math.round(resultAmount); // Round the result amount to an integer
        await client.credit.add(`${M.sender}.wallet`, resultAmount);

        let text = '🎰 *SLOT MACHINE* 🎰\n\n';
        text += machine.visualize();

        if (points <= 0 && luck > 0 && Math.random() < 0.4) { // Adjust the probability here
            resultAmount = 0;
            await client.rpg.sub(`${M.sender}.luckpotion`, 1);
            text += '\n\n🍀 You have been saved by your luck potion!';
        } else {
            text += points <= 0 ? `\n\n📉 You lost ${amount} credits` : `\n\n📈 You won ${resultAmount} credits`;
        }

        M.reply(text);
    },
};
