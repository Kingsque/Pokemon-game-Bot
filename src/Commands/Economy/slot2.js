const { Sticker } = require('wa-sticker-formatter');
const ms = require('parse-ms');

module.exports = {
    name: 'slot',
    aliases: ['slot'],
    category: 'Economy',
    react: '🎰',
    description: 'Play slot game',
    execute: async (client, message, args) => {
        const { text, prefix, ECOstatus } = args;
        const user = message.sender;
        const eco = client.eco; // Assuming client has an eco object
        
        if (ECOstatus === 'false') {
            return message.reply(`This group is not Economy enabled!\n\nTo configure Economy mode, type:\n\n*${prefix}ecomenu*`);
        }

        const today = new Date();
        const dayOfWeek = today.getDay();
        const isWeekend = dayOfWeek >= 5; // Friday to Sunday

        if (!isWeekend) {
            return message.reply('This command is only available from Friday to Sunday.');
        }
        if (today.getDay() >= 1 && today.getDay() <= 5) {
            if (text === 'help') {
                return message.reply(`*1:* Use ${prefix}slot to play\n\n*2:* You must have 🪙100 in your wallet\n\n*3:* If you don't have money in wallet then withdraw from your bank\n\n*4:* If you don't have money in your bank too then use economy features to gain money`);
            } else if (text === 'money') {
                return message.reply(`*1:* Small Win --> +🪙300\n\n*2:* Small Lose --> -🪙100\n\n*3:* Big Win --> +🪙500\n\n*4:* Big Lose --> -🪙300\n\n*5:* 🎉 JackPot --> +🪙10000`);
            }

            const fruit1 = ['🍑', '🍒', '🍇'];
            const fruit2 = ['🍒', '🍇', '🍑'];
            const fruit3 = ['🍇', '🍑', '🍒'];
            const lose = ['*You suck at playing this game*\n\n_--> 🍍-🍑-🍒_', '*Totally out of line*\n\n_--> 🍑-🍒-🍍_', '*Are you a newbie?*\n\n_--> 🍒-🍍-🍑_'];
            const smallLose = ['*You cannot harvest coconut 🍑 in a pineapple 🍍 farm*\n\n_--> 🍍>🍑<🍍_', '*Apples and Coconut are not best Combo*\n\n_--> 🍒>🍑<🍒_', '*Coconuts and Apple are not great deal*\n\n_--> 🍑>🍒<🍑_'];
            const won = ['*You harvested a basket of*\n\n_--> 🍒+🍒+🍒_', '*Impressive, You must be a specialist in plucking coconuts*\n\n_--> 🍑+🍑+🍑_', '*Amazing, you are going to be making pineapple juice for the family*\n\n_--> 🍍+🍍+🍍_'];
            const near = ['*Wow, you were so close to winning pineapples*\n\n_--> 🍒-🍍+🍍_', '*Hmmm, you were so c lose to winning Apples*\n\n_--> 🍒+🍒-🍍_'];
            const jack = ['*🥳 JackPot 🤑*\n\n_--> 🍇×🍇×🍇×🍇_', '*🎉 JaaackPooot!*\n\n_--> 🍑×🍑×🍑×🍑_', '*🎊🤤 You Just hit a jackpot worth 🪙10000*'];

            const balance1 = await eco.balance(user, 'cara');
            const k = 1000;

            if (k > balance1.wallet) {
                return message.reply(`You are going to be spinning on your wallet, you need at least 🪙1000`);
            }

            const f1 = fruit1[Math.floor(Math.random() * fruit1.length)];
            const f2 = fruit2[Math.floor(Math.random() * fruit2.length)];
            const f3 = fruit3[Math.floor(Math.random() * fruit3.length)];
            const mess1 = lose[Math.floor(Math.random() * lose.length)];
            const mess2 = won[Math.floor(Math.random() * won.length)];
            const mess3 = near[Math.floor(Math.random() * near.length)];
            const mess4 = jack[Math.floor(Math.random() * jack.length)];
            const mess5 = smallLose[Math.floor(Math.random() * smallLose.length)];

            if (f1 !== f2 && f2 !== f3) {
                await eco.deduct(user, 'cara', 300);
                return message.reply(`${mess1}\n\n*Big Lose -->* _🪙300_`);
            } else if (f1 === f2 && f2 === f3) {
                await eco.give(user, 'cara', 500);
                return message.reply(`${mess2}\n*_Big Win -->* _🪙500_`);
            } else if (f1 === f2 && f2 !== f3) {
                await eco.give(user, 'cara', 300);
                return message.reply(`${mess3}\n*Small Win -->* _🪙300_`);
            } else if (f1 !== f2 && f1 === f3) {
                await eco.deduct(user, 'cara', 100);
                return message.reply(`${mess5}\n\n*Small Lose -->* _🪙100_`);
            } else if (f1 !== f2 && f2 === f3) {
                await eco.give(user, 'cara', 300);
                return message.reply(`${mess3}\n\n*Small Win -->* _🪙300_`);
            } else if (f1 === f2 && f2 === f3 && f3 === f4) {
                await eco.give(user, 'cara', 10000);
                return message.reply(`${mess4}\n\n_🍫 JackPot --> _🪙10000_`);
            } else {
                return message.reply(`Do you understand what you are doing?`);
            }
        } else {
            return message.reply(`*You can Now play this game everyday*\n\n*`);
        }
    },
};
