const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const data = require('./auth.json');

let channelID = data.discordChannelID;
let currentGame = null;
let authDiscord = data.tokenDiscordBot;
let intervalTime = data.refreshTime;
let options = {
    url: 'https://api.twitch.tv/kraken/streams/' + data.twitchChannelID, 
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': data.twitchClientID
    }
  };

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  let channel = client.channels.get(channelID);
    setInterval(function(){
        request(options,function(error, response, body){
            if (!error && response.statusCode == 200) {
                let info = JSON.parse(body);
                if(info.stream === null)
                {
                    currentGame = null;
                }
                else{
                    let newGame = info.stream.game, user = info.stream.channel.name;
                    if(currentGame === null)
                    {
                        currentGame = newGame ;
                        channel.send(`${user} is streaming ${currentGame} right now`);
                    }
    
                    if(newGame !== currentGame && currentGame !== null)
                    {
                        currentGame = newGame ;
                        channel.send(`${user} is now playing ${currentGame}`);
                    }
                }
            
              }
        });

    },intervalTime);
  
});

client.login(authDiscord);