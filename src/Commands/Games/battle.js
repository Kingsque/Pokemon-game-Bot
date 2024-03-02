const ms = require('parse-ms');

module.exports = {
  name: 'battle',
  aliases: ['battle'],
  category: 'games',
  react: "✅",
  exp: 12,
  cool: 4,
  description: 'Engage in a battle against another person',
  async execute(client, arg, M) {
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.battle`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

    const participant = await client.DB.get('game') || [];
      if (!participant.includes(M.from)) {
        return M.reply(`To use game commands, join the games group by using ${client.prefix}support`);
      }
    const battleInProgress = await client.DB.get(`${M.from}.battleInProgress`);
    let player1, player2;

    if (battleInProgress) return M.reply("A battle is already in progress.");

    if (!M.mentions.length) return M.reply("You must mention someone to challenge in a battle.");
    if (!arg) return M.reply("Use :battle challenge to challenge someone.");

    if (arg === "challenge") {
      player1 = M.sender;
      player2 = M.mentions[0];
      await client.DB.set(`${M.from}.battleInProgress`, true);
      M.reply(`User @${player1.split("@")[0]} has challenged @${player2.split("@")[0]}. Use :battle accept or reject.`);
    } else if (arg === "reject") {
      await client.DB.set(`${M.from}.battleInProgress`, false);
      M.reply("Challenge rejected successfully.");
    } else if (arg === "accept") {
      player1 = M.from;
      player2 = M.mentions[0];
      await client.DB.set(`${M.from}.battleInProgress`, true);
      M.reply("The battle has started. Engage in combat by using :battle attack");
    } else if (arg === "attack") {
      // Simulate an attack
      const player1Damage = Math.floor(Math.random() * 10 + 1); // Random damage between 1 and 10
      const player2Damage = Math.floor(Math.random() * 10 + 1);

      // Retrieve health
      let player1Health = await client.DB.get(`${player1}.health`) || 100;
      let player2Health = await client.DB.get(`${player2}.health`) || 100;

      player1Health -= player2Damage;
      player2Health -= player1Damage;

      // Check if either player's health dropped to zero or below
      if (player1Health <= 0 || player2Health <= 0) {
        await client.DB.set(`${M.from}.battleInProgress`, false);
        await client.DB.set(`${player1}.health`, 100); // Reset health
        await client.DB.set(`${player2}.health`, 100); // Reset health

        let resultMessage = "";
        if (player1Health <= 0 && player2Health <= 0) {
          resultMessage = "It's a draw!";
        } else if (player1Health <= 0) {
          resultMessage = `@${player2.split("@")[0]} wins the battle!`;
        } else if (player2Health <= 0) {
          resultMessage = `@${player1.split("@")[0]} wins the battle!`;
        }

        return M.reply(resultMessage);
      }

      // Update health
      await client.DB.set(`${player1}.health`, player1Health);
      await client.DB.set(`${player2}.health`, player2Health);

      let resultMessage = `Battle Update\n@${player1.split("@")[0]} health = ${player1Health}\n@${player2.split("@")[0]} health = ${player2Health}\nKeep battling with :battle attack`;

      M.reply(resultMessage);
    } else if (arg === "end") {
      player1 = M.from;
      player2 = M.mentions[0];

      let player1Health = await client.DB.get(`${player1}.health`) || 100;
      let player2Health = await client.DB.get(`${player2}.health`) || 100;

      let resultMessage = "";
      if (player1Health <= 0 && player2Health <= 0) {
        resultMessage = "It's a draw!";
      } else if (player1Health <= 0) {
        resultMessage = `@${player2.split("@")[0]} wins the battle!`;
      } else if (player2Health <= 0) {
        resultMessage = `@${player1.split("@")[0]} wins the battle!`;
      }

      await client.DB.set(`${M.from}.battleInProgress`, false);
      await client.DB.set(`${player1}.health`, 100); // Reset health
      await client.DB.set(`${player2}.health`, 100); // Reset health
      await client.DB.set(`${M.sender}.battle`, Date.now());

      M.reply(resultMessage);
    } else {
      M.reply("Invalid command.");
    }
  },
};