module.exports = {
    name: 'pick',
    aliases: ['random'],
    exp: 18,
    cool: 5,
    react: "✅",
    category: 'fun',
    usage: 'Use :pick <number> <type>',
    description: 'Pick random members from the group',
    async execute(client, arg, M) {
        const groupMetadata = await client.groupMetadata(M.from);
        const groupMembers = groupMetadata?.participants.map((x) => x.id) || [];

        // Default number of picks
        let number = 1;

        if (arg) {
            const args = arg.split(" ");
            // Parse number of picks
            const newNumber = parseInt(args[0]);
            if (!isNaN(newNumber) && newNumber > 0 && newNumber <= 5) {
                number = newNumber;
                // Remove the number from the args array
                args.shift();
            }
            // Join the remaining args to get the type
            arg = args.join(" ");
        }

        const pickMembers = (type) => {
            // Filter members based on type
            const filteredMembers = groupMembers.filter((jid) => jid.includes(type));
            const pickedMembers = [];
            for (let i = 0; i < number; i++) {
                const randomIndex = Math.floor(Math.random() * filteredMembers.length);
                pickedMembers.push(filteredMembers[randomIndex]);
                // Remove picked member to avoid duplicates
                filteredMembers.splice(randomIndex, 1);
            }
            return pickedMembers;
        };

        let pickedMembers = [];

        if (arg) {
            // Check for specific type
            pickedMembers = pickMembers(arg);
        } else {
            // Pick randomly from all members
            pickedMembers = pickMembers("");
        }

        let text = `🎲 Picked ${number > 1 ? 'members' : 'member'} randomly`;

        // Add chosen type to the text
        if (arg) {
            text += ` ${number} ${arg}`;
        }

        text += ":";

        for (const member of pickedMembers) {
            if (member) {
                text += `\n- *@${member.split('@')[0]}*`;
            }
        }

        await client.sendMessage(M.from, { text, mentions: groupMembers }, { quoted: M });
    }
};
