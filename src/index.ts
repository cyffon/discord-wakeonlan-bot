import { ChatInputCommandInteraction, Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
})

interface Cmd {
  description: string;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commands: Record<string, Cmd> = {
  ping: {
    description: "ぴんぐです",
    execute: async (interaction) => {
      await interaction.reply("ぽんぐです");
    }
  }
}

client.once("ready", () => {
  console.log(`${client.user?.tag} でログインしました`);

  const data = Object.entries(commands).map(([name, config]) => ({
    name,
    description: config.description,
  }))

  client.application?.commands.set(data);
  console.log("readyです");
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];
  if (command) {
    command.execute(interaction);
  }

})

client.login(process.env.DISCORD_BOT_TOKEN);
