const path = require('path');

module.exports = {
  name: 'spawn',
  aliases: ['event'],
  category: 'dev',
  exp: 5,
  react: "✅",
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
        price = client.utils.getRandomInt(30000, 50000);
        break;
      case "S":
        price = client.utils.getRandomInt(50000, 100000);
        break;
    }

    await client.cards.set(`${M.from}.card`, `${obj.title}-${obj.tier}`);
    await client.cards.set(`${M.from}.card_price`, price);

    const giif = await client.utils.getBuffer(obj.url);
    const cgif = await client.utils.gifToMp4(giif);

    return client.sendMessage(M.from, {
      video: cgif,
      caption: `🎴 ━『 ANIME-CARD 』━ 🎴\n\n💮 Name: ${obj.title}\n\n💠 Tier: ${obj.tier}\n\n🏮 Price: ${price}\n\n📤 Info: This cards are originally owned by https://shoob.gg we are using it with all the required permissions.\n\n🔖 [ Use ${process.env.PREFIX}collect to claim the card, ${process.env.PREFIX}collection to see your Cards ]`,
      gifPlayback: true,
    });

    setTimeout(() => {
      client.cards.delete(`${M.from}.card`);
      client.cards.delete(`${M.from}.card_price`);
      console.log('card deleted');
    }, 3000);
  }
  }
