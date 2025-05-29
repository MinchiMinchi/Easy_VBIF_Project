document.addEventListener('DOMContentLoaded', () => {
    const scoreboardApp = {
        // --- 状態変数 ---
        teamAScore: 0,
        teamBScore: 0,
        teamARotation: [],
        teamBRotation: [],
        teamAInitialPlayers: Array.from({ length: 6 }, (_, i) => `A${i + 1}`),
        teamBInitialPlayers: Array.from({ length: 6 }, (_, i) => `B${i + 1}`),
        serverTeam: 'A',
        history: [],
        currentSet: 1,
        teamAName: "チームA",
        teamBName: "チームB",

        // --- DOM要素の参照 ---
        dom: {},

        // --- 初期化 ---
        init() {
            // DOM要素の取得
            this.dom.setDisplay = document.getElementById('set-display');
            this.dom.teamANameLabel = document.getElementById('team-a-name');
            this.dom.teamAScoreLabel = document.getElementById('team-a-score');
            this.dom.addPointABtn = document.getElementById('add-point-a-btn');
            this.dom.teamBNameLabel = document.getElementById('team-b-name');
            this.dom.teamBScoreLabel = document.getElementById('team-b-score');
            this.dom.addPointBBtn = document.getElementById('add-point-b-btn');
            this.dom.serverInfo = document.getElementById('server-info');
            this.dom.gridA = document.getElementById('rotation-grid-a');
            this.dom.gridB = document.getElementById('rotation-grid-b');
            this.dom.teamARotationCells = {}; // { rotIdx: cellElement }
            this.dom.teamBRotationCells = {}; // { rotIdx: cellElement }
            this.dom.swapServerBtn = document.getElementById('swap-server-btn');
            this.dom.rotateABtn = document.getElementById('rotate-a-btn');
            this.dom.rotateBBtn = document.getElementById('rotate-b-btn');
            this.dom.undoBtn = document.getElementById('undo-btn');
            this.dom.resetBtn = document.getElementById('reset-btn');

            this.resetData();
            this.createRotationGrids();
            this.addEventListeners();
            this.updateDisplays();
        },

        createRotationGrids() {
            const setupGrid = (gridElement, teamChar, cellStorage) => {
                gridElement.innerHTML = ''; // 既存セルをクリア
                const displayPositions = this.getDisplayPositions(teamChar);
                
                displayPositions.forEach(posConfig => {
                    const cell = document.createElement('div');
                    cell.classList.add('rotation-cell');
                    cell.dataset.rotIdx = posConfig.rotIdx;
                    cell.dataset.teamChar = teamChar;
                    cell.addEventListener('click', (e) => {
                        const tc = e.currentTarget.dataset.teamChar;
                        const rIdx = parseInt(e.currentTarget.dataset.rotIdx);
                        this.editPlayerName(tc, rIdx);
                    });
                    gridElement.appendChild(cell);
                    cellStorage[posConfig.rotIdx] = cell; // rotIdxをキーとしてセルを保存
                });
            };
            setupGrid(this.dom.gridA, 'A', this.dom.teamARotationCells);
            setupGrid(this.dom.gridB, 'B', this.dom.teamBRotationCells);
        },

        getDisplayPositions(teamChar) {
            // (grid_row, grid_col, rotation_list_index_for_this_cell)
            // rotation_list_index: 0->P1(サーバー), 1->P2, 2->P3, 3->P4, 4->P5, 5->P6
            if (teamChar === 'A') {
                // Aチーム: (A1=idx0 が左下)
                // A5(idx4) A4(idx3)
                // A6(idx5) A3(idx2)
                // A1(idx0) A2(idx1)
                return [
                    { rotIdx:4 }, { rotIdx:3 }, // Row 0 (CSS Gridが自動で2列に)
                    { rotIdx:5 }, { rotIdx:2 }, // Row 1
                    { rotIdx:0 }, { rotIdx:1 }  // Row 2
                ];
            } else if (teamChar === 'B') {
                // Bチーム: (B1=idx0 が右上)
                // B2(idx1) B1(idx0)
                // B3(idx2) B6(idx5)
                // B4(idx3) B5(idx4)
                return [
                    { rotIdx:1 }, { rotIdx:0 }, // Row 0
                    { rotIdx:2 }, { rotIdx:5 }, // Row 1
                    { rotIdx:3 }, { rotIdx:4 }  // Row 2
                ];
            }
            return [];
        },

        resetData() {
            this.teamAScore = 0;
            this.teamBScore = 0;
            this.teamARotation = [...this.teamAInitialPlayers]; // 配列のコピー
            this.teamBRotation = [...this.teamBInitialPlayers]; // 配列のコピー
            this.serverTeam = 'A';
            this.history = [];
            this.currentSet = 1;
            this.teamAName = "チームA";
            this.teamBName = "チームB";
        },

        updateDisplays() {
            // セット数
            this.dom.setDisplay.textContent = `${this.currentSet} セット目`;
            // チーム名
            this.dom.teamANameLabel.textContent = this.teamAName;
            this.dom.teamBNameLabel.textContent = this.teamBName;
            // スコア
            this.dom.teamAScoreLabel.textContent = this.teamAScore;
            this.dom.teamBScoreLabel.textContent = this.teamBScore;

            // サーバー情報
            let serverPlayerName = "";
            let serverTeamDisplayName = "";
            if (this.serverTeam === 'A' && this.teamARotation.length > 0) {
                serverPlayerName = this.teamARotation[0];
                serverTeamDisplayName = this.teamAName;
            } else if (this.serverTeam === 'B' && this.teamBRotation.length > 0) {
                serverPlayerName = this.teamBRotation[0];
                serverTeamDisplayName = this.teamBName;
            }
            this.dom.serverInfo.textContent = `サーバー: ${serverTeamDisplayName} - ${serverPlayerName}`;

            // ローテーション盤面
            this.updateRotationGrid('A', this.dom.teamARotationCells, this.teamARotation);
            this.updateRotationGrid('B', this.dom.teamBRotationCells, this.teamBRotation);

            // ボタン状態
            this.dom.swapServerBtn.disabled = !(this.teamAScore === 0 && this.teamBScore === 0);
            this.dom.undoBtn.disabled = this.history.length === 0;
        },

        updateRotationGrid(teamChar, cellStorage, rotationList) {
            // cellStorage は { rotIdx: cellElement }
            for (let rotIdx = 0; rotIdx < 6; rotIdx++) {
                const cell = cellStorage[rotIdx];
                if (cell) {
                    const playerNameToDisplay = rotationList[rotIdx];
                    cell.textContent = playerNameToDisplay;
                    cell.classList.remove('server-player');
                    if (this.serverTeam === teamChar && rotIdx === 0) { // サーバーはrotIdx 0の選手
                        cell.classList.add('server-player');
                    }
                }
            }
        },

        addEventListeners() {
            this.dom.setDisplay.addEventListener('click', () => this.changeSetNumber());
            this.dom.teamANameLabel.addEventListener('click', () => this.changeTeamName('A'));
            this.dom.teamBNameLabel.addEventListener('click', () => this.changeTeamName('B'));
            this.dom.addPointABtn.addEventListener('click', () => this.addPoint('A'));
            this.dom.addPointBBtn.addEventListener('click', () => this.addPoint('B'));
            this.dom.swapServerBtn.addEventListener('click', () => this.swapServerTeam());
            this.dom.rotateABtn.addEventListener('click', () => this.manualRotate('A'));
            this.dom.rotateBBtn.addEventListener('click', () => this.manualRotate('B'));
            this.dom.undoBtn.addEventListener('click', () => this.undoLastAction());
            this.dom.resetBtn.addEventListener('click', () => this.resetGame());
        },

        saveStateForUndo() {
            const state = {
                a_score: this.teamAScore, b_score: this.teamBScore,
                a_rot: [...this.teamARotation], b_rot: [...this.teamBRotation],
                server: this.serverTeam, current_set: this.currentSet,
                team_a_name: this.teamAName, team_b_name: this.teamBName
            };
            this.history.push(state);
        },

        undoLastAction() {
            if (this.history.length === 0) {
                alert("これ以上元に戻せません。");
                return;
            }
            const lastState = this.history.pop();
            this.teamAScore = lastState.a_score;
            this.teamBScore = lastState.b_score;
            this.teamARotation = [...lastState.a_rot];
            this.teamBRotation = [...lastState.b_rot];
            this.serverTeam = lastState.server;
            this.currentSet = lastState.current_set || 1; // 古い履歴データのためのフォールバック
            this.teamAName = lastState.team_a_name || "チームA";
            this.teamBName = lastState.team_b_name || "チームB";
            this.updateDisplays();
        },

        swapServerTeam() {
            if (this.teamAScore === 0 && this.teamBScore === 0) {
                this.saveStateForUndo();
                this.serverTeam = (this.serverTeam === 'A') ? 'B' : 'A';
                this.updateDisplays();
            }
        },

        changeSetNumber() {
            this.saveStateForUndo();
            const newSetString = prompt("現在のセット番号を入力してください:", this.currentSet);
            if (newSetString !== null) { // キャンセルでなければ
                const newSet = parseInt(newSetString);
                if (!isNaN(newSet) && newSet >= 1) {
                    this.currentSet = newSet;
                    this.updateDisplays();
                } else {
                    alert("無効なセット番号です。1以上の数値を入力してください。");
                    this.history.pop(); // 無効な操作なのでUndo履歴から取り除く
                }
            } else {
                this.history.pop(); // キャンセルされたのでUndo履歴から取り除く
            }
        },

        changeTeamName(teamChar) {
            this.saveStateForUndo();
            const currentName = (teamChar === 'A') ? this.teamAName : this.teamBName;
            const newName = prompt(`新しいチーム名を入力してください (${currentName}):`, currentName);
            if (newName !== null) { // キャンセルでなければ
                if (newName.trim() !== "") {
                    if (teamChar === 'A') this.teamAName = newName.trim();
                    else this.teamBName = newName.trim();
                    this.updateDisplays();
                } else {
                    alert("チーム名は空にできません。");
                    this.history.pop();
                }
            } else {
                this.history.pop();
            }
        },

        editPlayerName(teamChar, rotIdx) {
            this.saveStateForUndo();
            const rotationList = (teamChar === 'A') ? this.teamARotation : this.teamBRotation;
            const currentPlayerName = rotationList[rotIdx];
            const newPlayerName = prompt(`プレイヤー名/番号変更 (${currentPlayerName}):`, currentPlayerName);

            if (newPlayerName !== null) { // キャンセルでなければ
                if (newPlayerName.trim() !== "") {
                    rotationList[rotIdx] = newPlayerName.trim();
                    this.updateDisplays();
                } else {
                    alert("プレイヤー名は空にできません。");
                    this.history.pop();
                }
            } else {
                this.history.pop();
            }
        },

        addPoint(scoringTeam) {
            this.saveStateForUndo();
            if (scoringTeam === 'A') {
                this.teamAScore++;
                if (this.serverTeam === 'B') {
                    this.serverTeam = 'A';
                    this.performRotation(this.teamARotation);
                }
            } else if (scoringTeam === 'B') {
                this.teamBScore++;
                if (this.serverTeam === 'A') {
                    this.serverTeam = 'B';
                    this.performRotation(this.teamBRotation);
                }
            }
            this.updateDisplays();
        },

        performRotation(rotationList) {
            if (!rotationList || rotationList.length === 0) return;
            const firstPlayer = rotationList.shift();
            rotationList.push(firstPlayer);
        },

        manualRotate(teamId) {
            this.saveStateForUndo();
            if (teamId === 'A') {
                this.performRotation(this.teamARotation);
                this.serverTeam = 'A';
            } else if (teamId === 'B') {
                this.performRotation(this.teamBRotation);
                this.serverTeam = 'B';
            }
            this.updateDisplays();
        },

        resetGame() {
            // confirmダイアログはPython版には無かったので省略も可
            if (confirm("ゲームをリセットしてもよろしいですか？")) {
                this.resetData();
                this.updateDisplays();
            }
        }
    };

    scoreboardApp.init(); // アプリケーション起動
});