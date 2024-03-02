const ms = require('parse-ms');
const quizQuestions = [
{
question: "Which anime follows the adventures of Monkey D. Luffy and his pirate crew?",
options: ["Naruto", "One Piece", "Fairy Tail", "Black Clover"],
answer: "One Piece"
},
{
question: "In 'Demon Slayer: Kimetsu no Yaiba,' what is the protagonist Tanjiro Kamado trying to do?",
options: ["Become a Demon Lord", "Find a Lost Treasure", "Avenge his Family", "Become a Famous Chef"],
answer: "Avenge his Family"
},
{
question: "What is the name of the legendary pirate in 'One Piece' whose treasure the main characters seek?",
options: ["Red-Haired Shanks", "Whitebeard", "Blackbeard", "Gold Roger"],
answer: "Gold Roger"
},
{
question: "Which anime features a group of assassins attending a high school for training?",
options: ["Kill la Kill", "Assassination Classroom", "Akame ga Kill!", "Psycho-Pass"],
answer: "Assassination Classroom"
},
{
question: "In 'Tokyo Ghoul,' what do ghouls feed on to survive?",
options: ["Pizza", "Human Flesh", "Sushi", "Apples"],
answer: "Human Flesh"
},
{
question: "What is the name of the alien race in 'Neon Genesis Evangelion' that threatens humanity?",
options: ["Saiyans", "Reapers", "Cylons", "Eva"],
answer: "Eva"
},
{
question: "Which anime features a group of teenagers piloting giant robots to defend Earth against alien invaders?",
options: ["Gurren Lagann", "Aldnoah.Zero", "Eureka Seven", "Evangelion"],
answer: "Aldnoah.Zero"
},
{
question: "What is the name of the organization that fights against Titans in 'Attack on Titan'?",
options: ["Scouting Legion", "Garrison Regiment", "Military Police Brigade", "Survey Corps"],
answer: "Survey Corps"
},
{
question: "In 'Code Geass,' what power does the protagonist Lelouch possess?",
options: ["Invisibility", "Telekinesis", "Mind Control", "Super Speed"],
answer: "Mind Control"
},
{
question: "Which anime follows the adventures of a group of pirates led by Captain Harlock?",
options: ["Space Battleship Yamato", "Cowboy Bebop", "Captain Harlock", "Star Blazers"],
answer: "Captain Harlock"
},
{
question: "In 'My Neighbor Totoro,' what type of creatures are Totoro and his friends?",
options: ["Cats", "Bears", "Ghosts", "Forest Spirits"],
answer: "Forest Spirits"
},
{
question: "Which anime series is known for its intense card battles and the protagonist Yugi Mutou?",
options: ["Yu Yu Hakusho", "Bakugan", "Cardcaptor Sakura", "Yu-Gi-Oh!"],
answer: "Yu-Gi-Oh!"
},
{
question: "What is the name of the magical guild in 'Fairy Tail'?",
options: ["Black Bulls", "Blue Pegasus", "Fairy Tail", "Sabertooth"],
answer: "Fairy Tail"
},
{
question: "Which anime features a girl named Madoka Kaname who becomes a magical girl?",
options: ["Puella Magi Madoka Magica", "Magical Girl Lyrical Nanoha", "Cardcaptor Sakura", "Sailor Moon"],
answer: "Puella Magi Madoka Magica"
},
{
question: "What is the name of the virtual reality MMORPG in 'Log Horizon'?",
options: ["Elder Tale", "Aincrad", "ALfheim Online", "The World"],
answer: "Elder Tale"
},
{
question: "In 'One Punch Man,' what is the name of the hero who can defeat any opponent with a single punch?",
options: ["Saitama", "Genos", "Mumen Rider", "Boros"],
answer: "Saitama"
},
{
question: "Which anime follows the adventures of a group of high school students forming a rock band called 'Afterglow'?",
options: ["K-On!", "BanG Dream!", "Sound! Euphonium", "Love Live!"],
answer: "BanG Dream!"
},
{
question: "In 'Cowboy Bebop,' what instrument does Spike Spiegel play?",
options: ["Piano", "Violin", "Trumpet", "Saxophone"],
answer: "Saxophone"
},
{
question: "What is the name of the virtual reality MMORPG in 'Sword Art Online'?",
options: ["Elder Tale", "Aincrad", "ALfheim Online", "The World"],
answer: "Aincrad"
},
{
question: "Who is the protagonist in 'My Hero Academia'?",
options: ["Izuku Midoriya", "Katsuki Bakugo", "Shoto Todoroki", "All Might"],
answer: "Izuku Midoriya"
},
{
question: "In 'Death Note,' what name does Light Yagami use to refer to the person he wants to kill?",
options: ["L", "N", "Kira", "Ryuk"],
answer: "Kira"
},
{
question: "Which anime is known for its giant transforming robots and the phrase 'It's morphin' time!'?",
options: ["Voltron", "Power Rangers", "Gundam", "Transformers"],
answer: "Power Rangers"
},
{
question: "What is the name of the mythical treasure in 'One Piece'?",
options: ["The One Ring", "The Philosopher's Stone", "The Holy Grail", "One Piece"],
answer: "One Piece"
},
{
question: "Who is the main character in 'Fullmetal Alchemist: Brotherhood'?",
options: ["Edward Elric", "Alphonse Elric", "Roy Mustang", "Winry Rockbell"],
answer: "Edward Elric"
},
{
question: "What is the name of the world where 'Attack on Titan' takes place?",
options: ["Eldia", "Marley", "Paradis", "Wallonia"],
answer: "Paradis"
},
{
question: "Which anime features a boy named Gon Freecss searching for his father?",
options: ["One Punch Man", "Hunter x Hunter", "My Hero Academia", "Death Note"],
answer: "Hunter x Hunter"
},
  {
    question: "In which anime does a young ninja named Naruto Uzumaki seek recognition?",
    options: ["Naruto", "One Piece", "Dragon Ball", "Bleach"],
    answer: "Naruto"
  },
  {
    question: "What is the name of the world where 'Attack on Titan' takes place?",
    options: ["Eldia", "Marley", "Paradis", "Wallonia"],
    answer: "Paradis"
  },
  {
    question: "Which anime features a boy named Gon Freecss searching for his father?",
    options: ["One Punch Man", "Hunter x Hunter", "My Hero Academia", "Death Note"],
    answer: "Hunter x Hunter"
  },
  {
    question: "Who is the main character in 'Fullmetal Alchemist: Brotherhood'?",
    options: ["Edward Elric", "Alphonse Elric", "Roy Mustang", "Winry Rockbell"],
    answer: "Edward Elric"
  },
  {
    question: "What is the name of the mythical treasure in 'One Piece'?",
    options: ["The One Ring", "The Philosopher's Stone", "The Holy Grail", "One Piece"],
    answer: "One Piece"
  },
  {
    question: "Which anime is known for its giant transforming robots and the phrase 'It's morphin' time!'?",
    options: ["Voltron", "Power Rangers", "Gundam", "Transformers"],
    answer: "Power Rangers"
  },
  {
    question: "In 'Death Note', what name does Light Yagami use to refer to the person he wants to kill?",
    options: ["L", "N", "Kira", "Ryuk"],
    answer: "Kira"
  },
  {
    question: "What is the name of the virtual reality MMORPG in 'Sword Art Online'?",
    options: ["Elder Tale", "Aincrad", "ALfheim Online", "The World"],
    answer: "Aincrad"
  },
  {
    question: "Who is the protagonist in 'My Hero Academia'?",
    options: ["Izuku Midoriya", "Katsuki Bakugo", "Shoto Todoroki", "All Might"],
    answer: "Izuku Midoriya"
  },
  {
    question: "In 'Cowboy Bebop', what instrument does Spike Spiegel play?",
    options: ["Piano", "Violin", "Trumpet", "Saxophone"],
    answer: "Saxophone"
  },
  {
    question: "Which anime series features a group of high school students forming a rock band called 'Afterglow'?",
    options: ["K-On!", "BanG Dream!", "Sound! Euphonium", "Love Live!"],
    answer: "BanG Dream!"
  },
  {
    question: "What is the main objective of the characters in 'Digimon Adventure'?",
    options: ["Collecting Pokémon", "Saving the Digital World", "Battling Evil Sorcerers", "Finding Treasure"],
    answer: "Saving the Digital World"
  },
  {
    question: "In 'Neon Genesis Evangelion,' what are the giant creatures that the protagonists must battle?",
    options: ["Zombies", "Demons", "Angels", "Vampires"],
    answer: "Angels"
  },
  {
    question: "What is the name of the magical school in 'Little Witch Academia'?",
    options: ["Hogwarts", "Luna Nova", "Mahoutokoro", "WizTech"],
    answer: "Luna Nova"
  },
  {
    question: "Which anime series follows the adventures of Monkey D. Luffy and his pirate crew?",
    options: ["Naruto", "One Piece", "Fairy Tail", "Black Clover"],
    answer: "One Piece"
  },
  {
    question: "In 'Demon Slayer: Kimetsu no Yaiba,' what is the protagonist Tanjiro Kamado trying to do?",
    options: ["Become a Demon Lord", "Find a Lost Treasure", "Avenge his Family", "Become a Famous Chef"],
    answer: "Avenge his Family"
  },
  {
    question: "What is the name of the legendary pirate in 'One Piece' whose treasure the main characters seek?",
    options: ["Red-Haired Shanks", "Whitebeard", "Blackbeard", "Gold Roger"],
    answer: "Gold Roger"
  },
  {
    question: "Which anime features a group of assassins attending a high school for training?",
    options: ["Kill la Kill", "Assassination Classroom", "Akame ga Kill!", "Psycho-Pass"],
    answer: "Assassination Classroom"
  },
  {
    question: "In 'Tokyo Ghoul,' what do ghouls feed on to survive?",
    options: ["Pizza", "Human Flesh", "Sushi", "Apples"],
    answer: "Human Flesh"
  },
  {
    question: "What is the name of the alien race in 'Neon Genesis Evangelion' that threatens humanity?",
    options: ["Saiyans", "Reapers", "Cylons", "Eva"],
    answer: "Eva"
  },
  {
    question: "Which anime features a group of teenagers piloting giant robots to defend Earth against alien invaders?",
    options: ["Gurren Lagann", "Aldnoah.Zero", "Eureka Seven", "Evangelion"],
    answer: "Aldnoah.Zero"
  },
  {
    question: "What is the name of the organization that fights against Titans in 'Attack on Titan'?",
    options: ["Scouting Legion", "Garrison Regiment", "Military Police Brigade", "Survey Corps"],
    answer: "Survey Corps"
  },
  {
    question: "In 'Code Geass,' what power does the protagonist Lelouch possess?",
    options: ["Invisibility", "Telekinesis", "Mind Control", "Super Speed"],
    answer: "Mind Control"
  },
  {
    question: "Which anime follows the adventures of a group of pirates led by Captain Harlock?",
    options: ["Space Battleship Yamato", "Cowboy Bebop", "Captain Harlock", "Star Blazers"],
    answer: "Captain Harlock"
  },
  {
    question: "In 'My Neighbor Totoro,' what type of creatures are Totoro and his friends?",
    options: ["Cats", "Bears", "Ghosts", "Forest Spirits"],
    answer: "Forest Spirits"
  },
  {
    question: "Which anime series is known for its intense card battles and the protagonist Yugi Mutou?",
    options: ["Yu Yu Hakusho", "Bakugan", "Cardcaptor Sakura", "Yu-Gi-Oh!"],
    answer: "Yu-Gi-Oh!"
  },
  {
    question: "What is the name of the magical guild in 'Fairy Tail'?",
    options: ["Black Bulls", "Blue Pegasus", "Fairy Tail", "Sabertooth"],
    answer: "Fairy Tail"
  },
  {
    question: "Which anime features a girl named Madoka Kaname who becomes a magical girl?",
    options: ["Puella Magi Madoka Magica", "Magical Girl Lyrical Nanoha", "Cardcaptor Sakura", "Sailor Moon"],
    answer: "Puella Magi Madoka Magica"
  },
  {
    question: "What is the name of the virtual reality MMORPG in 'Log Horizon'?",
    options: ["Elder Tale", "Aincrad", "ALfheim Online", "The World"],
    answer: "Elder Tale"
  },
  {
  question: "Which anime features a group of students with supernatural abilities attending Hoshinoumi Academy?",
  options: ["My Hero Academia", "Charlotte", "Boku dake ga Inai Machi", "Mob Psycho 100"],
  answer: "Charlotte"
},
{
  question: "In 'Dragon Ball Z,' what is the name of Goku's son?",
  options: ["Vegeta", "Gohan", "Piccolo", "Krillin"],
  answer: "Gohan"
},
{
  question: "Which anime is set in a post-apocalyptic world where humanity fights against giant insects known as 'Blue'?",
  options: ["Attack on Titan", "Blue Exorcist", "Blue Gender", "Seraph of the End"],
  answer: "Blue Gender"
},
{
  question: "What is the name of the legendary sword in 'Sword Art Online' that players seek to obtain?",
  options: ["Excalibur", "Caliburn", "Elucidator", "Eclipse"],
  answer: "Excalibur"
},
{
  question: "Which anime follows the adventures of a young alchemist named Aladdin, a genie, and a warrior named Alibaba?",
  options: ["Magi: The Labyrinth of Magic", "Fairy Tail", "Blue Exorcist", "Magical Warfare"],
  answer: "Magi: The Labyrinth of Magic"
},
{
  question: "In 'One Punch Man,' what is the protagonist Saitama's ultimate goal?",
  options: ["To become the strongest hero", "To find a worthy opponent", "To save the world", "To become famous"],
  answer: "To find a worthy opponent"
},
{
  question: "What is the name of the hidden ninja village in 'Naruto'?",
  options: ["Karakura Town", "Konohagakure", "Soul Society", "Hueco Mundo"],
  answer: "Konohagakure"
},
{
  question: "Which anime series features a group of high school students who gain superpowers after encountering a mysterious girl with red hair?",
  options: ["Re:Zero", "Charlotte", "Parasyte", "Erased"],
  answer: "Charlotte"
},
{
  question: "In 'Cowboy Bebop,' what is the main profession of the crew members aboard the spaceship Bebop?",
  options: ["Bounty Hunters", "Pirates", "Explorers", "Mercenaries"],
  answer: "Bounty Hunters"
},
{
  question: "What is the name of the magical school in 'Little Witch Academia'?",
  options: ["Hogwarts", "Luna Nova", "Mahoutokoro", "WizTech"],
  answer: "Luna Nova"
}
];

