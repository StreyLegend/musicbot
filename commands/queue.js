module.exports.permissionRequired = 0

module.exports.run = async (client, message, args, config, queue) => {
  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue || serverQueue.songs.length == 0) return message.channel.send("❌ Сейчас ничего не играет!")
  if (serverQueue.songs.length == 1) return message.channel.send("❌ Очередь пуста!")

  return message.channel.send([
    "__**Очередь песен:**__",
    serverQueue.songs.slice(1).map(song => `- ${song.title}`).join("\n"),
    `**Сейчас играет:** ${serverQueue.songs[0].title}`
  ].join("\n\n"))
}

module.exports.help = {
  name: "queue",
  description: "Показывает песни в очереди",
  usage: "queue",
};
