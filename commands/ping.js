module.exports.permissionRequired = 0

const fetch = require("node-fetch");
let bestRegion; fetch("https://best.discord.media/region").then(res => res.text()).then(region => bestRegion = region.replace("\n", "")).catch()

module.exports.run = async (client, message, args, config, queue) => {
  const botMsg = await message.channel.send("〽 Пинг ...");
  botMsg.edit(`🏓 Понг! Задержка равна \`${botMsg.createdTimestamp - message.createdTimestamp}ms\`, а задержка API равна \`${Math.round(client.ws.ping)}ms\`${bestRegion && bestRegion !== message.guild.region ? "\n❗ Мой лучший регион \`" + bestRegion + "\`, получите максимальную задержку, переключившись на него." : ""}`);
}

module.exports.help = {
  name: "ping",
  description: "Показывает задержку API и связанную информацию",
  usage: "ping",
};