module.exports = {
  name: 'quiz',
  aliases: ['quiz'],
  category: 'games',
  react: "✅",
  exp: 12,
  cool: 4,
  description: 'Play a quiz against another person',
  async execute(client, arg, M) {
    const participant = await client.DB.get('game') || [];
      if (!participant.includes(M.from)) {
        return M.reply(`To use game commands, join the games group by using ${client.prefix}support`);
      }
      const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.quiz`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

    const quiz = await client.DB.get(`${M.from}.quizInProgress`) || true;
    let player1, player2;

    if (!quiz) return M.reply("A quiz is already in progress.");

    if (!M.mentions.length) return M.reply("You must mention someone to challenge in a quiz.");
    if (!arg) return M.reply("Use :quiz challenge to challenge someone.");

    if (arg === "challenge") {
      player1 = M.sender;
      player2 = M.mentions[0];
      await client.DB.get(`${M.from}.quizInProgress`, true);
      M.reply(`User @${player1.split("@")[0]} has challenged @${player2.split("@")[0]}. Use :quiz accept or reject.`);
    } else if (arg === "reject") {
      await client.DB.get(`${M.from}.quizInProgress`, false);
      M.reply("Challenge rejected successfully.");
    } else if (arg === "accept") {
      player1 = M.from;
      player2 = M.mentions[0];
      await client.DB.get(`${M.from}.quizInProgress`, true);
      await client.DB.set(`${M.sender}.quiz`, Date.now());
      M.reply("The quiz has started. Questions will be sent, and you have to answer. Use :quiz next");
    } else if (arg === "next") {
      // Send questions to both players
      for (const questionData of quizQuestions) {
        const question = questionData.question;
        const options = questionData.options.join(', '); // Join options into a string
        M.reply(`@${player1.split("@")[0]} and @${player2.split("@")[0]}, here's your question: ${question}\nOptions: ${options}, use :quiz answer your answer`);
      }
    } else if (arg.startsWith("answer")) {
      const choose = arg.split(" ")[1];
      const currentQuestion = quizQuestions[quiz - 1];

      if (!currentQuestion) {
        return M.reply("There are no more questions.");
      }

      if (choose !== currentQuestion.answer) {
        return M.reply("Wrong answer, better luck next time");
      } else if (choose === currentQuestion.answer) {
        await client.DB.add(`${M.sender}.point`, 1);
        await client.cradit.add(`${M.sender}.wallet`, 100000);
        M.reply("Your answer is correct! You get one point and some gold.");
      }
    } else if (arg === "result") {
      const point1 = await client.DB.get(`${player1}.point`) || 0;
      const point2 = await client.DB.get(`${player2}.point`) || 0;

      let resultMessage = "";

      if (point1 > point2) {
        resultMessage = `@${player1.split("@")[0]} wins with ${point1} points!`;
      } else if (point2 > point1) {
        resultMessage = `@${player2.split("@")[0]} wins with ${point2} points!`;
      } else {
        resultMessage = "It's a tie!";
      }
      await client.DB.get(`${M.from}.quizInProgress`, false);
      M.reply(`Point Board\n@${player1.split("@")[0]} points = ${point1}\n@${player2.split("@")[0]} points = ${point2}\n${resultMessage}`);
    } else {
      M.reply("Invalid command.");
    }
  },
};