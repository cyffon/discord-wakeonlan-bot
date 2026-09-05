# discord-wakeonlan-bot

リモートデスクトップなど、外出先から遠隔で自宅のPCを起動したい！
しかし、いちいちSSH接続してコマンドを打つのは面倒くさい！ということで、Discordから「/wol」と送るだけでマジックパケットを送信できるDiscord Botを作ってみました。

## Requirement

- Node.js
- TypeScript
- discord.js
- dotenv
  
詳細はpackage.jsonにて記述。

## Usage

### /ping

疎通確認ができます。

```
/ping
>ぽんぐです！
```

### /wol

.envに指定したMACアドレス宛に、WoLパケットを送信します。

```
/wol
>WOLパケットを送信しました: ffffffffffffxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Configuration

.envファイルをindex.jsと同じディレクトリに作成します。

以下のように、DiscordのTokenと、起動するPCのMACアドレスを記述します。

```env
DISCORD_BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAIN_PC_MAC_ADDR=00:00:00:00:00:00
```

