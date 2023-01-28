const Discord = require('discord.js');
const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
module.exports = {
    command: {
        name: 'queue',
        description: '顯示列隊',
    },
    cooldown: 10000,
    /**
    *
    * @param {import('discord.js').Client} client
    * @param {import('discord.js').CommandInteraction} interaction
    * @param {*} container
    */
    run: async (client, interaction, container) => {
        const guild = interaction.guild;
        const queue = await client.distube.getQueue(interaction);
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: '請先加入語音頻道！', ephemeral: true });
        }
        if (!queue) {
            const queueError = new Discord.MessageEmbed()
                .setDescription(':x: 啊喔...沒有東西在列隊裡播放')
                .setColor('RANDOM');
            return interaction.reply({ embeds: [queueError] });
        }
        if (interaction.member.guild.me.voice.channelId !== interaction.member.voice.channelId) {
            return interaction.reply({ content: ':x: 啊喔...你和我不在同一個語音頻道！', ephemeral: true });
        }
        // 主程式
        try {
            const newQueue = client.distube.getQueue(interaction.guild.id);
            if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
                embeds: [
                    new MessageEmbed().setColor('RANDOM').setTitle(`${client.allEmojis.x} **我目前沒有任何播放的曲目！**`),
                ],

            });
            const embeds = [];
            let k = 10;
            const theSongs = newQueue.songs;
            // defining each Pages
            for (let i = 0; i < theSongs.length; i += 10) {
                const qus = theSongs;
                const current = qus.slice(i, k);
                let j = i + 1;
                const info = current.map((track) => `**${j++} -** [\`${String(track.name)}\`](${track.url}) - \`${track.formattedDuration}\``).join('\n');
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`${info}`);
                if (i < 10) {
                    embed.setTitle(`📑 **歌曲列表｜${guild.name} 的列隊**`);
                    embed.setDescription(`**當前歌曲:**\n> [\`${theSongs[0].name}\`](${theSongs[0].url})\n\n${info}`);
                }
                embeds.push(embed);
                k += 10; // Raise k to 10
            }
            embeds[embeds.length - 1] = embeds[embeds.length - 1]
                .setFooter(
                    {
                        text: `\n${theSongs.length} 首歌曲｜總長度： ${newQueue.formattedDuration}`,
                    },
                );
            let pages = [];
            for (let i = 0; i < embeds.length; i += 3) {
                pages.push(embeds.slice(i, i + 3));
            }
            pages = pages.slice(0, 24);
            const Menu = new MessageSelectMenu()
                .setCustomId('QUEUEPAGES')
                .setPlaceholder('選擇一個頁碼')
                .addOptions([
                    pages.map((page, index) => {
                        const Obj = {};
                        Obj.label = `第 ${index + 1} 頁`;
                        Obj.value = `${index}`;
                        Obj.description = `第 ${index + 1}/${pages.length} 頁！`;
                        return Obj;
                    }),
                ]);
            const row = new MessageActionRow().addComponents([Menu]);
            interaction.reply({
                embeds: [embeds[0]],
                components: [row],
            });
            // Event
            client.on('interactionCreate', (i) => {
                if (!i.isSelectMenu()) return;
                if (i.customId === 'QUEUEPAGES' && i.applicationId == client.user.id) {
                    i.update({
                        embeds: pages[Number(i.values[0])],
                    }).catch(e => { });
                }
            });
        } catch (e) {
            console.log(e.stack ? e.stack : e);
            interaction.reply({
                content: '錯誤: ',
                embeds: [
                    new MessageEmbed().setColor('RED')
                        .setDescription(`\`\`\`${e}\`\`\``),
                ],

            });
        }

        //
    },
};
