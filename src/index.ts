import { ChatInputCommandInteraction, Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import dgram from "dgram";

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

// ここでスラッシュコマンドを定義
const commands: Record<string, Cmd> = {
  ping: {
    description: "ぴんぐです",
    execute: async (interaction) => {
      await interaction.reply("ぽんぐです！");
    }
  },
  wol: {
    description: "WOLパケットを送信します",
    execute: async (interaction) => {
      await interaction.reply(`${process.env.MAIN_PC_MAC_ADDR} にWOLパケットを送信しました`);

      const formatted_macAddr = process.env.MAIN_PC_MAC_ADDR?.replace(/:/g, "").toLowerCase();
      const macAddrBuffer = Buffer.from(formatted_macAddr!, "hex");

      const wolPacket = Buffer.concat([
        Buffer.alloc(6, 0xff),
        Buffer.alloc(16, macAddrBuffer),
      ])

      const socket = dgram.createSocket("udp4");

      socket.on("error", (err) => {
        console.error(`WOLクライアントでエラーが発生しました: ${err}`);
        interaction.followUp(
          `WOLパケットの送信中にエラーが発生しました\nエラーメッセージ:\n${err}`,
        );
        socket.close();
      });

      socket.bind(() => {
        socket.setBroadcast(true);

        socket.send(wolPacket, 0, wolPacket.length, 9, "255.255.255.255", (err) => {
          if (err) {
            console.error(`WOLパケットの送信中にエラーが発生しました: ${err}`);
            interaction.followUp(
              `WOLパケットの送信中にエラーが発生しました\nエラーメッセージ:\n${err}`,
            );
          } else {
            console.log(`WOLパケットを送信しました: ${wolPacket.toString("hex")}`);
            interaction.followUp(`WOLパケットを送信しました: ${wolPacket.toString("hex")}`);
          }
          socket.close();
        })
      })
    }
  }
}

client.once("ready", () => {
  console.log(`${client.user?.tag} でログインしました`);

  const data = Object.entries(commands).map(([name, config]) => ({
    name,
    description: config.description,
  }));

  console.log(data);

  client.application?.commands.set(data);
  console.log("readyです");
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];
  if (command) {
    command.execute(interaction);
  };
});

client.login(process.env.DISCORD_BOT_TOKEN);
