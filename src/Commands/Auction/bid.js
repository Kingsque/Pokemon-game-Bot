module.exports = {
  name: 'bid',
  aliases: ['auction-bid'],
  category: 'auction',
  exp: 5,
  cool: 5,
  react: "✅",
  description: 'Bid an amount on an ongoing auction',
  async execute(client, arg, M) {

    try {
      const winned = await client.DB.get(`${M.from}.winned`);
      if (winned.includes(M.sender)) {
        return M.reply('You already won one');
      }

      const auctionInProgress = await client.DB.get(`${M.from}.auctionInProgress`);
      if (!auctionInProgress) {
        return M.reply("There is no ongoing auction at the moment.");
      }
  
      const isParticipant = (await client.DB.get('auction')) || [];
      if (!isParticipant.includes(M.from)) {
        return M.reply(`To participate in the auction, join the auction group by using ${client.prefix}support`);
      } else if (!arg) {
        return M.reply('Please provide the amount you want to bid.');
      } else {
        const amount = parseInt(arg);
        if (isNaN(amount)) {
          return M.reply('Please provide a valid amount for your bid.');
        } else if (amount <= 0) {
          return M.reply('Please provide a positive amount for your bid.');
        }

        const currentBid = (await client.DB.get(`${M.from}.bid`)) || 0;
        const credits = (await client.cradit.get(`${M.sender}.wallet`)) || 0;

        if (amount <= currentBid) {
          return M.reply("Your bid must be higher than the current highest bid.");
        } else if (amount > credits) {
          return M.reply('You do not have enough credits for this bid.');
        } else {
          await client.DB.set(`${M.from}.bid`, amount);
          await client.DB.set(`${M.from}.auctionWinner`, M.sender);
          const responseText = `You have successfully placed a bid of ${amount} credits.`;
          return M.reply(responseText);
        }
      }
    } catch (err) {
      console.log(err);
      await client.sendMessage(M.from, { image: { url: client.utils.errorChan() }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}` });
    }
  }
};