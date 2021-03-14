module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ Вы не находитесь в голосовом канале!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ Сейчас ничего не играет!")
  if (!serverQueue.playing) return message.channel.send("❌ Плеер уже приостановлен!")

  serverQueue.playing = false
  serverQueue.connection.dispatcher.pause(true)
  return message.channel.send("⏸ Плеер приостановлен!")
}

module.exports.help = {
  name: "pause",
  description: "Приостановить воспроизводимый в данный момент звук",
  usage: "pause",
};
