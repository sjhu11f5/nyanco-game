window.Game = {};

Game.CONFIG = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    backgroundColor: '#87CEEB',
    parent: document.body,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        activePointers: 3,
        touch: {
            capture: true
        }
    },
    scene: []
};

// ゲーム進行状態（クリア済みステージを管理）
Game.progress = {
    clearedStages: [],

    markCleared(stageKey) {
        if (!this.clearedStages.includes(stageKey)) {
            this.clearedStages.push(stageKey);
        }
    },

    getMaxClearedIndex() {
        let max = -1;
        for (const key of this.clearedStages) {
            const idx = Game.StageOrder.indexOf(key);
            if (idx > max) max = idx;
        }
        return max;
    },

    isUnlocked(catData) {
        if (!catData.unlockStage) return true; // unlockStageがなければ最初から使える
        return this.getMaxClearedIndex() >= catData.unlockStage - 1;
    },

    getUnlockedCatKeys() {
        const keys = [];
        for (const key in Game.UnitData.cats) {
            if (this.isUnlocked(Game.UnitData.cats[key])) {
                keys.push(key);
            }
        }
        return keys;
    }
};
