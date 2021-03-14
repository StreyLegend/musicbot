module.exports.permissionRequired = 0

module.exports.run = async (client, message, args, config, queue) => {
  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ Сейчас ничего не играет!")

  return message.channel.send(`🎶 Сейчас играет **${serverQueue.songs[0].title}**`)
}

module.exports.help = {
  name: "np",
  description: "Показывает, что сейчас играет",
  usage: "np",
};
