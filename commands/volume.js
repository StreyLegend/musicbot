module.exports.permissionRequired = 1

module.exports.run = async (client, message, args, config, queue) => {
  if (!message.member.voice.channel) return message.channel.send("❌ Вы не находитесь на голосовом канале!")

  const serverQueue = queue.get(message.guild.id)
  if (!serverQueue) return message.channel.send("❌ Сейчас ничего не играет!")

  if (!args[0]) return message.channel.send(`🔉 Громкость ${serverQueue.volume}`);

  const volume = parseInt(args[0])
  if (!volume || volume > 100) return message.channel.send("❌ Неверный уровень громкости, выберите число от 1 до 100!")

  serverQueue.volume = volume;
  serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 250);
  return message.channel.send(`🔊 Громкость сейчас ${volume}!`)
}

module.exports.help = {
  name: "volume",
  description: "Показывает текущий уровень громкости или изменяет громкость на заданное значение",
  usage: "volume <новое значение громкости>",
};
