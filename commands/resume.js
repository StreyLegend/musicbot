module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ Вы не находитесь на голосовом канале!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ Сейчас ничего не играет!")
  if (serverQueue.playing) return message.channel.send("❌ Плеер уже возобновлен!")

  serverQueue.playing = true
  serverQueue.connection.dispatcher.resume()
  return message.channel.send("▶ Плеер возобновлен!")
}

module.exports.help = {
  name: "resume",
  description: "Возобновляет звук, который был ранее приостановлен",
  usage: "resume",
};
