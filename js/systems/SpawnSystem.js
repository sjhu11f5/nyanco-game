Game.SpawnSystem = class SpawnSystem {
    constructor(moneySystem) {
        this.moneySystem = moneySystem;
        this.cooldowns = {};

        // 全ネコタイプのクールダウン初期化
        for (const key in Game.UnitData.cats) {
            this.cooldowns[key] = 0;
        }
    }

    update(delta) {
        for (const key in this.cooldowns) {
            if (this.cooldowns[key] > 0) {
                this.cooldowns[key] = Math.max(0, this.cooldowns[key] - delta);
            }
        }
    }

    canSpawn(unitKey) {
        const data = Game.UnitData.cats[unitKey];
        return this.cooldowns[unitKey] <= 0 && this.moneySystem.canAfford(data.cost);
    }

    spawn(scene, unitKey, x, y) {
        const data = Game.UnitData.cats[unitKey];
        if (!this.canSpawn(unitKey)) return null;

        this.moneySystem.spend(data.cost);
        this.cooldowns[unitKey] = data.spawnCooldown;

        return new Game.Unit(scene, 'player', data, x, y);
    }

    getCooldownPercent(unitKey) {
        const data = Game.UnitData.cats[unitKey];
        if (this.cooldowns[unitKey] <= 0) return 0;
        return this.cooldowns[unitKey] / data.spawnCooldown;
    }
};
