const cron = require("node-cron")
const axios = require('axios')
const path = require('path')
require("./Message");
module.exports = CardHandler = async (client, M) => {
  try {
    let cardgames = await client.DB.get('card-game');
    const cardgame = cardgames || [];
    // const jid = '120363117691088254@g.us'; //send group
    // const jid = '120363129950930721@g.us'

    // if (cardgame.length > 0) {
    //   const randomIndex = Math.floor(Math.random() * cardgame.length)
    //   const randomJid = cardgame[randomIndex]
    //   let jid = randomJid
    //   console.log(jid)
    for (let i = 0; i < cardgame.length; i++) {
      const jid = cardgame[i]
   console.log(jid)

      if (cardgame.includes(jid)) {

        let count = 0;
        let sOr6Counter = 0;
        const sOr6Interval = 10;
        const sOr6Limit = 15;
  
        cron.schedule('*/2 * * * *', async () => {
          try {
             const filePath = path.join(__dirname, '../../Helpers/card.json');
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
      await client.cards.set(`${jid}.card`, `${obj.title}-${obj.tier}`);
      await client.cards.set(`${jid}.card_price`, price);
     
  
      
      if (obj.tier.includes('6')|| obj.tier.includes('S')) {
        const giif = await client.utils.getBuffer(obj.url);
        const cgif = await client.utils.gifToMp4(giif);
        return client.sendMessage(jid, {
          video: cgif,
          caption: `🎴 *━『 Woah a rare card spawn 』━* 🎴\n\n🧧 Name: ${obj.title}\n\n🎐 Tier: ${obj.tier}\n\n🪩 Price: ${price}\n\n📤 *Info:* This cards are originally owned by *https://shoob.gg* we are using it with all the required permissions.\n\n🔖 [ Use *${process.env.PREFIX}collect* to claim the card, *${process.env.PREFIX}collection* to see your *Cards* ]`,
          gifPlayback: true,
        });
      } else {
        return client.sendMessage(jid, {
          image: {
            url: obj.url,
          },
          caption: `🎴 *━『 ANIME-CARD 』━* 🎴\n\n Name: ${obj.title}\n\n🎐 Tier: ${obj.tier}\n\n🪩 Price: ${price}\n\n📤 *Info:* This cards are originally owned by *https://shoob.gg* we are using it with all the required permissions.\n\n🔖 [ Use *${process.env.PREFIX}collect* to claim the card, *${process.env.PREFIX}collection* to see your *Cards* ]`,
        });
      } 
     
    } catch (err) {
      console.log(err)
      await client.sendMessage(jid , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nCommand no error wa:\n${err}`})
    }
  
    cron.schedule('*/1 * * * *', async () => {
     await client.cards.delete(`${jid}.card`);
    await client.cards.delete(`${jid}.card_price`);
      console.log(`Card deleted after 5minutes`)
  
    })
  
  });
  
  }
    }
    
    } catch(error){
        console.log(error)
    }

}
function newFunction() {
  return "card-game";
}

			
