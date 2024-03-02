const ms = require('parse-ms');

module.exports = {
    name: 'guide',
    aliases: ['guide', 'schedule', 'events'],
    category: 'general',
    exp: 15,
    cool: 4,
    react: "✅",
    description: 'This is noteboard, guide and rules board. You can check here about updates, about guide or about rules.',
    async execute(client, arg, M) {
  
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }


      const image = await client.utils.getBuffer('https://i.ibb.co/1sbf4Zn/Picsart-24-02-20-16-40-03-063.jpg');

      let text = ''
      text += `🔰 *AURORA* 🔰\n`;
      text += `This is our WhatsApp game bot Aurora. Here you can enjoy using our bot and its functions. You can play the anime card game, which is one of the famous games on WhatsApp. If you want any new features in our bot or want to report anything, use the report command.There is also a economy feature in our bot where you can play like casino.Our bot includes rpg gaming functions too.We also have exclusive games.If you want to know abpout any command use :help and try those commands.\n\n`;
      text +=  `[EVENTS]\n\n`;
      text += `EVERYDAY THR CASINO WILL BE OPENED FOR 1-3 TIMES to avoid spam and bot number ban and also you can enjoy casino features daily to increase your wealth\n`;
      text += `OFFICIAL GROUP WILL BE OPENED EVERYTIME SO THAT YOU CAN PLAY, SALE, TRADE, BUY, GIVE OR CLAIM CARDS\n`;
      text += `AUCTION GROUP WILL BE OPENED ON SUNDAY PER WEEK FOR THREE EVENT T4 AUCTION AND ONE T5 AUCTION ALSO SOMETIMES NORMAL CARDS.ON EVERY 100 USERS THERE WILL BE A EVENT OF THREE EVENT T5, TWO EVENT T6 AND ONE RARE OR NEW TS.AUCTION CARDS WILL BE DETERMINED BY VOTINGS THROUGH VOTE COMMAND.\n`;
      text += `CARD SHOP WILL BE RUNNED IN THE MAIN GC THERE YOU CAN USE RPG COMMANDS TO INCREASE YOUR MATERIALS FOR BUYNG CARD FROM SHOP AND THE CARD SHOP COMMAND CAN BE USED ANYTIME BUT THE BUY CARD COMMAND WILL BE ONLY OPENED DURING SATURDAY\n`;
      text += `THE GAMES COMMAND WILL BE OPENED DURING MONDAY TO FRIDAY\n\n`;
      text += `Contacts`
      text += `website= https://kingshisui00.github.io/web-aurora/`  
      text += `ʏᴏᴜᴛᴜʙᴇ =`  
      text += `ɢᴍᴀɪʟ = `
      
      await client.sendMessage(M.from, { image: { url: image }, caption: text }, { quoted: M });
await client.DB.set(`${M.sender}.guide`, Date.now());
    }
}
