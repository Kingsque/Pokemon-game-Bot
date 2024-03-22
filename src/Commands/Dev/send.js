module.exports = {
  name: 'send',
  aliases: ['s'],
  exp: 0,
  cool: 4,
  react: "✅",
  category: 'dev',
  description: 'Enables a previously disabled command.',
  async execute(client, arg, M) {
    try {
      const splitArgs = arg.split('|');
      if (splitArgs.length !== 2) {
        return M.reply("Please provide both the group id and your text message separated by '|'.");
      }

      const groupId = splitArgs[0];
      let text = splitArgs[1];
      
      // Replace '\n' with actual line breaks
      text = text.replace(/\\n/g, '\n');
      
      await client.sendMessage(groupId, {
        text: text,
        mentions: [M.sender]
      });
    } catch (error) {
      console.error("Error sending message:", error);
      M.reply("An error occurred while sending the message.");
    }
  }
}
