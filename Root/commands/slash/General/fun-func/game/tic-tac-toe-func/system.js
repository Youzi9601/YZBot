const { userMention, ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, time, ButtonBuilder, ButtonStyle, User, ButtonInteraction } = require('discord.js');

/**
 * 運行井字棋
 * @param {'vs'|'ai:easy'|'ai:hard'|'ai:extreme'} mode 模式
 * @param {import('discord.js').Client} client 機器人
 * @param {import('discord.js').Message} message 訊息
 * @param {{p1: import('discord.js').GuildMember, p2: import('discord.js').GuildMember}} player 玩家資料
 */
module.exports = async (mode, client, message, player) => {
    const translations = client.language_data(message.locale, 'commands/slash/General/fun#game.tic-tac-toe');


    const EMPTY = '-';
    const PLAYER_X = '❌';
    const PLAYER_O = '⭕';

    let currentPlayer;
    let board;
    let full;


    function initializeBoard() {
        currentPlayer = PLAYER_X;
        board = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
        ];
    }

    // 輸出結果
    async function printBoard() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const row = new ActionRowBuilder();
            for (let j = 0; j < 3; j++) {
                const button = new ButtonBuilder().setCustomId(`ttt-${ message.createdTimestamp }-${ i }_${ j }`);
                if (board[i][j] == EMPTY)
                    button
                        .setLabel(EMPTY)
                        .setStyle(ButtonStyle.Secondary);
                else if (board[i][j] == PLAYER_O)
                    button
                        .setLabel(PLAYER_O)
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Success);
                else if (board[i][j] == PLAYER_X)
                    button
                        .setLabel(PLAYER_X)
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Danger);

                row.addComponents(button);
            }
            rows.push(row);
        }

        await message.edit({
            content: [
                `:x: ${ userMention(player.p1.id) } vs :o: ${ userMention(player.p2.id) }`,
                `${ translations["content_now"] } ${ currentPlayer == PLAYER_X ? userMention(player.p1.id) : userMention(player.p2.id) }`,
            ].join('\n'),
            embeds: [],
            components: rows,
        });
    }

    // 切換玩家
    function switchPlayer() {
        currentPlayer = (currentPlayer === PLAYER_X) ? PLAYER_O : PLAYER_X;
    }

    // 執行移動
    function makeMove(row, col) {
        board[row][col] = currentPlayer;
    }

    // 檢查位置是否已被佔領
    function isMoveValid(row, col) {
        return board[row][col] === EMPTY;
    }

    // 檢查是否結束
    function isGameOver(temp_board = board) {
        // 檢查行
        for (let i = 0; i < 3; i++) {
            if (temp_board[i][0] !== EMPTY && temp_board[i][0] === temp_board[i][1] && temp_board[i][0] === temp_board[i][2]) {
                return true;
            }
        }

        // 檢查列
        for (let j = 0; j < 3; j++) {
            if (temp_board[0][j] !== EMPTY && temp_board[0][j] === temp_board[1][j] && temp_board[0][j] === temp_board[2][j]) {
                return true;
            }
        }

        // 檢查對角線
        if (temp_board[0][0] !== EMPTY && temp_board[0][0] === temp_board[1][1] && temp_board[0][0] === temp_board[2][2]) {
            return true;
        }

        if (temp_board[0][2] !== EMPTY && temp_board[0][2] === temp_board[1][1] && temp_board[0][2] === temp_board[2][0]) {
            return true;
        }

        // 檢查板是否已滿
        let isFull = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (temp_board[i][j] === EMPTY) {
                    isFull = false;
                    break;
                }
            }
            if (!isFull) {
                break;
            }
        }

        if (isFull) {
            full = true;
            return true;
        }
        full = false;
        return false;
    }

    /**
     *
     * 這裡為AI的部分
     *
     */
    // #region ai
    // AI 取得可選位置
    function getAvailableMoves() {
        const moves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === EMPTY) {
                    moves.push([i, j]);
                }
            }
        }
        return moves;
    }
    // AI 隨機選擇
    function getRandomMove() {
        const moves = getAvailableMoves();
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }
    // AI 普通選擇
    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        const moves = getAvailableMoves();

        for (const [row, col] of moves) {
            board[row][col] = currentPlayer;
            const score = minimax(board, 0, false);
            board[row][col] = EMPTY;

            if (score === 10) {
                return [row, col];
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }
        }

        return bestMove;
    }
    // AI 困難難度選擇
    function makeExtremeAIMove() {
        let bestScore = -Infinity;
        let bestMove;

        const moves = getAvailableMoves();

        for (const [row, col] of moves) {
            board[row][col] = currentPlayer;
            const score = minimax(board, 0, false);
            board[row][col] = EMPTY;

            const opponentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
            if (willWin(opponentPlayer, row, col)) {
                return [row, col];
            }
            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }
        }

        return bestMove;
    }

    function willWin(temp_player, row, col) {
        // Check rows
        if (
            (board[row][0] === temp_player &&
                board[row][1] === temp_player &&
                board[row][2] === EMPTY) ||
            (board[row][0] === temp_player &&
                board[row][1] === EMPTY &&
                board[row][2] === temp_player) ||
            (board[row][0] === EMPTY &&
                board[row][1] === temp_player &&
                board[row][2] === temp_player)
        ) {
            return true;
        }

        // Check columns
        if (
            (board[0][col] === temp_player &&
                board[1][col] === temp_player &&
                board[2][col] === EMPTY) ||
            (board[0][col] === temp_player &&
                board[1][col] === EMPTY &&
                board[2][col] === temp_player) ||
            (board[0][col] === EMPTY &&
                board[1][col] === temp_player &&
                board[2][col] === temp_player)
        ) {
            return true;
        }

        // Check diagonals
        if (
            (row === col &&
                ((board[0][0] === temp_player &&
                    board[1][1] === temp_player &&
                    board[2][2] === EMPTY) ||
                    (board[0][0] === temp_player &&
                        board[1][1] === EMPTY &&
                        board[2][2] === temp_player) ||
                    (board[0][0] === EMPTY &&
                        board[1][1] === temp_player &&
                        board[2][2] === temp_player))) ||
            (row + col === 2 &&
                ((board[0][2] === temp_player &&
                    board[1][1] === temp_player &&
                    board[2][0] === EMPTY) ||
                    (board[0][2] === temp_player &&
                        board[1][1] === EMPTY &&
                        board[2][0] === temp_player) ||
                    (board[0][2] === EMPTY &&
                        board[1][1] === temp_player &&
                        board[2][0] === temp_player)))
        ) {
            return true;
        }

        return false;
    }

    // 下棋計算法
    function minimax(temp_board, depth, isMaximizingPlayer) {
        if (isGameOver(temp_board)) {
            // return evaluate(temp_board);
            if (currentPlayer === PLAYER_X) {
                return depth - 10;
            } else {
                return 10 - depth;
            }
        }

        if (isMaximizingPlayer) {
            let bestScore = -Infinity;

            const moves = getAvailableMoves();

            for (const [row, col] of moves) {
                temp_board[row][col] = currentPlayer;
                const score = minimax(temp_board, depth + 1, false);
                temp_board[row][col] = EMPTY;

                bestScore = Math.max(score, bestScore);
            }

            return bestScore;
        } else {
            let bestScore = Infinity;

            const moves = getAvailableMoves();

            for (const [row, col] of moves) {
                const opponent = (currentPlayer === PLAYER_X) ? PLAYER_O : PLAYER_X;
                temp_board[row][col] = opponent;
                const score = minimax(temp_board, depth + 1, true);
                temp_board[row][col] = EMPTY;

                bestScore = Math.min(score, bestScore);
            }

            return bestScore;
        }
    }


    // AI 下棋
    function makeAIMove(difficulty) {
        if (difficulty === 'ai:easy') {
            makeMove(...getRandomMove());
        } else if (difficulty === 'ai:hard') {
            makeMove(...getBestMove());
        } else if (difficulty === 'ai:extreme') {
            makeMove(...makeExtremeAIMove());
        }

        if (!isGameOver()) {
            switchPlayer();
        }
    }
    // #endregion ai


    // 整個遊戲程式
    async function playGame() {

        // 重製棋盤
        initializeBoard();
        await printBoard();
        const customids = `ttt-${ message.createdTimestamp }-`;
        // 創建蒐集等待兩位玩家都完成準備
        const collector_inGame = message.channel.createMessageComponentCollector({
            filter: async (button) => {
                if (
                    (button.user.id === player.p1.user.id ||
                        button.user.id === player.p2.user.id) &&
                    button.customId.includes(customids)
                ) {
                    return true;
                } else return false;
            },
            time: 5 * 60 * 1000, // 偵測時間 5 分鐘
        });

        collector_inGame.on('collect', async (button) => {
            if (
                !(
                    (currentPlayer == PLAYER_X && button.user.id == player.p1.id) ||
                    (currentPlayer == PLAYER_O && button.user.id == player.p2.id)
                )
            )
                return await button.reply({ content: translations["content_notYourRound"], ephemeral: true });

            await button.deferReply();

            const input = button.customId.replace(customids, '');
            const [row, col] = input.split('_');
            const rowIndex = parseInt(row);
            const colIndex = parseInt(col);

            if (isMoveValid(rowIndex, colIndex)) {
                makeMove(rowIndex, colIndex);
                if (!isGameOver()) {
                    switchPlayer();
                    if (mode != 'vs') makeAIMove(mode);
                }
            } else {
                return await button.followUp({ content: translations["content_moveNotValid"], ephemeral: true });
            }
            const success = await button.followUp({ content: translations["content_success"] });
            await success.delete();

            await printBoard();

            if (isGameOver()) {
                let wins;
                if (full) {
                    wins = translations["content_gameEnd_tie"];
                    // console.log('平手！');
                } else if (currentPlayer === PLAYER_X) {
                    wins = translations["content_gameEnd_p1_win"];
                    // console.log('You won!');
                } else {
                    wins = translations["content_gameEnd_p2_win"];
                    // console.log('You lost!');
                }
                collector_inGame.stop("遊戲結束");

                const rows = [];
                for (let i = 0; i < 3; i++) {
                    const row_ac = new ActionRowBuilder();
                    for (let j = 0; j < 3; j++) {
                        const button_ac = new ButtonBuilder().setCustomId(`ttt-${ message.createdTimestamp }-${ i }_${ j }`);
                        if (board[i][j] == EMPTY)
                            button_ac
                                .setLabel(EMPTY)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true);
                        else if (board[i][j] == PLAYER_O)
                            button_ac
                                .setLabel(PLAYER_O)
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Success);
                        else if (board[i][j] == PLAYER_X)
                            button_ac
                                .setLabel(PLAYER_X)
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Danger);

                        row_ac.addComponents(button_ac);
                    }
                    rows.push(row_ac);
                }

                await message.edit({
                    content: [
                        `:x: ${ userMention(player.p1.id) } vs :o: ${ userMention(player.p2.id) }`,
                        `${ wins }`,
                    ].join('\n'),
                    components: rows,
                });
                return;
            }

        });
    }

    return await playGame(mode);
};