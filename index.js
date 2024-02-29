require("dotenv").config();

const {
  Client,
  Events,
} = require("discord.js");

const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");
const { getItemPrice } = require("./tarkov/getItemPrice");
const { realTimeToTarkovTime } = require("./tarkov/getTime");

// Create a new client instance
const discord = new Client({
  intents: [
    "GuildMessages",
    "GuildMembers",
    "Guilds",
    "MessageContent",
    "GuildVoiceStates",
    "AutoModerationConfiguration",
    "AutoModerationExecution",
    "GuildMessageReactions",
  ],
});

// Log in to Discord with your client's token
discord.login(process.env.discord_token);

discord.once(Events.ClientReady, async (client) => {

     // Update Bitcoin Price; Every 12 Hours
      cron.schedule("0 0,12 * * *", async () => {
        console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Updating Bitcoin Price`);

        const data = await getItemPrice('physical_bitcoin_(btc)');
        client.channels.cache.get("1212254689635074078").setName(`🪙 ${data.traderPrice}`);
      });

      // Update Tarkov Time; Every 9 Minutes
      cron.schedule("*/9 * * * *", async () => {
        console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Updating Tarkov Time`);

        const now = new Date();
        const l_time = realTimeToTarkovTime(now, true).toUTCString().split(' ')[4].split(':')[0];
        const r_time = realTimeToTarkovTime(now, false).toUTCString().split(' ')[4].split(':')[0];
    
        client.channels.cache.get("1212282109994074193").setName(`⌚ ${l_time}:00:00+`);
        client.channels.cache.get("1212282171050434590").setName(`⌚ ${r_time}:00:00+`);
      });

});


discord.on("ready", async (client) => {
  // Command listener
  client.on(Events.MessageCreate, async (message) => {
    const [command, ...rest] = message.content.split(" ");
    const text = rest.join(" ");
    const user = message.author.id;
  });
});
