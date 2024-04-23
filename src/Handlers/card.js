const cron = require("node-cron");
const axios = require('axios');
const path = require('path');
require("./Message");

module.exports = CardHandler = async (client, m) => {
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
        const sOr6Interval = 10;
        const sOr6Limit = 100;
  
        cron.schedule('*/20 * * * *', async () => {
          try {
             const filePath = path.join(__dirname, '../Helpers/spawn.json');
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
              const code = client.utils.getRandomInt(11111, 99999);

              count++;
            sOr6Counter++;
              // if (count % 6 === 0) {
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
      await client.cards.set(`${jid}.card`, { name: `${obj.title}-${obj.tier}`, price: price, code: code } );
      
      if (obj.tier.includes('6')|| obj.tier.includes('S')) {
        const giif = await client.utils.getBuffer(obj.url);
        const cgif = await client.utils.gifToMp4(giif);
        await client.sendMessage(jid, {
          video: cgif,
          caption: `*━『  🎊Finally a rare card has spawned🎊 』━*\n\n🎴 *Name:* ${obj.title}\n\n🎐 *Tier:* ${obj.tier}\n\n🪩 *Price:* ${price}\n\n🎴 *code:* ${code}\n\n🔖 Use *${client.prefix}collect <code>* to claim the card, your card will be stored in you deck`,
          gifPlayback: true,
        });
      } else {
        await client.sendMessage(jid, {
          image: {
            url: obj.url,
          },
          caption: `*━『 🎊A new card has spawned🎊 』━*\n\n🎴 *Name:* ${obj.title}\n\n🎐 *Tier:* ${obj.tier}\n\n🪩 *Price:* ${price}\n\n🎴 *code:* ${code}\n\n🔖 Use *${client.prefix}collect <code>* to claim the card, your card will be stored in you deck`,
        });
      } 
    } catch (err) {
      console.log(err)
      await client.sendMessage(jid , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nCommand no error wa:\n${err}`})
    }
  
    cron.schedule('*/15 * * * *', async () => {
     await client.cards.delete(`${jid}.card`);
      console.log(`Card deleted after 5minutes`)
    })
  
  });
  
  }
    }
    
    } catch(error){
        console.log(error)
    }

      }
