const ms = require('parse-ms');

module.exports = {
    name: 'slot2',
    aliases: ['slot2'],
    category: 'economy',
    exp: 5,
    cool: 8,
    react: '🎰',
    description: 'Play slot game',
    async execute(client, arg, M) {

        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }

        const participant = await client.DB.get('economy') || [];
        if (!participant.includes(M.from)) {
            return M.reply(`To use economy commands, join the casino group by using ${client.prefix}support`);
        }

        const today = new Date();
        if ([5, 6, 0].includes(today.getDay())) {
            if (arg === 'help') {
                return M.reply(`*Instructions:*\n1. Use :slot2 to play.\n2. You must have at least 🪙1000 in your wallet.\n3. If your wallet is empty, withdraw from your bank.\n4. If you have no money in your bank, use other economy features to gain money.\n5. Try your luck by spinning the slots and see what you win!`);
            } else if (arg === 'money') {
                return M.reply(`*Payouts:*\n1. Small Win: +🪙3000\n2. Small Lose: -🪙3700\n3. Big Win: +🪙5000\n4. Big Lose: -🪙6000\n5. 🎉 JackPot: +🪙20000`);
            }

            const fruits = ['🍉', '🍒', '🍈', '🍍', '🥭', '🍇', '🍌', '🍓', '🍏'];
            const emojis = ['😢', '😩', '😀', '😎', '🤑', '🎉', '🥳'];

            const lose = ['*You suck at playing this game*\n\n_--> 🍍-🍉-🍒_', '*Totally out of line*\n\n_--> 🍉-🍒-🍍_', '*Are you a newbie?*\n\n_--> 🍒-🍍-🍉_'];
            const smallLose = ['*You cannot harvest watermelon 🍉 in a pineapple 🍍 farm*\n\n_--> 🍍>🍉<🍍_', '*Guava and watermelon are not the best combo*\n\n_--> 🍒>🍉<🍒_', '*Watermelon and guava are not a great deal*\n\n_--> 🍉>🍒<🍉_'];
            const won = ['*You harvested a basket of*\n\n_--> 🍒+🍒+🍒_', '*Impressive, You must be a specialist in plucking coconuts*\n\n_--> 🍉+🍉+🍉_', '*Amazing, you are going to be making pineapple juice for the family*\n\n_--> 🍍+🍍+🍍_'];
            const near = ['*Wow, you were so close to winning pineapples*\n\n_--> 🍒-🍍+🍍_', '*Hmmm, you were so close to winning Apples*\n\n_--> 🍒+🍒-🍍_'];
            const jack = ['*🥳 JackPot 🤑*\n\n_--> 🍈×🍈×🍈×🍈_', '*🎉 JaaackPooot!*\n\n_--> 🍉×🍉×🍉×🍉_', '*🎊🤤 You Just hit a jackpot worth 🪙10000*'];
            const broke = ['*Oops! You went broke!*', '*No luck this time, try again later!*', '*Better luck next time, mate!*'];
            const lottery = ['*Congratulations! You won the lottery!*\n_--> 🤑💰💸_', '*You hit the jackpot! Time to celebrate!* 🎉💰', '*Amazing! Youre now a millionaire!* 💸🍾'];
            const baddyDuo = ['*Oh no! Bad luck strikes twice!*', '*Double trouble! Its not your day!*', '*You got hit twice! Tough luck!*'];
            const sadStrike = ['*Sad strike! Better luck next time!*', '*Its not your lucky day!*', '*Unfortunate outcome! Keep trying!*'];
            const rich = ['*Youre on a roll! Keep it up!*', '*Jackpot! The moneys pouring in!*', '*Riches are flowing in! Congrats!*'];

            const balance = await client.cradit.get(`${M.sender}.wallet`) || 0;
            const betAmount = 1000;

            if (balance < betAmount) {
                return M.reply(`You need at least 🪙${betAmount} to play!`);
            }

            await client.DB.set(`${M.sender}.slot2`, Date.now());

            const results = [];
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * fruits.length);
                results.push(fruits[randomIndex]);
            }

            const uniqueResults = new Set(results);
            const emojisIndex = uniqueResults.size - 1;

            const payout = [0, -3700, 3000, 5000, -6000, 20000];
            const winAmount = payout[uniqueResults.size];

            await client.cradit.add(`${M.sender}.wallet`, winAmount);

            const emoji = emojis[emojisIndex];
            const message = [
                `*Spin Results:*\n${results.join(' | ')}\n\n${emoji} ${winAmount >= 0 ? 'Congratulations!' : 'Better luck next time!'} ${emoji}\n${winAmount !== 0 ? `*Payout:* ${winAmount >= 0 ? '+' : ''}🪙${Math.abs(winAmount)}` : ''}`
            ];

            if (uniqueResults.size === 3) {
                message.push(`🎊 You got a *Triple Combo*! You might want to try again for the Jackpot! 🎰`);
            } else if (uniqueResults.size === 1) {
                message.push(`🎉 *JACKPOT!* You hit the Jackpot! 🤑`);
            }

            const mess1 = lose[Math.floor(Math.random() * lose.length)];
            const mess2 = won[Math.floor(Math.random() * won.length)];
            const mess3 = near[Math.floor(Math.random() * near.length)];
            const mess4 = jack[Math.floor(Math.random() * jack.length)];
            const mess5 = smallLose[Math.floor(Math.random() * smallLose.length)];
            const mess6 = broke[Math.floor(Math.random() * broke.length)];
            const mess7 = lottery[Math.floor(Math.random() * lottery.length)];
            const mess8 = baddyDuo[Math.floor(Math.random() * baddyDuo.length)];
            const mess9 = sadStrike[Math.floor(Math.random() * sadStrike.length)];
            const mess10 = rich[Math.floor(Math.random() * rich.length)];

            return M.reply(message.join('\n'));
        } else {
            return M.reply(`*You can play this game only on Fridays, Saturdays, and Sundays!*`);
        }
    },
};
