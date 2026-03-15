Game.EnemySpawner = class EnemySpawner {
    constructor(stageData) {
        this.elapsedTime = 0;
        // 各ウェーブの状態をコピー
        this.waves = stageData.waves.map(w => ({
            time: w.time,
            unitKey: w.unitKey,
            count: w.count,
            interval: w.interval,
            spawned: 0,
            nextSpawnTime: w.time
        }));
    }

    update(delta, enemyUnits, scene, spawnX, groundY) {
        this.elapsedTime += delta;

        for (const wave of this.waves) {
            if (wave.spawned >= wave.count) continue;
            if (this.elapsedTime < wave.nextSpawnTime) continue;

            // 敵をスポーン
            const data = Game.UnitData.enemies[wave.unitKey];
            const y = groundY + Phaser.Math.Between(-30, 30);
            const unit = new Game.Unit(scene, 'enemy', data, spawnX, y);
            enemyUnits.push(unit);

            wave.spawned++;
            wave.nextSpawnTime = this.elapsedTime + wave.interval;
        }
    }

    isAllSpawned() {
        return this.waves.every(w => w.spawned >= w.count);
    }
};
