const cron = require("node-cron");
const axios = require('axios');
const path = require('path');
require("./Message");

module.exports = CardHandler = async (client, m) => {
  try {
    let cardgames = await client.DB.get('card-game');
    const cardgame = cardgames || [];

    if (cardgame.length > 0) {
      const randomIndex = Math.floor(Math.random() * cardgame.length);
      const randomJid = cardgame[randomIndex];
      let jid = randomJid;
      console.log(jid);

      if (cardgame.includes(jid)) {
        let count = 0;
        let tsCounter = 0;
        let t6Counter = 0;
        const tsInterval = 10;
        const t6Interval = 5; // Different interval for t6
        const tsLimit = 15;
        const t6Limit = 10; // Different limit for t6

        cron.schedule('*/10 * * * *', async () => {
          try {
            const filePath = path.join(__dirname, '../Helpers/card.json');
            const data = require(filePath);

            const index = Math.floor(Math.random() * data.length);
            let obj, price;

            obj = data[index];
            switch (obj.tier) {
              case "1":
                price = client.utils.getRandomInt(1000, 2000);
                break;
              case "2":
                price = client.utils.getRandomInt(2000, 3000);
                break;
              case "3":
                price = client.utils.getRandomInt(3000, 5000);
                break;
              case "4":
                price = client.utils.getRandomInt(5000, 8000);
                break;
              case "5":
                price = client.utils.getRandomInt(15000, 20000);
                break;
            }
            count++;

            if (obj.tier === "S") {
              tsCounter++;
            } else if (obj.tier === "6") {
              t6Counter++;
            }

            if (tsCounter === tsInterval && tsCounter <= (tsInterval * tsLimit)) {
              const filteredData = data.filter(card => card.tier === "S");
              const index = Math.floor(Math.random() * filteredData.length);
              obj = filteredData[index];
              price = client.utils.getRandomInt(60000, 100000);
              tsCounter = 0;
            } else if (t6Counter === t6Interval && t6Counter <= (t6Interval * t6Limit)) {
              const filteredData = data.filter(card => card.tier === "6");
              const index = Math.floor(Math.random() * filteredData.length);
              obj = filteredData[index];
              price = client.utils.getRandomInt(30000, 60000);
              t6Counter = 0;
            }

            console.log(`Sended:${obj.tier + "  Name:" + obj.title + "  For " + price + " in " + jid}`);
            await client.cards.set(`${jid}.card`, `${obj.title}-${obj.tier}`);
            await client.cards.set(`${jid}.card_price`, price);

            if (obj.tier.includes('6') || obj.tier.includes('S')) {
              const giif = await client.utils.getBuffer(obj.url);
              const cgif = await client.utils.gifToMp4(giif);
              return client.sendMessage(jid, {
                video: cgif,
                caption: `*━『  🎊Finally a rare card has spawned🎊 』━*\n\n🎴 *Name:* ${obj.title}\n\n🎐 *Tier:* ${obj.tier}\n\n🪩 *Price:* ${price}\n\n🎴 *Source:* ${obj.source}\n\n🔖 Use *${client.prefix}collect* to claim the card, your card will be stored in you deck`,
                gifPlayback: true,
              });
            } else {
              return client.sendMessage(jid, {
                image: {
                  url: obj.url,
                },
                caption: `*━『 🎊A new card has spawned🎊 』━*\n\n🎴 *Name:* ${obj.title}\n\n🎐 *Tier:* ${obj.tier}\n\n🪩 *Price:* ${price}\n\n🎴 *Source:* ${obj.source}\n\n🔖 Use *${client.prefix}collect* to claim the card, your card will be stored in you deck`,
              });
            }

          } catch (err) {
            console.log(err);
            await client.sendMessage(jid, {image: {url: `${client.utils.errorChan()}`}, caption: `${client.utils.greetings()} Error-Chan Dis\n\nCommand no error wa:\n${err}`});
          }
        });

        cron.schedule('*/5 * * * *', async () => {
          await client.cards.delete(`${jid}.card`);
          await client.cards.delete(`${jid}.card_price`);
          console.log(`Card deleted after 5 minutes`);
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
		    
