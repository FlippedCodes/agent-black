<div align="center">
  <img width="30%" src="/assets/agentBlack.jpg">
</div>

# Agent Black

Agent Black is a blacklist bot. It stores every ban of every participating server. This bot is designed to warn participating servers of members who have been banned (or who are troublesome) in other participating servers. Currently, the bot has more than several thousand users blacklisted.

## Getting Started

The guide on how to add the bot to your server, can be found [here](https://github.com/FlippedCode/agent-black/wiki/Bot---Getting-Started). If you have trouble with something, feel free to [have a look into the wiki](https://github.com/FlippedCode/agent-black/wiki) or [join our Discord server](https://discord.gg/TqBwHtzzhD)

## Features

- Agent Black’s primary function is to record the bans of participating servers and warn other participating servers of said bans.
- The bot has it's own ban command; this command enables you to ban users more easily than using the manual ban function.
- Similarly to recording bans, the bot also has a warn command. This command warns other participating servers of troublesome members without banning them.
- There is a command which enables you to view all of the members in your server who are banned or warned in any other participating servers.
- Agent Black has a command which enables you to view basic account information of users, for example, account creation date and servers shared with Agent black. The command also shows the user’s previous offences in other participating servers.
- The bot has an alias command that allows you to tie alt accounts with main accounts. For example, if you know the alt account of a troublesome user, you can connect their main account with their alt account, so other participating servers know this.

## Required Permissions

- The bot requires access to the channel you want it to log it's messages in to. Preferably, this should be the staff channel; log channels are generally muted by staff because of bot spam in them. This bot doesn’t usually spam messages, so it would be good if it logs in a channel that everyone can see.
- The only administrative permission the bot requires is the 'Ban Members' permission. The bot can only view the server ban list with this command as the bot pulls the bans directly from the ban list. Without this permission, the bot cannot function. The bot also has its own ban command.

## FAQ

### Can I view the code for the bot?

Absolutely, the link to the bot's github is <https://github.com/FlipperLP/agent-black>

### Do I need to use the Agent Black ban command?

No, because the bot pulls bans directly from the ban list, you can use any bot to ban or use the manual discord ban feature.

### Does the bot ban users by itself?

No, the bot only warns other participating servers of troublesome users; it does not ban them. The bot can only ban users if a staff member of a participating server uses its own ban command.

### Does unbanning users remove them from the blacklist?

No, the bot still stores the information regardless of whether they were unbanned or not. However, their "is banned" status will be set as "false" if they are no longer banned and the sidebar of the rich embed will be green.

### Can I host the bot myself?

The bot can be self-hosted, if there is any interest, please let me know on Discord `Phil | Flipper#3621`. Please keep in mind, that your DB is not going to have any content/listed bans from our bot instance!

## Future Features

- Currently, we are in the process of adding an unban command which will enable you to provide reasons for unbans.
- We will also be adding a punishment system, where participating servers can coordinate punishments against troublesome users. Involvement in this system is optional, you may punish troublesome users independently of this system if you so wish.
