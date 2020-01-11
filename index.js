const Discord = require('discord.js');
const {
 prefix,
 token,
} = require('./config.json');
const ytdl = require('ytdl-core');

const client = new Discord.Client();

const queue = new Map();

client.once('ready', () => {
 console.log('Готов!');
 client.user.setActivity(`помощь: ${prefix}help`, 'WATCHING');
});

client.once('reconnecting', () => {
 console.log('Переподключение!');
});

client.once('disconnect', () => {
 console.log('Отключился!');
});



client.on('message', async message => {
 if (message.author.bot) return;
 if (!message.content.startsWith(prefix)) return;

 const serverQueue = queue.get(message.guild.id);

//Команда
 if (message.content.startsWith(`${prefix}play`)) {
 execute(message, serverQueue);
 return;
 } else if (message.content.startsWith(`${prefix}skip`)) {
 skip(message, serverQueue);
 return;
 } else if (message.content.startsWith(`${prefix}stop`)) {
 stop(message, serverQueue);       
 return;
 } else if(message.content == `${prefix}authors`){ //команда от автора
 message.reply("Генеральный директор: StreyLegend#4119\n Зам.Генерального директора: StreyLeg#4014")
 return;
 } else if(message.content == `${prefix}help`){ //команда от автора
 message.reply(`Созданый специально, для компании StreyLegendGames\n ${prefix}play - 'URL от YouTube'\n ${prefix}stop - Остановить песню\n ${prefix}skip - Пропустить песню, если она в очереди :)\n ${prefix}authors - Разработчики компании, а также самого бота :-)`)
 return; 	 
 }else {
 message.channel.send('Ты ввел неправильную команду!')
 }
});

async function execute(message, serverQueue) {
 const args = message.content.split(' ');

 const voiceChannel = message.member.voiceChannel;
 if (!voiceChannel) return message.channel.send('Вы должны быть в голосовом канале, чтобы включить музыку!');
 const permissions = voiceChannel.permissionsFor(message.client.user);
 if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
 return message.channel.send('Мне нужны разрешения, чтобы присоединиться к вашему каналу!');
 }

 const songInfo = await ytdl.getInfo(args[1]);
 const song = {
 title: songInfo.title,
 url: songInfo.video_url,
 };

 if (!serverQueue) {
 const queueContruct = {
 textChannel: message.channel,
 voiceChannel: voiceChannel,
 connection: null,
 songs: [],
 volume: 5,
 playing: true,
 };

 queue.set(message.guild.id, queueContruct);

 queueContruct.songs.push(song);

 try {
 var connection = await voiceChannel.join();
 queueContruct.connection = connection;
 play(message.guild, queueContruct.songs[0]);
 } catch (err) {
 console.log(err);
 queue.delete(message.guild.id);
 return message.channel.send(err);
 }
 } else {
 serverQueue.songs.push(song);
 console.log(serverQueue.songs);
 return message.channel.send(`${song.title} был добавлен в очередь!`);
 }

}

function skip(message, serverQueue) {
 if (!message.member.voiceChannel) return message.channel.send('Вы должны быть в голосовом канале, чтобы пропустить музыку!');
 if (!serverQueue) return message.channel.send('ам нет песни, которую я мог бы пропустить!');
 serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
 if (!message.member.voiceChannel) return message.channel.send('Вы должны быть в голосовом канале, чтобы остановить музыку!');
 serverQueue.songs = [];
 serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
 const serverQueue = queue.get(guild.id);
	
 if (!song) {
 serverQueue.voiceChannel.leave();
 queue.delete(guild.id);
 return;
 }

 const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
 .on('end', () => {
 console.log('Музыка закончилась!');
 serverQueue.songs.shift();
 play(guild, serverQueue.songs[0]);
 })
 .on('error', error => {
 console.error(error);
 });
 dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.login(token);