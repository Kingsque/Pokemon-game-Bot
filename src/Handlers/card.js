const cron = require("node-cron");
const axios = require('axios');
const path = require('path');
require("./Message");

module.exports = CardHandler = async (client, M) => {
  try {
    let cardgames = await client.DB.get('cards');
    const cardgame = cardgames || [];

    if (cardgame.length > 0) {
      const randomIndex = Math.floor(Math.random() * cardgame.length);
      const randomJid = cardgame[randomIndex];
      let jid = randomJid;
      console.log(jid);

      if (cardgame.includes(jid)) {
        let count = 0;
        let sOr6Counter = 0;
        const sOr6Interval = 2;
        const sOr6Limit = 15;

        cron.schedule('*/5 * * * *', async () => {
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
            sOr6Counter++;
            
            if (sOr6Counter === sOr6Interval && sOr6Counter <= (sOr6Interval * sOr6Limit)) {
              const filteredData = data.filter(card => card.tier === "S" || card.tier === "6");
              const index = Math.floor(Math.random() * filteredData.length);
              obj = filteredData[index];
              switch (obj.tier) {
                case "6":
                  price = client.utils.getRandomInt(30000, 60000);
                  break;
                case "S":
                  price = client.utils.getRandomInt(60000, 100000);
                  break;
              }
            }

            console.log(`Sended:${obj.tier + "  Name:" + obj.title + "  For " + price + " in " + jid}`);
      await client.cardMap.set(jid, {
	      card: `${obj.title}-${obj.tier}`,
	      price: price
      })
            if (obj.tier.includes('6') || obj.tier.includes('S')) {
              const giif = await client.utils.getBuffer(obj.url);
              const cgif = await client.utils.gifToMp4(giif);
              return client.sendMessage(jid, {
                video: cgif,
                caption: `*🀄𓊈 ᴀ ʀᴀʀᴇ ᴄᴀʀᴅ ʜᴀꜱ ꜱᴘᴀᴡɴᴇᴅ 𓊉🀄*\n\n🥇 *ɴᴀᴍᴇ:* ${obj.title}\n\n🔰 *ᴛɪᴇʀ:* ${obj.tier}\n\n💰 *Price:* ${price}\n\n🔮 *ꜱᴏᴜʀᴄᴇ:* ${obj.source}\n\n🧑‍🧒 ᴜꜱᴇ *${client.prefix}collect* to claim the card, your card will be stored in you deck`,
                gifPlayback: true,
              });
            } else {
              return client.sendMessage(jid, {
                image: {
                  url: obj.url,
                },
                caption: `*⚡𓊈ᴀ ɴᴇᴡ ᴄᴀʀᴅ ʜᴀꜱ ꜱᴘᴀᴡɴᴇᴅ𓊉⚡*\n\n🏮 *ɴᴀᴍᴇ:* ${obj.title}\n\n🔰 *ᴛɪᴇʀ:* ${obj.tier}\n\n💰 *Price:* ${price}\n\n🔮 *ꜱᴏᴜʀᴄᴇ:* ${obj.source}\n\n🧑‍🧒 ᴜꜱᴇ *${client.prefix}collect* to claim the card, your card will be stored in you deck`,
              });
            }

          } catch (err) {
            console.log(err);
            await client.sendMessage(jid , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Mai Sakurajima Dis\n\nCommand no error wa:\n${err}`});
          }

        cron.schedule('*/4 * * * *', async () => {
          await client.cards.delete(`${jid}.card`);
          await client.cards.delete(`${jid}.card_price`);
          console.log(`Card deleted after 5 minutes`);
        });
		        });
      }
    }
  } catch(error) {
    console.log(error);
  }
};
		
