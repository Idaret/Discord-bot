const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const data = require('./auth.json');
let currentGame = null;


request({
        url: 'https://api.twitch.tv/kraken/users?login=' + data.twitchChannelName,
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': data.twitchClientID
        }
    },
    function(error, response, body) {
        if (!error && response.statusCode == 200) {
            let results = JSON.parse(body);
            if (results._total != 0) {

                let options = {
                    url: 'https://api.twitch.tv/kraken/streams/' + results.users[0]._id,
                    headers: {
                        'Accept': 'application/vnd.twitchtv.v5+json',
                        'Client-ID': data.twitchClientID
                    }
                };

                client.on('ready', () => {
                    console.log(`Logged in as ${client.user.tag}!`);
                    let channel = client.channels.get(data.discordChannelID);
                    setInterval(function() {
                        request(options, function(error, response, body) {
                            if (!error && response.statusCode == 200) {
                                let info = JSON.parse(body);
                                if (info.stream === null) {
                                    currentGame = null;
                                } else {
                                    let newGame = info.stream.game,
                                        user = info.stream.channel.name;
                                    if (currentGame === null) {
                                        currentGame = newGame;
                                        channel.send(`${user} is streaming ${currentGame} right now`);
                                    }

                                    if (newGame !== currentGame && currentGame !== null) {
                                        currentGame = newGame;
                                        channel.send(`${user} is now playing ${currentGame}`);
                                    }
                                }

                            }
                        });

                    }, data.refreshTime);

                });

                client.login(data.tokenDiscordBot);

            }
        }
    });