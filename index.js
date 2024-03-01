require("dotenv").config();

const {
  Client,
  Events,
} = require("discord.js");

const cron = require("node-cron");
const { getItemPrice } = require("./tarkov/getItemPrice");
const { realTimeToTarkovTime } = require("./tarkov/getTime");
const { getGoonLocation } = require("./tarkov/getGoonLocation");

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

const globals = {
  bitcoin_price: '',
  goon_location: '',
};

// Log in to Discord with your client's token
discord.login(process.env.discord_token);

discord.once(Events.ClientReady, async (client) => {

     // Update Bitcoin Price; Every 12 Hours
      cron.schedule("0 0,12 * * *", async () => {
        console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Updating Bitcoin Price`);
        
        const data = await getItemPrice('physical_bitcoin_(btc)');
        
        if (globals.bitcoin_price !== data.traderPrice) {
          console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Updating Bitcoin Price from '${globals.bitcoin_price}' to '${data.traderPrice}'`);
          client.channels.cache.get("1212254689635074078").setName(`🪙 ${data.traderPrice}`);
        }else {
          console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Bitcoin price remains the same, no update required.`);
        }
      });

      // Update Tarkov Time; Every 2 Minutes
      cron.schedule("*/2 * * * *", async () => {
        console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Updating Tarkov Time`);
        
        const now = new Date();
        const l_time = realTimeToTarkovTime(now, true).toUTCString().split(' ')[4].split(':')[0];
        const r_time = realTimeToTarkovTime(now, false).toUTCString().split(' ')[4].split(':')[0];
        
        client.channels.cache.get("1212282109994074193").setName(`⌚ ${l_time}:00:00+`);
        client.channels.cache.get("1212282171050434590").setName(`⌚ ${r_time}:00:00+`);
      });
      
      cron.schedule("0,30 * * * *", async ()=> {
        console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Updating Goons Location`);
        
        const location = await getGoonLocation();
        if (globals.goon_location !== location) {
          console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Updating Goons Location from '${globals.goon_location}' to '${location}'.`);
          client.channels.cache.get("1212692015360385085").setName(`☠ Goons @ ${location}`);
        } else {
          console.log(`INFORMATION --- ${(new Date()).toUTCString()} --- Goons have not moved, no update required.`);
        }
      })

});


discord.on("ready", async (client) => {
  // Command listener
  client.on(Events.MessageCreate, async (message) => {
    const [command, ...rest] = message.content.split(" ");
    const text = rest.join(" ");
    const user = message.author.id;
  });
});
