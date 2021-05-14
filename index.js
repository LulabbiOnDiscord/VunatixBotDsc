const {Collection, Client, Discord, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const bot = new Client()

const fs = require('fs');
bot.commands = new Collection();
bot.aliases = new Collection();

fs.readdir('./Cmds', (err, files) => {
    if(err) console.log(err)
    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if(jsfile.length <= 0) {
        console.log('Aucune Commande Trouvée !')
    }

    jsfile.forEach((f, i) => {
        let props = require(`./Cmds/${f}`);
        console.log(`${f} ➡  chargée !`);
        bot.commands.set(props.config.name, props);
    })
})

bot.on("ready" , async () => {

    console.log(`(${bot.user.username}): Online`)

    let statuses = [
        "Dévloper par MiniLulabbi.#6666" ,
        `En ligne sur ${bot.guilds.cache.size} serveur !`,
        "+help" 
    ]

    setInterval(function() {
        let status = statuses[Math.floor(Math.random() * statuses.length)]
        bot.user.setActivity(status, {type: "STREAMING"})
        }, 5000)
})

bot.on("message", async message => {
    
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let prefix = config.prefix;
    let messageArray = message.content.split(' ');
    let command = messageArray[0];
    let args = messageArray.splice(1);

    let commandFile = bot.commands.get(command.slice(prefix.length));

    if(!commandFile && command.includes(prefix)) return;
    if(commandFile && command.includes(prefix)) {
        commandFile.run(bot, message, args);
    } 
})

bot.login(config.token);