const animeQuiz = require('anime-quiz');

module.exports = {
  name: 'quiz',
  aliases: ['quiz'],
  category: 'games',
  react: "✅",
  exp: 12,
  cool: 4,
  description: 'Play a quiz against another person',
  async execute(client, arg, M) {
    const quizInProgress = await client.DB.get(`${M.from}.quizInProgress`);
    let quizPlayers = await client.DB.get(`${M.from}.quizPlayers`) || [];
    let currentQuestionIndex = await client.DB.get(`${M.from}.quizQuestionIndex`) || 0;

    if (!quizInProgress && !quizPlayers.length) {
      const player = M.sender;
      quizPlayers.push(player);
      await client.DB.set(`${M.from}.quizInProgress`, true);
      await client.DB.set(`${M.from}.quizPlayers`, quizPlayers);
      await client.DB.set(`${M.from}.quizQuestionIndex`, 0);
      return M.reply(`Quiz initiated by @${player.split("@")[0]}. Anyone can join by typing :quiz join.`);
    }

    if (arg === "join" && !quizPlayers.includes(M.sender)) {
      quizPlayers.push(M.sender);
      await client.DB.set(`${M.from}.quizPlayers`, quizPlayers);
      return M.reply(`@${M.sender.split("@")[0]} has joined the quiz!`);
    }

    if (arg === "start" && quizPlayers.length > 1) {
      // Start the quiz
      return M.reply("The quiz has started. Questions will be sent, and you have to answer. Use :quiz answer <your answer>");
    }

    if (arg.startsWith("answer")) {
      const answer = arg.split(" ").slice(1).join(" ").trim();
      const currentQuestion = await animeQuiz.getQuestion(currentQuestionIndex + 1);
      if (!currentQuestion) return M.reply("No more questions.");
      const correctAnswer = currentQuestion.correct_answer;
      if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
        const answerer = M.sender;
        await client.DB.add(`${answerer}.quizScore`, 1);
        return M.reply("Your answer is correct!");
      } else {
        return M.reply("Wrong answer, better luck next time");
      }
    }

    if (arg === "result") {
      const scores = await Promise.all(quizPlayers.map(async player => ({
        player: player.split("@")[0],
        score: await client.DB.get(`${player}.quizScore`) || 0
      })));
      const sortedScores = scores.sort((a, b) => b.score - a.score);
      const winner = sortedScores[0];
      await client.DB.set(`${M.from}.quizInProgress`, false);
      await client.DB.delete(`${M.from}.quizPlayers`);
      await client.DB.delete(`${M.from}.quizQuestionIndex`);
      await Promise.all(quizPlayers.map(player => client.DB.delete(`${player}.quizScore`)));
      return M.reply(`Quiz finished! ${winner.player} wins with ${winner.score} points!`);
    }

    // If it's not a command, assume it's a new question
    if (currentQuestionIndex < quizPlayers.length) {
      const currentQuestion = await animeQuiz.getQuestion(currentQuestionIndex + 1);
      if (!currentQuestion) return M.reply("No more questions.");
      const { question, options } = currentQuestion;
      await client.DB.add(`${M.from}.quizQuestionIndex`, 1);
      for (const player of quizPlayers) {
        await M.reply(`@${player.split("@")[0]}, here's your question: ${question}\nOptions: ${options.join(', ')}`);
      }
    } else {
      return M.reply("No more questions.");
    }
  },
};
      
