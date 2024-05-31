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

        cron.schedule('*/20 * * * *', async () => {
          try {
            const filePath = path.join(__dirname, '../Helpers/card.json');
            const data = require(filePath);

            const index = Math.floor(Math.random() * data.length);
            let obj, price;

            obj = data[index];
            switch (obj.tier) {
              case "1":
                price = client.utils.getRandomInt(2000, 4000);
                break;
              case "2":
                price = client.utils.getRandomInt(4000, 5000);
                break;
              case "3":
                price = client.utils.getRandomInt(4000, 5000);
                break;
              case "4":
                price = client.utils.getRandomInt(8000, 10000);
                break;
              case "5":
                price = client.utils.getRandomInt(25000, 40000);
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
                  price = client.utils.getRandomInt(70000, 90000);
                  break;
                case "S":
                  price = client.utils.getRandomInt(100000, 500000);
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
                caption: `*┏═─|⚡ᴄᴀʀᴅ ꜱᴘᴀᴡɴ⚡|─═∘⦿ꕹ᛫*\n*╏𓊈 ᴀ ʀᴀʀᴇ ᴄᴀʀᴅ ʜᴀꜱ ꜱᴘᴀᴡɴᴇᴅ 𓊉*\n*╏🏮 ɴᴀᴍᴇ:* ${obj.title}\n*╏🔰 ᴛɪᴇʀ:* ${obj.tier}\n*╏💰 Price:* ${price}\n*╏🔮 ꜱᴏᴜʀᴄᴇ:* ${obj.source}\n*╏👥 ᴜꜱᴇ ${client.prefix}ᴄᴏʟʟᴇᴄᴛ* ᴛᴏ ᴄʟᴀɪᴍ\n*╏ᴛʜᴇ ᴄᴀʀᴅ ʏᴏᴜʀ ᴄᴀʀᴅ ᴡɪʟʟ ʙᴇ*\n*╏ꜱᴛᴏʀᴇᴅ ɪɴ ʏᴏᴜ ᴅᴇᴄᴋ*\n*┗═─|⚡ᴄᴀʀᴅ ꜱᴘᴀᴡɴ⚡|─═∘⦿ꕹ᛫*`,
                gifPlayback: true,
              });
            } else {
              return client.sendMessage(jid, {
                image: {
                  url: obj.url,
                },
                caption: `*┏─━═─|⚡ᴄᴀʀᴅ ꜱᴘᴀᴡɴ⚡|─═━─∘⦿ꕹ᛫*\n*╏𓊈 ᴀ ɴᴇᴡ ᴄᴀʀᴅ ʜᴀꜱ ꜱᴘᴀᴡɴᴇᴅ 𓊉*\n*╏🏮 ɴᴀᴍᴇ:* ${obj.title}\n*╏🔰 ᴛɪᴇʀ:* ${obj.tier}\n*╏💰 Price:* ${price}\n*╏🔮 ꜱᴏᴜʀᴄᴇ:* ${obj.source}\n*╏👥 ᴜꜱᴇ ${client.prefix}ᴄᴏʟʟᴇᴄᴛ* ᴛᴏ ᴄʟᴀɪᴍ\n*╏ᴛʜᴇ ᴄᴀʀᴅ ʏᴏᴜʀ ᴄᴀʀᴅ ᴡɪʟʟ ʙᴇ*\n*╏ꜱᴛᴏʀᴇᴅ ɪɴ ʏᴏᴜ ᴅᴇᴄᴋ*\n*┗─━═─|⚡ᴄᴀʀᴅ ꜱᴘᴀᴡɴ⚡|─═━─∘⦿ꕹ᛫*`,
              });
            }

          } catch (err) {
            console.log(err);
            await client.sendMessage(jid , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Mai Sakurajima Dis\n\nCommand no error wa:\n${err}`});
          }

        cron.schedule('*/5 * * * *', async () => {
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
		
