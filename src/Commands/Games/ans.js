module.exports = {
  name: 'ans',
  aliases: ['ans'],
  category: 'games',
  description: 'Answer a question in the quiz game',
  async execute(client, arg, M) {
    const option = arg.toLowerCase();
    const currentQuestionIndex = await client.DB.get(`${M.sender}.currentQuestionIndex`);
    const currentQuestion = quizQuestions[currentQuestionIndex];

    if (!currentQuestion) {
      return M.reply("There are no more questions.");
    }

    const correctOption = String.fromCharCode(97 + currentQuestion.answer.charCodeAt(0) - 'a'.charCodeAt(0));

    if (option !== correctOption) {
      return M.reply("Wrong answer, better luck next time");
    }

    let score = await client.DB.get(`${M.sender}.quizScore`) || 0;
    score++;
    await client.DB.set(`${M.sender}.quizScore`, score);

    const nextQuestionIndex = currentQuestionIndex + 1;
    await client.DB.set(`${M.sender}.currentQuestionIndex`, nextQuestionIndex);

    const nextQuestionData = quizQuestions[nextQuestionIndex];

    if (!nextQuestionData) {
      await client.DB.delete(`${M.sender}.quizInProgress`);
      return M.reply("Congratulations! You've completed the quiz. Your final score is " + score);
    }

    const nextQuestion = nextQuestionData.question;
    const options = nextQuestionData.options.map((option, index) => `${String.fromCharCode(97 + index)}) ${option}`).join('\n');
    return M.reply(`Correct! Here's your next question: ${nextQuestion}\nOptions:\n${options}\nTo answer, use the command :ans <option>`);
  },
};
