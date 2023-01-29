/**
  * 讀取命令條件
  * @param {import('discord.js').Client} client
  * @param {import('discord.js').Interaction} interaction
  * @param {*} config
  * @param {*} db
  */
module.exports = async function(client, interaction, _config, _db, command) {
    if (await require('./OnlyRunOnGuilds')(client, interaction, command)) return;
    else if (await require('./Cooldown')(client, interaction, command)) return;

    // owner
    else if (await require('./OwnerOnly')(client, interaction, command)) return;
    // client
    else if (await require('./AnyClientPermissions')(client, interaction, command)) return;
    else if (await require('./ClientPermissions')(client, interaction, command)) return;

    // #region bypass
    // user
    else if (await require('./UserPermissions')(client, interaction, command)) return;
    else if (await require('./AnyUserPermissions')(client, interaction, command)) return;
    else if (await require('./RequiredAnyRole')(client, interaction, command)) return;
    else if (await require('./RequiredRoles')(client, interaction, command)) return;
    // onlyrun
    else if (await require('./OnlyChannels')(client, interaction, command)) return;
    else if (await require('./OnlyGuilds')(client, interaction, command)) return;
    else if (await require('./OnlyUsers')(client, interaction, command)) return;
    // #endregion bypass
}