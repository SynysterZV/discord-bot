const { Users } = require('../dbObjects');

module.exports = {
    name: 'inventory',
    description: 'inventory',
    usage: '{mention | author}',
    async execute(args, message) {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();

        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
    },
};