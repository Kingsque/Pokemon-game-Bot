const path = require('path');
const cron = require("node-cron");
const axios = require('axios');

module.exports = async (client) => {
  try {
    const cardgame = await client.DB.get('card-game') || [];

    for (let i = 0; i < cardgame.length; i++) {
      const jid = cardgame[i];
      console.log(jid);

      if (cardgame.includes(jid)) {
        let count = 0;
        let sOr6Counter = 0;
        const sOr6Interval = 20;
        const sOr6Limit = 2;

        cron.schedule('*/10 * * * *', async () => {
          try {
            const { data } = await axios.get("https://raw.githubusercontent.com/Kingshisui00/Aurora-Private/main/src/Helpers/card.json?token=GHSAT0AAAAAACPV6EDTBPANOBYFCBTPWFZIZQBUIQA");
            let obj, price;

            const index = Math.floor(Math.random() * data.length);
            obj = data[index];
            switch (obj.tier) {
              case "1":
                price = client.utils.getRandomInt(500, 900);
                break;
              case "2":
                price = client.utils.getRandomInt(1000, 3000);
                break;
              case "3":
                price = client.utils.getRandomInt(3000, 4000);
                break;
              case "4":
                price = client.utils.getRandomInt(5000, 8000);
                break;
              case "5":
                price = client.utils.getRandomInt(10000, 14000);
                break;
            }
            count++;
            sOr6Counter++;

            if (sOr6Counter === sOr6Interval && sOr6Counter <= (sOr6Interval * sOr6Limit)) {
              const filteredData = data.filter(card => card.tier === "S" || card.tier === "6");
              const index = Math.floor(Math.random() * filteredData.length);
              obj = filteredData[index];
              switch (obj.tier) {
                case "6":
                  price = client.utils.getRandomInt(15000, 30000);
                  break;
                case "S":
                  price = client.utils.getRandomInt(50000, 100000);
                  break;
              }
            }

            console.log(`Sended:${obj.tier + "  Name:" + obj.title + "  For " + price + " in " + jid}`);
            await client.cards.set(`${jid}.card`, `${obj.title}-${obj.tier}`);
            await client.cards.set(`${jid}.card_price`, price);

            if (obj.tier.includes('6') || obj.tier.includes('S')) {
              const giif = await client.utils.getBuffer(obj.url);
              const cgif = await client.utils.gifToMp4(giif);
              return client.sendMessage(jid, {
                video: cgif,
                caption: `🎴 *━『 ANIME-CARD 』━* 🎴\n\n💮 Name: ${obj.title}\n\n💠 Tier: ${obj.tier}\n\n🏮 Price: ${price}\n\n📤 *Info:* This cards are originally owned by *https://shoob.gg* we are using it with all the required permissions.\n\n🔖 [ Use *${process.env.PREFIX}collect* to claim the card, *${process.env.PREFIX}collection* to see your *Cards* ]`,
                gifPlayback: true,
              });
            } else {
              return client.sendMessage(jid, {
                image: {
                  url: obj.url,
                },
                caption: `🎴 *━『 ANIME-CARD 』━* 🎴\n\n💮 Name: ${obj.title}\n\n💠 Tier: ${obj.tier}\n\n🏮 Price: ${price}\n\n📤 *Info:* This cards are originally owned by *https://shoob.gg* we are using it with all the required permissions.\n\n🔖 [ Use *${process.env.PREFIX}collect* to claim the card, *${process.env.PREFIX}collection* to see your *Cards* ]`,
              });
            }

          } catch (err) {
            console.log(err);
            await client.sendMessage(jid, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Error-Chan Dis\n\nCommand no error wa:\n${err}` });
          }
        });

        cron.schedule('*/4 * * * *', async () => {
          await client.cards.delete(`${jid}.card`);
          await client.cards.delete(`${jid}.card_price`);
          console.log(`Card deleted after 4minutes`);
        });
      }
    }

  } catch (error) {
    console.log(error);
  }
};
              
