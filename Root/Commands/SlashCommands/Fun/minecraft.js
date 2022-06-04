const {
    // Collection,
    Client,
    // Formatters,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
} = require('discord.js');
const axios = require('axios');

const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms || 0);
    });
};
module.exports = {
    command: {
        name: 'minecraft',
        description: 'Minecraft 系列',
        options: [
            {
                type: 1,
                name: 'player',
                description: '查詢玩家',
                options: [
                    {
                        type: 3,
                        name: 'playername',
                        description: '玩家名稱',
                        required: true,
                    },
                ],
            },
            {
                type: 1,
                name: 'server',
                description: '查詢伺服器',
                options: [
                    {
                        type: 3,
                        name: 'ip',
                        description: '伺服器位置(包含Port！)',
                        required: true,
                    },
                    {
                        type: 5,
                        name: 'bedrock',
                        description: '為Bedrock伺服器?',
                        required: false,
                    },
                ],
            },
        ],
    },
    clientPermissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    // ignoreFile: true,
    /**
     *
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {*} container
     */
    run: async (client, interaction, container) => {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand == 'player') {
            const args = interaction.options.getString('playername');
            interaction.deferReply();
            const info = await axios(`https://api.mojang.com/users/profiles/minecraft/${args}`);
            const nameh = await axios(`https://some-random-api.ml/mc?username=${args}`);
            interaction.editReply({
                embeds: [
                    {
                        title: `${nameh.data.username}`,
                        description: '',
                        color: 0xb67afb,
                        fields: [
                            {
                                name: 'UUID',
                                value: `\`${info.data.id}\``,
                            },
                            {
                                name: '皮膚',
                                value: `[點擊這裡](https://crafatar.com/skins/${info.data.id})`,
                            },
                        ],
                        image: {
                            url: `https://crafatar.com/renders/body/${info.data.id}?size=4&default=MHF_Steve&overlay=true`,
                            height: 0,
                            width: 0,
                        },
                        thumbnail: {
                            url: `https://crafatar.com/renders/head/${info.data.id}.png?size=1&overlay#true`,
                            height: 0,
                            width: 0,
                        },
                        author: {
                            name: `${client.user.username}｜Minecraft 玩家信息`,
                            icon_url: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                        },
                    },
                ],
            });

        } else if (subcommand == 'server') {
            interaction.deferReply();
            const server_ip = interaction.options.getString('ip');
            const bedrock = interaction.options.getBoolean('bedrock') || false;
            let api = 'https://api.mcsrvstat.us/2/';
            if (bedrock) api = 'https://api.mcsrvstat.us/bedrock/2/';
            const get_data = await axios(`${api}${server_ip}`);
            const data = get_data.data;
            if (!data.online) return interaction.editReply({ content: `啊喔... ${server_ip} 目前離線中...` });
            else {

                interaction.editReply({
                    embeds: [
                        {
                            title: `${server_ip} 的資訊`,
                            description: '',
                            color: 0xb67afb,
                            fields: [
                                {
                                    name: 'IP',
                                    value: `\`${data.ip}\``,
                                    inline: true,
                                },
                                {
                                    name: 'Port',
                                    value: `\`${data.port}\``,
                                    inline: true,
                                },
                                {
                                    name: '版本',
                                    value: `\`${data.version || '無法檢測'}\``,
                                    inline: true,
                                },
                                {
                                    name: '軟體',
                                    value: `\`${data.software || '無法檢測'}\``,
                                    inline: true,
                                },
                                {
                                    name: 'Motd',
                                    value: `\`\`\`\n${data.motd.clean.join('\n')} \`\`\``,
                                    inline: false,
                                },
                                {
                                    name: '訊息',
                                    value: `\`\`\`\n${data.info.clean.join('\n')} \`\`\``,
                                    inline: false,
                                },
                                {
                                    name: '玩家',
                                    value: `\`${data.players.online}\`人/共\`${data.players.max}\`人`,
                                    inline: true,
                                },
                                {
                                    name: '主機',
                                    value: `\`${data.hostname}\``,
                                    inline: true,
                                },
                            ],
                            thumbnail: {
                                url: `https://api.mcsrvstat.us/icon/${server_ip}`,
                                height: 0,
                                width: 0,
                            },
                            author: {
                                name: `${client.user.username}｜Minecraft 伺服器信息`,
                                icon_url: `${client.user.displayAvatarURL({ dynamic: true }) || client.user.defaultAvatarURL}`,
                            },
                        },
                    ],
                });
            }
        }
        // 內容
        else interaction.reply({
            content: '此功能尚未完成！ :/',
            ephemeral: true,
        });
    },
};