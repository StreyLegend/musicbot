const Discord = require("discord.js"), fs = require("fs"), config = require("./config.json");

const client = new Discord.Client({ messageSweepInterval: 60, disableEveryone: true })
const queue = new Map();

// stores a global list of commands and their properties
client.commands = new Discord.Collection();

client.on("ready", async () => {
  console.log(`Успешно запустился ${client.user.tag}`);
})

// command handler
let commands = {} // { "command": "path/to/command.js" }
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  console.log(files)
  for (var file of files) if (file.endsWith(".js")) {
    commands[file.replace(".js", "")] = `./commands/${file}`;
    let props = require(`./commands/${file}`);
    client.commands.set(props.help.name, props);
  }
})

client.on("message", async message => {
  if (!message.guild || message.author.bot) return;

  if (message.content.startsWith(config.prefix) || message.content.match(`^<@!?${client.user.id}> `)) {
    let args = message.content.split(" ");
    if (args[0].match(`^<@!?${client.user.id}>`)) args.shift(); else args[0] = args[0].slice(config.prefix.length);
    let command = args.shift().toLowerCase()

    if (commands[command]) try {
      let commandFile = require(commands[command])

      if (getPermissionLevel(message.member) < commandFile.permissionRequried) return message.channel.send(`❌ У вас нет разрешения! Чтобы получить помощь, введите \`${config.prefix}help\`.`);
      commandFile.run(client, message, args, config, queue)
    } catch(e) {}
  } else if (message.content.match(`^<@!?${client.user.id}>`)) return message.channel.send(`👋 My prefix is \`${config.prefix}\`. Commands are ${Object.keys(commands).map(c => `\`${config.prefix}${c}\``).join(", ")}.`);
})

let getPermissionLevel = (member) => {
  if (config.owner == member.user.id) return 2;
  if (member.hasPermission("MANAGE_MESSAGES")) return 1;
  return 0;
}

client.login(config.token)