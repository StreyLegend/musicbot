module.exports.permissionRequired = 0

const ytdl = require("ytdl-core"), ytpl = require("ytpl"), ytsr = require("ytsr"), { Util } = require("discord.js");

module.exports.run = async (client, message, args, config, queue) => {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send("❌ Вы не находитесь на голосовом канале, сначала присоединитесь к нему!")

  const permissions = voiceChannel.permissionsFor(message.guild.me)
  if (!permissions.has("CONNECT")) return message.channel.send("❌ У меня нет разрешения на подключение к голосовому каналу!")
  if (!permissions.has("SPEAK")) return message.channel.send("❌ У меня нет разрешения говорить в голосовом канале!")

  if (!args.length) return message.channel.send("❌ Вам нужно найти видео или дать мне URL!")

  const url = args.join(" ")
  if (url.includes("list=")) {
    const playlist = await ytpl(url.split("list=")[1])
    const videos = playlist.items;

    message.channel.send(`✅ Плейлист **${playlist.title}** (${videos.length}) добавлен в очередь!`)

    for (const video of videos) await queueSong(video, message, voiceChannel, queue)
  } else {
    let video;
    try {
      video = await ytdl.getBasicInfo(url)
    } catch(e) {
      try {
        const filters = await ytsr.getFilters("NoCopyrightMusic");
        const results = await ytsr(url, { limit: 10 })
        console.log(results);
        const videos = results.items
        let index = 0;

        if (!videos.length) return message.channel.send("❌ Ничего не найдено.")

        await message.channel.send([
          "__**Выбор песни:**__",
          videos.map(v => `${++index} - **${v.title}**`).join("\n"),
          `**Выберите свою песню, отправив число от 1 до ${videos.length} в чат.**`
        ].join("\n\n"))

        let response;
        try {
          response = await message.channel.awaitMessages(msg => 0 < parseInt(msg.content) && parseInt(msg.content) < videos.length + 1 && msg.author.id == message.author.id, {
            max: 1,
            time: 30000,
            errors: ['time']
          });
        } catch(e) {
          return message.channel.send("❌ Истекло время выбора видео.")
        }
        const videoIndex = parseInt(response.first().content);
        console.log(video);
        video = await ytdl.getBasicInfo(videos[videoIndex - 1].url.split("?v=")[1]);
        console.log(video);
        console.log(videoIndex);
      } catch(e) {
        console.log(e)
        return message.channel.send("❌ Произошла неизвестная ошибка.")
      }
    }
    
    await message.channel.send(`✅ Песня **${video.videoDetails.title}** добавлена в очередь!`)
    return await queueSong(video, message, voiceChannel, queue)
  }
}

async function queueSong(video, message, voiceChannel, queue) {
  const serverQueue = queue.get(message.guild.id)

  const song = {
    id: video.videoDetails.videoId,
    title: Util.escapeMarkdown(video.videoDetails.title),
    url: video.videoDetails.video_url
  }

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel,
      connection: null,
      songs: [song],
      volume: 50,
      playing: true
    }

    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      queue.set(message.guild.id, queueConstruct)
      playSong(message.guild, queue, queueConstruct.songs[0])
    } catch(e) {
      console.log(e)
      message.channel.send("❌ Неизвестная ошибка при попытке присоединиться к голосовому каналу!")
      return queue.delete(message.guild.id)
    }
  } else serverQueue.songs.push(song);

  return;
}

async function playSong(guild, queue, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  serverQueue.connection.play(ytdl(song.id), { bitrate: 'auto' })
    .on("speaking", speaking => {
      if (!speaking) {
        serverQueue.songs.shift();
        playSong(guild, queue, serverQueue.songs[0])
      }
    })
    .on("error", console.error)
    .setVolumeLogarithmic(serverQueue.volume / 250)
  
  serverQueue.textChannel.send(`🎶 Сейчас играет **${song.title}**`)
}

module.exports.help = {
  name: "play",
  description: "Воспроизводит предоставленный звук",
  usage: "play <ссылка или название>",
};
