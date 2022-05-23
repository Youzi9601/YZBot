/**
 * @param {String<snowflake>} input
 * @returns Snowfake
*/

async function get_time_from_id(input) {

    const DISCORD_EPOCH = 1420070400000;

    // 轉換數字
    function convertSnowflakeToDate(snowflake) {
        return new Date(snowflake / 4194304 + DISCORD_EPOCH);
    }

    const snowflake = Number(input.replace(/[^0-9]+/g, ''));
    const timestamp = convertSnowflakeToDate(snowflake);
    const output = `${Math.floor(timestamp.getTime() / 1000)}`;
    return output;
}
exports.get_time_from_id = get_time_from_id;
