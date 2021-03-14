module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ Вы не находитесь на голосовом канале!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ Сейчас ничего не играет!")

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end()
  return message.channel.send("⏹ Плеер остановился!")
}

module.exports.help = {
  name: "stop",
  description: "Останавливает плеер",
  usage: "stop",
};
