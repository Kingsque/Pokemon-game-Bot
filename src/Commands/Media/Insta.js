const axios = require('axios');

module.exports = {
  name: 'insta',
  aliases: ['instagram'],
  category: 'media',
  exp: 5,
  cool: 4,
  react: "✅",
  description: 'Sends the content of a given Instagram URL',
  async execute(client, arg, reply) { 
    if (!arg || !arg.length) {
      return void (await reply('❌ Please provide an Instagram URL'));
    }

    const url = arg;
    if (
      !(
        url.includes('instagram.com/p/') ||
        url.includes('instagram.com/reel/') ||
        url.includes('instagram.com/tv/')
      )
    ) {
      return (await reply(`❌ Wrong URL! Only Instagram posts, reels, and TV content can be accessed`));
    }

    try {
      const { data } = await axios.get(
        `https://weeb-api.vercel.app/insta?url=${url}`
      );
      if (data.urls && data.urls.length > 0) {
        for (const { url, type } of data.urls) {
          const buffer = await client.utils.getBuffer(url);
          if (type === 'video' || type === 'image') {
            await reply(buffer, type as 'video' | 'image');
          } else {
            // Handle other types appropriately (if necessary)
            console.log(`Unhandled type: ${type}`);
          }
        }
      } else {
        await reply(`❌ No video/image data found for the provided URL.`);
      }
    } catch (error) {
      await reply(`❌ Error while getting video/image data: ${error.message}`);
    }
  }
};
