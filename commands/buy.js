const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');

module.exports = {
    name: 'buy',
    description: 'buy',
    usage: '{item}',
    async execute(args, message) {
        const { currency } = require('../models/Currency');
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args } } });
        if (!item) return message.channel.send(`That item doesn't exist.`);
        if (item.cost > currency.getBalance(message.author.id)) {
            return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
        }

        const user = await Users.findOne({ where: { user_id: message.author.id } });
        currency.add(message.author.id, -item.cost);
        await user.addItem(item);

        message.channel.send(`You've bought: ${item.name}.`);
    },
};
