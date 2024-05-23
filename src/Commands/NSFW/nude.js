const axios = require("axios");

module.exports = {
  name: "nude",
  alias: ["nude","nudewaifu"],
  desc: "Hentai picture of nude waifu", 
  category: "Nsfw",
  usage: `nude`,
  react: "🍁",
  start: async (Miku, m, { prefix,NSFWstatus }) => {

    if (NSFWstatus == "true") return m.reply(`This group is not NSFW enabled!\n\nTo configure NSFW mode, type:\n\n*${prefix}nsfw*`);
    m.reply(mess.waiting)
    let buff= await axios.get(`https://fantox-apis.vercel.app/nude`)
    let imgURL = buff.data.url
    
    let bmffg = {
      image: {url: imgURL},
      caption: `\n⃝❄𝐒ᴄᴀʀℓᴇтт.𐙚˙✧˖° ༘ ⋆｡ ˚`,
    };
    
    await Miku.sendMessage(m.from, bmffg, { quoted: m }).catch((err) => {
      return "Error!";
    });
  },
};
