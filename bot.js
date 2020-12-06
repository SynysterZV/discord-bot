const { client } = require('./client/manager');


client.once('ready', async () => {
    console.log('Ready!');
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'YOUUUUU',
            type: 'PLAYING',
        },
    });
    client.manager.init(client.user.id);
});

client.on('message', async message => {
    if (message.author.bot) return;

    module.exports = { client };


    let args;
    let prefix;

    if (message.guild) {
        if (message.content.startsWith(client.globalPrefix)) {
            prefix = client.globalPrefix;
        }
        else {
            const guildPrefix = await client.prefixes.get(message.guild.id);
            if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
        }

        if (!prefix) return;
        args = message.content.slice(prefix.length).trim().split(/\s+/);
    }
    else {
        const slice = message.content.startsWith(client.globalPrefix) ? client.globalPrefix.length : 0;
        args = message.content.slice(slice).split(/\s+/);
    }


    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.admin && !message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply('you dont have permission to use this command');
    }
    else if (command.args && !args.length) {
        let reply = `You didnt provide any arugments, ${message.author}`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

     try {
        command.execute(args, message, prefix, client.globalPrefix);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(client.auth.token);