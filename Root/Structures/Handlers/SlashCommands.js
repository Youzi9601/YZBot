const fs = require('fs');
const Filer = require('../../Utils/Filer');
const config = require('../../../Config');
const chalk = require('chalk');
const moment = require('moment');

module.exports = async function (client, path) {
    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '命令註冊開始！',
    );
    Filer(`${path}/Root/Commands/SlashCommands`, async function (err, res) {
        res.forEach((file) => {
            if (fs.statSync(file).isDirectory()) return;
            const cmd = require(file);
            if (cmd.ignoreFile) return;
            client.commands.slashCommands.set(require(file).command.name, require(file));
        });
        let promise = Promise.resolve();
        res.forEach(async function (file) {
            promise = promise.then(async function () {
                const interval = 5000;
                if (fs.statSync(file).isDirectory()) return;
                const cmd = require(file);
                if (cmd.ignoreFile) return;

                if (cmd.guilds && Array.isArray(cmd.guilds))
                    cmd.guilds.forEach((guildID) => {
                        (async () => {
                            const guild =
                                client.guilds.cache.get(guildID) ??
                                (await client.guilds.fetch(guildID));
                            const verifier = guild.commands.cache.find(
                                (x) => x.name == cmd.command.name,
                            );
                            if (verifier)
                                await guild.commands.edit(verifier.id, {
                                    // 基本
                                    name: cmd.command.name,
                                    description: cmd.command.description ?? '一個未完成的命令',
                                    options: cmd.command.options ?? [],
                                    type: cmd.command.type ?? 'CHAT_INPUT',
                                    // 權限
                                    defaultPermission: cmd.command.defaultPermission ?? true,
                                    permissions: cmd.command.permissions ?? [],
                                    dm_permission: cmd.command.dm_permission ?? false,
                                    // 本地化
                                    name_localizations: cmd.command.name_localizations ?? {},
                                    description_localizations: cmd.command.description_localizations ?? {},

                                });
                            else
                                await guild.commands.create({
                                    // 基本
                                    name: cmd.command.name,
                                    description: cmd.command.description ?? '一個未完成的命令',
                                    options: cmd.command.options ?? [],
                                    type: cmd.command.type ?? 'CHAT_INPUT',
                                    // 權限
                                    defaultPermission: cmd.command.defaultPermission ?? true,
                                    permissions: cmd.command.permissions ?? [],
                                    dm_permission: cmd.command.dm_permission ?? false,
                                    // 本地化
                                    name_localizations: cmd.command.name_localizations ?? {},
                                    description_localizations: cmd.command.description_localizations ?? {},

                                });
                        })();
                    });
                else {
                    const verifier = client.application.commands.cache.find(
                        (x) => x.name == cmd.command.name,
                    );
                    if (verifier)
                        await client.application.commands.edit(verifier.id, {
                            // 基本
                            name: cmd.command.name,
                            description: cmd.command.description ?? '一個未完成的命令',
                            options: cmd.command.options ?? [],
                            type: cmd.command.type ?? 'CHAT_INPUT',
                            // 權限
                            defaultPermission: cmd.command.defaultPermission ?? true,
                            permissions: cmd.command.permissions ?? [],
                            dm_permission: cmd.command.dm_permission ?? false,
                            // 本地化
                            name_localizations: cmd.command.name_localizations ?? {},
                            description_localizations: cmd.command.description_localizations ?? {},
                        });
                    else
                        await client.application.commands.create({
                            // 基本
                            name: cmd.command.name,
                            description: cmd.command.description ?? '一個未完成的命令',
                            options: cmd.command.options ?? [],
                            type: cmd.command.type ?? 'CHAT_INPUT',
                            // 權限
                            defaultPermission: cmd.command.defaultPermission ?? true,
                            permissions: cmd.command.permissions ?? [],
                            dm_permission: cmd.command.dm_permission ?? false,
                            // 本地化
                            name_localizations: cmd.command.name_localizations ?? {},
                            description_localizations: cmd.command.description_localizations ?? {},

                        });
                }
                /** */
                return new Promise(function (resolve) {
                    setTimeout(resolve, interval);
                });
            });
        });
    });

    console.log(
        chalk.gray(
            `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${config.console_prefix}`,
        ) + '命令註冊完成！',
    );
};
