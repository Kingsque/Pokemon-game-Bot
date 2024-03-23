module.exports = {
    name: 'ewallet',
    aliases: ['ewal'],
    category: 'event',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Shows the amount of event currency',
    async execute(client, arg, M) {
    const mode = await client.event.get(`EVENTS`);

if (mode === 'OFF') {
    return M.reply('🟥No event is going currently!');
}
        const wallet = await client.event.get(`${M.sender}.wallet`) || 0;
        const contact = await client.contact.getContact(M.sender, client);
        const username = contact.username || 'Unknown';
        const tag = `#${M.sender.substring(3, 7)}`;

        const text = `♦️ *Event Currency* ♦️\n\n👤 *Name:* ${username},${tag}\n💰 *Amount:* ${wallet} 🪙`;

        M.reply(text);
    }
};



