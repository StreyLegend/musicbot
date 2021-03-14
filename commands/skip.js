module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ Вы не находитесь на голосовом канале!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ Сейчас ничего не играет!")

  await message.channel.send("⏭ Плеер пропущен!")
  return serverQueue.connection.dispatcher.end()
}

module.exports.help = {
  name: "skip",
  description: "Пропускает текущий воспроизводимый звук к следующему",
  usage: "skip",
};
