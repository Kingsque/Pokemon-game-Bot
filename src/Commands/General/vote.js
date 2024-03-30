module.exports = {
    name: 'vote',
    aliases: ['vote'],
    category: 'general',
    exp: 0,
    cool: 4,
    react: "✅",
    usage: 'Use :vote <option>',
    description: 'Get information about vote for auction, feature, or decision',
    async execute(client, arg, M) {
        const options = await Promise.all([
            client.DB.get('option1'),
            client.DB.get('option2'),
            client.DB.get('option3'),
            client.DB.get('option4')
        ]);

        const optionNumber = parseInt(arg);
        const voterList = await client.DB.get('voters');

        if (optionNumber >= 1 && optionNumber <= 4) {
            if (voterList.includes(M.sender)) {
                M.reply('You have already voted!');
            } else {
                await client.DB.push(`option${optionNumber}vote`, M.sender);
                await client.DB.push('voters', M.sender);
                M.reply('Your vote has been submitted successfully!');
            }
        } else {
            let optionsText = "VOTING OPTIONS\n";
            options.forEach((option, index) => {
                optionsText += `OPTION ${index + 1} = ${option}\n`;
            });
            optionsText += "TO GIVE VOTE USE :vote <option number>";
            M.reply(optionsText);
        }
    }
};
