const mongoose = require('mongoose');
// 定義模型
/**
 *
 * @returns {mongoose.Schema()}
 */
module.exports = () => {
    const Schema = new mongoose.Schema({
        id: {
            type: String,
            required: true,
        },
        data:{
            type: String,
            required: true,
        },
    });
    return Schema;
};