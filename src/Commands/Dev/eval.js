module.exports = {
    name: 'eval',
    aliases: ['evaluate'],
    category: 'dev',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Evaluates JavaScript',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
       try{
        if (!arg) return M.reply('You didnt provided any term to eval!')
        let out = ''
        try {
            const output = (await eval(arg)) || 'Executed JS Successfully!'
            out = JSON.stringify(output)
        } catch (err) {
            out = err.message
        }
        return await M.reply(out)
       }catch(err){
        await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`})
      }
    }
}