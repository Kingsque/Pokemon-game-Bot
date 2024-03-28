const axios = require('axios');

module.exports = {
  name: 'insta',
  aliases: ['instagram'],
  category: 'media',
  exp: 5,
  cool: 4,
  react: "✅",
  description: 'Sends the content of a given Instagram URL',
  async execute(client, arg, M) { 
    if (!arg || !arg.length) {
      return void (await M.reply('❌ Please provide an Instagram URL'));
    }

    const url = arg;
    if (
      !(
        url.includes('instagram.com/p/') ||
        url.includes('instagram.com/reel/') ||
        url.includes('instagram.com/tv/')
      )
    ) {
      return (await M.reply(`❌ Wrong URL! Only Instagram posts, reels, and TV content can be accessed`));
    }

    try {
      const { data } = await axios.get(
        `https://weeb-api.vercel.app/insta?url=${url}`
      );
      if (data.urls && data.urls.length > 0) {
        for (const { url, type } of data.urls) {
          const buffer = await client.utils.getBuffer(url);
          await M.reply(buffer, type);
        }
      } else {
        await M.reply(`❌ No video/image data found for the provided URL.`);
      }
    } catch (error) {
      await M.reply(`❌ Error while getting video/image data: ${error.message}`);
    }
  }
};
