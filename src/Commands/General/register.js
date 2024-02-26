module.exports = {
  name: 'register',
  aliases: ['register'],
  category: 'general',
  exp: 0,
  react: "✅",
  description: 'Get information bot information',
  async execute(client, arg, M) {

  if (arg === "me") {
    await client.DB.push(`users`, M.sender);
    M.reply("You are added to official or active users")
            }
    else if (arg === "group") {
      await client.DB.push(`groups`, M.from);
      M.Rreply("Group is registered")
    }
    else M.reply("UNDEFINED! kindly use :register me\group")
  }
}
