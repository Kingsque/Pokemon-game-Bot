const axios = require('axios');

module.exports = {
    name: 'summon',
    aliases: ['sg'],
    category: 'weeb',
    exp: 7,
    react: "🤭",
    usage: 'Use :waifu',
    description: 'Sends an image of a random waifu',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) { 
      const result = await client.utils.fetch('https://reina-api.vercel.app/api/mwl/random')
    let text = ''
    text += `📔 *Name: ${result.data.name}*\n\n`
    text += `💮 *Japanese: ${result.data.original_name}*\n\n`
    text += `⛩ *Romaji_name: ${result.data.romaji_name}*\n\n`
    text += `💾 *Slug: ${result.data.slug}*\n\n`
    text += `👥 *Gender: ${result.data.gender}*\n\n`
    text += `⏰ *Age: ${result.data.age}*\n\n`
    text += `❤ *Popularity_rank: ${result.data.popularity_rank}*\n\n`
    text += `✔ *Tags: ${result.data.tags.join(', ')}*\n\n`
    text += `🔎 *Url: ${result.data.url}*\n\n`
    text += `📊 *Description:* ${result.data.description}`
    client.sendMessage(M.from, {
        image: {
            url: result.data.image
        },
        caption: text
    })
}}
