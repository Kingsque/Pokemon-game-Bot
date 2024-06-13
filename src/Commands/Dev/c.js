const path = require('path');
require('@WhiskeySockets/baileys');

module.exports = {
  name: 'spawn',
  aliases: ['event'],
  category: 'dev',
  exp: 5,
  react: "🔥",
  description: 'spawns cards',
  async execute(client, arg, M) {
    const cardsPath = path.join(__dirname, '../../Helpers/card.json');
    const data = require(cardsPath);
    const dataFilter = data.filter(card => card.tier === "S" || card.tier === "6");

    console.log(dataFilter);

    const { Random } = require("random-js");
    const random = new Random(); // uses the nativeMath engine
    const value = random.integer(0, dataFilter.length - 1); // Adjusted to account for array index
    const obj = dataFilter[value];

    console.log(obj);

    let price;
    switch (obj.tier) {
      case "6":
        price = client.utils.getRandomInt(200000, 500000);
        break;
      case "S":
        price = client.utils.getRandomInt(500000, 1000000);
        break;
    }
    let code = client.utils.getRandomInt(100000, 999999);

    await client.cards.set(`${M.from}.card`, `${obj.title}-${obj.tier}`);
    await client.cards.set(`${M.from}.card_price`, price);
    client.cardMap.set(M.from, {
      price: price,
      code: code,
      card: `${obj.title}-${obj.tier}`
    });

    const giif = await client.utils.getBuffer(obj.url);
    const cgif = await client.utils.gifToMp4(giif);

    await client.sendMessage(M.from, {
      video: cgif,
      caption: `🎴 ━『 ANIME-CARD 』━ 🎴\n\n💮 Name: ${obj.title}\n\n💠 Tier: ${obj.tier}\n\n🏮 Price: ${price}\n\n📤 Info: These cards are originally owned by https://shoob.gg, and we are using them with all the required permissions.\n\n🔖 [ Use ${process.env.PREFIX}collect to claim the card, ${process.env.PREFIX}collection to see your Cards ]`,
      gifPlayback: true,
    });

    setTimeout(() => {
      client.cards.delete(`${M.from}.card`);
      client.cards.delete(`${M.from}.card_price`);
      console.log('card deleted');
    }, 3000);
  }
};

let msg = generateWAMessageFromContent(M.from, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `${text}`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "© ꜱᴀʏ.ꜱᴄ֟፝ᴏᴛᴄʜ ⚡"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            subtitle: "",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"Collect\",\"id\":\"-collect\"}"
              }
           ],
          })
        })
    }
  }
}, {})
