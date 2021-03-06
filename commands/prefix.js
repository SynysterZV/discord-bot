module.exports = {
    name: 'prefix',
    description: 'Set or display prefix',
    usage: '{prefix | or no args to display current prefix}',
    admin: true,
    async execute(args, message, globalPrefix) {
        const { prefixes } = require('../bot');
        if (args.length) {
            await prefixes.set(message.guild.id, args[0]);
            return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
        }

        return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``);
    },
};