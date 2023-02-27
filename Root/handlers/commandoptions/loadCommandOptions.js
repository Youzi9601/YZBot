/**
  * 讀取命令條件
  * @param {import('discord.js').Client} client
  * @param {import('discord.js').Interaction} interaction
  * @param {*} config
  * @param {import('./../../handlers/database/db_function')} db
  */
module.exports = async function(client, interaction, config, db, command) {
    if (await require('./OnlyRunOnGuilds')(client, interaction, config, db, command)) return;
    else if (await require('./Cooldown')(client, interaction, config, db, command)) return;

    // owner
    else if (await require('./OwnerOnly')(client, interaction, config, db, command)) return;
    // client
    else if (await require('./AnyClientPermissions')(client, interaction, config, db, command)) return;
    else if (await require('./ClientPermissions')(client, interaction, config, db, command)) return;

    // #region bypass
    // user
    else if (await require('./UserPermissions')(client, interaction, config, db, command)) return;
    else if (await require('./AnyUserPermissions')(client, interaction, config, db, command)) return;
    else if (await require('./RequiredAnyRole')(client, interaction, config, db, command)) return;
    else if (await require('./RequiredRoles')(client, interaction, config, db, command)) return;
    // onlyrun
    else if (await require('./OnlyChannels')(client, interaction, config, db, command)) return;
    else if (await require('./OnlyGuilds')(client, interaction, config, db, command)) return;
    else if (await require('./OnlyUsers')(client, interaction, config, db, command)) return;
    // #endregion bypass
};