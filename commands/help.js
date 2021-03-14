module.exports.permissionRequired = 0;

module.exports.run = async (client, message, args, config) => {
  let command = args[0];

  if (!command || command === "help") {
    var text = "**__Доступные команды__**\n";
    for (let [command, props] of client.commands) {
      if (command === "help") continue;
      text += "• `" + command + "`\n";
    }

    text += `\nЧтобы узнать больше о конкретной команде, введите ${config.prefix}help <команда>\n`;

    message.channel.send(text);
  } else {
    command = client.commands.get(command);
    var text = `**Команда:** ${command.help.name}\n**Описание:** ${
      command.help.description || "Нет описания"
    }\n**Использование:** ${config.prefix}${command.help.usage || "Нет использования"}`;

    message.channel.send(text);
  }
};

module.exports.help = {
  name: "help",
};
