const ms = require('parse-ms')

module.exports = {
    name: 'daily',
    aliases: ['rewards'],
    category: 'economy',
    exp: 5,
    react: "✅",
    description: 'Claims your daily rewards',
    async execute(client, arg, M) {
      const dailyTimeout = 86400000;
      const dailyAmount = 1000;
      const userId = M.sender;
      const economy = await client.econ.findOne({ userId });
      const daily = economy.daily;
      let message = '';
      if (daily !== null && dailyTimeout - (Date.now() - daily) > 0) {
        const dailyTime = ms(dailyTimeout - (Date.now() - daily));
        message = `*You have already claimed your daily reward. You have to wait ${dailyTime.hours} hour(s) ${dailyTime.minutes} minute(s), ${dailyTime.seconds} second(s).*`;
      } else {
        message = `*You have claimed your daily reward 🎉: ${dailyAmount}.*`;
        economy.wallet += dailyAmount;
        await economy.save();
      }
      M.reply(message);
    },
  };
