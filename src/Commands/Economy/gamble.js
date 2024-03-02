const { Sticker } = require('wa-sticker-formatter');
const ms = require('parse-ms');

module.exports = {
    name: 'gamble',
    aliases: ['gb'],
    category: 'economy',
    exp: 5,
    cool: 8,
    react: "✅",
    description: 'Gambles your money and increase',
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
        
        const directions = ['right', 'left'];
        const [amount, direction] = arg.split(' ');
        if (!amount || !directions.includes(direction)) return M.reply('Please provide a valid amount and direction.');
        if (!(/^\d+$/).test(amount)) return M.reply('Please provide a valid amount.');
        
        const credits = (await client.cradit.get(`${M.sender}.wallet`)) || 0;
        if ((credits - amount) < 0) return M.reply('You don\'t have that much in your wallet.');
        if (amount > 20000) return M.reply('You cannot gamble more than 20000.');

        const result = Math.random() < 0.5 ? 'left' : 'right';
        await client.cradit.add(`${M.sender}.wallet`, result === direction ? amount : -amount);
        M.reply(result === direction ? `🎉 You won ${amount}` : `🥀 You lost ${amount}`);

        const stickerUrl = result === 'right'
            ? 'https://i.ibb.co/SrtvnFH/ezgif-com-rotate.gif'
            : 'https://bestanimations.com/media/left/365059883left-arrow-18.gif';
        
        const sticker = new Sticker(stickerUrl, {
            pack: ' ',
            author: ' ',
            quality: 90,
            type: 'full',
            background: '#0000ffff'
        });

        await client.sendMessage(M.from, { sticker: await sticker.build() }, { quoted: M });
        await client.DB.set(`${M.sender}.gamble`, Date.now());
    }
};