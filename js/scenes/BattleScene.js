Game.BattleScene = class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'battle' });
    }

    init(data) {
        this.stageKey = data.stageKey || 'stage1';
        this.selectedCats = data.selectedCats || null;
    }

    create() {
        const stage = Game.StageData[this.stageKey];
        this.stageData = stage;
        this.gameOver = false;
        this.paused = false;
        this.bossSpawned = false;
        this.bossDefeated = false;
        this.bossUnit = null;
        this.bossWaveSpawner = null;
        this.postBossSpawner = null;

        // ワールド設定
        this.cameras.main.setBounds(0, 0, stage.worldWidth, Game.CONFIG.height);
        this.groundY = 460; // 地面のY座標

        // 背景
        this.createBackground(stage.worldWidth);

        // 拠点作成
        this.playerBase = new Game.Base(this, 'player', stage.playerBaseHP, 80, this.groundY);
        this.enemyBase = new Game.Base(this, 'enemy', stage.baseHP, stage.worldWidth - 80, this.groundY);

        // ユニット配列
        this.playerUnits = [];
        this.enemyUnits = [];

        // システム初期化
        this.moneySystem = new Game.MoneySystem(stage.startingMoney, stage.moneyPerSecond);
        this.spawnSystem = new Game.SpawnSystem(this.moneySystem);
        this.enemySpawner = new Game.EnemySpawner(stage);
        this.combatSystem = new Game.CombatSystem();

        // 拠点大砲
        this.baseCannon = {
            cooldown: 15,
            timer: 10, // 最初は10秒後に発射可能
            damage: 150,
            range: 400 // 拠点から届く範囲
        };

        // 大砲の範囲表示（半透明のライン）
        this.cannonRangeLine = this.add.rectangle(
            this.playerBase.x + this.baseCannon.range / 2, this.groundY - 20,
            this.baseCannon.range, 4, 0xFF8800, 0.3
        );
        this.cannonRangeLine.setDepth(0);
        // 範囲の端マーカー
        this.cannonRangeEnd = this.add.graphics();
        this.cannonRangeEnd.lineStyle(2, 0xFF8800, 0.4);
        const rangeEndX = this.playerBase.x + this.baseCannon.range;
        this.cannonRangeEnd.lineBetween(rangeEndX, this.groundY - 60, rangeEndX, this.groundY + 10);
        this.cannonRangeEnd.setDepth(0);

        // HUD
        this.hud = new Game.HUD(this, this.moneySystem, this.spawnSystem, this.playerBase, this.enemyBase);

        // カメラドラッグ操作
        this.setupCameraControls();

        // ポーズボタン
        this.setupPause();

        // ステージ名表示
        this.showStageName(stage.name);
    }

    createBackground(worldWidth) {
        const gY = this.groundY - 40;
        const groundH = Game.CONFIG.height - this.groundY + 40 + 100;

        switch (this.stageKey) {
            case 'stage1': this.bgGrassland(worldWidth, gY, groundH); break;
            case 'stage2': this.bgDesert(worldWidth, gY, groundH); break;
            case 'stage3': this.bgForest(worldWidth, gY, groundH); break;
            case 'stage4': this.bgVolcano(worldWidth, gY, groundH); break;
            case 'stage5': this.bgCastle(worldWidth, gY, groundH); break;
            case 'stage6': this.bgIce(worldWidth, gY, groundH); break;
            case 'stage7': this.bgDeepSea(worldWidth, gY, groundH); break;
            case 'stage8': this.bgSky(worldWidth, gY, groundH); break;
            case 'stage9': this.bgHell(worldWidth, gY, groundH); break;
            case 'stage10': this.bgFinal(worldWidth, gY, groundH); break;
            default: this.bgGrassland(worldWidth, gY, groundH); break;
        }
    }

    // ステージ1: にゃんこ草原（明るい緑）
    bgGrassland(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE0F0FF, 0xE0F0FF, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        const ground = this.add.graphics();
        ground.fillStyle(0x88BB44, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0x77AA33, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 雲
        for (let i = 0; i < 10; i++) {
            const c = this.add.ellipse(Phaser.Math.Between(0, w), Phaser.Math.Between(40, 180),
                Phaser.Math.Between(80, 160), Phaser.Math.Between(30, 50), 0xFFFFFF, 0.6);
            c.setDepth(-8);
        }

        // 山
        const mt = this.add.graphics();
        mt.fillStyle(0x6699AA, 0.4);
        for (let i = 0; i < 6; i++) {
            const mx = Phaser.Math.Between(0, w);
            const mw = Phaser.Math.Between(200, 400);
            const mh = Phaser.Math.Between(100, 200);
            mt.fillTriangle(mx - mw / 2, gY, mx, gY - mh, mx + mw / 2, gY);
        }
        mt.setDepth(-9);

        // 花
        for (let i = 0; i < 20; i++) {
            const fx = Phaser.Math.Between(0, w);
            const fy = Phaser.Math.Between(gY + 5, gY + 60);
            const flower = this.add.circle(fx, fy, 4, Phaser.Math.RND.pick([0xFF6699, 0xFFFF66, 0xFF9933, 0xFFFFFF]), 0.8);
            flower.setDepth(-4);
        }
    }

    // ステージ2: 夕焼け砂漠（オレンジ）
    bgDesert(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0xFF6633, 0xFF8844, 0xFFCC66, 0xFFEEAA, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        // 太陽
        const sun = this.add.circle(w * 0.7, 100, 50, 0xFFDD44, 0.9);
        sun.setDepth(-9);
        const sunGlow = this.add.circle(w * 0.7, 100, 80, 0xFFDD44, 0.2);
        sunGlow.setDepth(-9);

        const ground = this.add.graphics();
        ground.fillStyle(0xDDBB66, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0xCC9944, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 砂丘
        const dune = this.add.graphics();
        dune.fillStyle(0xCCAA55, 0.5);
        for (let i = 0; i < 8; i++) {
            const dx = Phaser.Math.Between(0, w);
            const dw = Phaser.Math.Between(150, 350);
            const dh = Phaser.Math.Between(30, 80);
            dune.fillTriangle(dx - dw / 2, gY, dx, gY - dh, dx + dw / 2, gY);
        }
        dune.setDepth(-7);

        // サボテン
        const cactus = this.add.graphics();
        cactus.fillStyle(0x338833, 1);
        for (let i = 0; i < 6; i++) {
            const cx = Phaser.Math.Between(100, w - 100);
            cactus.fillRect(cx, gY - 40, 10, 40);
            cactus.fillRect(cx - 12, gY - 30, 10, 6);
            cactus.fillRect(cx + 12, gY - 35, 10, 6);
            cactus.fillRect(cx - 12, gY - 30, 6, 15);
            cactus.fillRect(cx + 12, gY - 35, 6, 20);
        }
        cactus.setDepth(-4);
    }

    // ステージ3: 暗黒の森（暗い紫）
    bgForest(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x1A0A2E, 0x2D1B4E, 0x3D2B5E, 0x4A3568, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        // 月
        const moon = this.add.circle(w * 0.8, 80, 35, 0xEEEECC, 0.9);
        moon.setDepth(-9);
        // 月の影
        const moonShadow = this.add.circle(w * 0.8 + 10, 75, 30, 0x1A0A2E, 0.7);
        moonShadow.setDepth(-9);

        // 星
        for (let i = 0; i < 30; i++) {
            const star = this.add.circle(Phaser.Math.Between(0, w), Phaser.Math.Between(10, gY - 50),
                Phaser.Math.Between(1, 3), 0xFFFFFF, Phaser.Math.FloatBetween(0.3, 0.9));
            star.setDepth(-9);
        }

        const ground = this.add.graphics();
        ground.fillStyle(0x2A3A1A, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0x1A2A0A, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 暗い木々
        const trees = this.add.graphics();
        for (let i = 0; i < 15; i++) {
            const tx = Phaser.Math.Between(0, w);
            const th = Phaser.Math.Between(80, 180);
            const tw = Phaser.Math.Between(40, 80);
            // 幹
            trees.fillStyle(0x332211, 0.7);
            trees.fillRect(tx - 5, gY - th + 40, 10, th - 40);
            // 葉（暗い三角）
            trees.fillStyle(0x1A3A1A, 0.6);
            trees.fillTriangle(tx - tw / 2, gY - th + 60, tx, gY - th, tx + tw / 2, gY - th + 60);
            trees.fillTriangle(tx - tw / 2 - 5, gY - th + 90, tx, gY - th + 30, tx + tw / 2 + 5, gY - th + 90);
        }
        trees.setDepth(-7);

        // 霧
        for (let i = 0; i < 8; i++) {
            const fog = this.add.ellipse(Phaser.Math.Between(0, w), gY - Phaser.Math.Between(0, 30),
                Phaser.Math.Between(150, 300), Phaser.Math.Between(20, 40), 0x8888AA, 0.15);
            fog.setDepth(-3);
        }
    }

    // ステージ4: 灼熱の火山（赤黒い）
    bgVolcano(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x330000, 0x551111, 0x882200, 0xAA4400, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        const ground = this.add.graphics();
        ground.fillStyle(0x3A2A1A, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0x2A1A0A, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 火山
        const volcano = this.add.graphics();
        volcano.fillStyle(0x4A3020, 0.8);
        const vx = w * 0.4;
        volcano.fillTriangle(vx - 200, gY, vx, gY - 220, vx + 200, gY);
        volcano.fillStyle(0x5A4030, 0.6);
        volcano.fillTriangle(vx + 300, gY, vx + 500, gY - 150, vx + 650, gY);
        volcano.setDepth(-8);

        // 溶岩の光（火口）
        const lavaGlow = this.add.circle(vx, gY - 210, 25, 0xFF4400, 0.6);
        lavaGlow.setDepth(-7);
        const lavaGlow2 = this.add.circle(vx, gY - 210, 40, 0xFF4400, 0.2);
        lavaGlow2.setDepth(-7);

        // 溶岩の川（地面）
        const lava = this.add.graphics();
        lava.fillStyle(0xFF4400, 0.4);
        for (let i = 0; i < 5; i++) {
            const lx = Phaser.Math.Between(0, w);
            lava.fillRect(lx, gY + 10, Phaser.Math.Between(60, 150), 6);
        }
        lava.setDepth(-4);

        // 灰の粒子
        for (let i = 0; i < 25; i++) {
            const ash = this.add.circle(Phaser.Math.Between(0, w), Phaser.Math.Between(20, gY),
                Phaser.Math.Between(1, 3), 0xAA8866, Phaser.Math.FloatBetween(0.2, 0.5));
            ash.setDepth(-6);
        }

        // 赤い雲
        for (let i = 0; i < 6; i++) {
            const c = this.add.ellipse(Phaser.Math.Between(0, w), Phaser.Math.Between(30, 120),
                Phaser.Math.Between(100, 200), Phaser.Math.Between(20, 40), 0xFF6633, 0.2);
            c.setDepth(-9);
        }
    }

    // ステージ5: 魔王城（紫黒い、不気味）
    bgCastle(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x0A0A1A, 0x15102A, 0x201535, 0x2A1A40, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        const ground = this.add.graphics();
        ground.fillStyle(0x222233, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0x333344, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 星
        for (let i = 0; i < 40; i++) {
            const star = this.add.circle(Phaser.Math.Between(0, w), Phaser.Math.Between(5, gY - 80),
                Phaser.Math.Between(1, 2), 0xDDDDFF, Phaser.Math.FloatBetween(0.3, 0.8));
            star.setDepth(-9);
        }

        // 背景の城シルエット
        const castle = this.add.graphics();
        castle.fillStyle(0x111122, 0.8);
        // 中央の塔
        castle.fillRect(w * 0.45, gY - 200, 40, 200);
        castle.fillTriangle(w * 0.45 - 10, gY - 200, w * 0.45 + 20, gY - 240, w * 0.45 + 50, gY - 200);
        // 左の塔
        castle.fillRect(w * 0.3, gY - 140, 30, 140);
        castle.fillTriangle(w * 0.3 - 8, gY - 140, w * 0.3 + 15, gY - 170, w * 0.3 + 38, gY - 140);
        // 右の塔
        castle.fillRect(w * 0.6, gY - 160, 35, 160);
        castle.fillTriangle(w * 0.6 - 8, gY - 160, w * 0.6 + 17, gY - 195, w * 0.6 + 43, gY - 160);
        // 城壁
        castle.fillRect(w * 0.3, gY - 80, w * 0.35, 80);
        // 窓（光る）
        castle.setDepth(-8);

        const windows = this.add.graphics();
        windows.fillStyle(0xFFAA00, 0.6);
        windows.fillRect(w * 0.45 + 12, gY - 180, 16, 20);
        windows.fillRect(w * 0.45 + 12, gY - 140, 16, 20);
        windows.fillRect(w * 0.3 + 8, gY - 120, 14, 18);
        windows.fillRect(w * 0.6 + 10, gY - 140, 14, 18);
        windows.setDepth(-7);

        // 紫の霧
        for (let i = 0; i < 10; i++) {
            const fog = this.add.ellipse(Phaser.Math.Between(0, w), gY - Phaser.Math.Between(-10, 30),
                Phaser.Math.Between(150, 350), Phaser.Math.Between(25, 50), 0x6633AA, 0.15);
            fog.setDepth(-3);
        }

        // コウモリ風の影
        const bats = this.add.graphics();
        bats.fillStyle(0x111111, 0.5);
        for (let i = 0; i < 8; i++) {
            const bx = Phaser.Math.Between(0, w);
            const by = Phaser.Math.Between(30, gY - 60);
            const bs = Phaser.Math.Between(6, 12);
            bats.fillTriangle(bx - bs, by, bx, by - bs / 2, bx + bs, by);
        }
        bats.setDepth(-6);
    }

    // ステージ6: 凍結の氷原
    bgIce(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0xAADDEE, 0xBBEEFF, 0xDDF0FF, 0xEEF8FF, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        const ground = this.add.graphics();
        ground.fillStyle(0xCCDDEE, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0xAABBDD, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 雪の結晶
        for (let i = 0; i < 30; i++) {
            const s = this.add.circle(Phaser.Math.Between(0, w), Phaser.Math.Between(10, gY),
                Phaser.Math.Between(2, 4), 0xFFFFFF, Phaser.Math.FloatBetween(0.4, 0.8));
            s.setDepth(-6);
        }
        // 氷山
        const ice = this.add.graphics();
        ice.fillStyle(0x99CCEE, 0.6);
        for (let i = 0; i < 5; i++) {
            const ix = Phaser.Math.Between(0, w);
            const iw = Phaser.Math.Between(100, 250);
            const ih = Phaser.Math.Between(60, 140);
            ice.fillTriangle(ix - iw / 2, gY, ix, gY - ih, ix + iw / 2, gY);
        }
        ice.setDepth(-8);
    }

    // ステージ7: 深海の神殿
    bgDeepSea(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x001133, 0x002255, 0x003366, 0x004488, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        const ground = this.add.graphics();
        ground.fillStyle(0x112233, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0x223344, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 泡
        for (let i = 0; i < 20; i++) {
            const b = this.add.circle(Phaser.Math.Between(0, w), Phaser.Math.Between(20, gY),
                Phaser.Math.Between(3, 8), 0x66AACC, Phaser.Math.FloatBetween(0.15, 0.4));
            b.setDepth(-6);
        }
        // 光の筋
        const light = this.add.graphics();
        light.fillStyle(0x4488AA, 0.1);
        for (let i = 0; i < 4; i++) {
            const lx = Phaser.Math.Between(100, w - 100);
            light.fillTriangle(lx - 5, 0, lx + 5, 0, lx + 40, gY);
            light.fillTriangle(lx - 5, 0, lx + 5, 0, lx - 40, gY);
        }
        light.setDepth(-9);
    }

    // ステージ8: 天空の回廊
    bgSky(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x4488CC, 0x66AAEE, 0xAADDFF, 0xFFFFFF, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        const ground = this.add.graphics();
        ground.fillStyle(0xDDCCAA, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0xCCBB99, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 大きな雲（足場のように）
        for (let i = 0; i < 15; i++) {
            const c = this.add.ellipse(Phaser.Math.Between(0, w), Phaser.Math.Between(40, gY - 20),
                Phaser.Math.Between(100, 250), Phaser.Math.Between(30, 60), 0xFFFFFF, 0.5);
            c.setDepth(-8);
        }
        // 虹
        const rainbow = this.add.graphics();
        const colors = [0xFF0000, 0xFF8800, 0xFFFF00, 0x00FF00, 0x0088FF, 0x8800FF];
        for (let i = 0; i < colors.length; i++) {
            rainbow.lineStyle(3, colors[i], 0.2);
            rainbow.beginPath();
            rainbow.arc(w * 0.5, gY + 100, 300 - i * 12, Math.PI, 0, true);
            rainbow.strokePath();
        }
        rainbow.setDepth(-9);
    }

    // ステージ9: 煉獄の門
    bgHell(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x220000, 0x440000, 0x661100, 0x882200, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        const ground = this.add.graphics();
        ground.fillStyle(0x331100, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0x441100, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 溶岩の光
        const lava = this.add.graphics();
        lava.fillStyle(0xFF4400, 0.5);
        for (let i = 0; i < 8; i++) {
            const lx = Phaser.Math.Between(0, w);
            lava.fillRect(lx, gY + 5, Phaser.Math.Between(80, 200), 8);
        }
        lava.setDepth(-4);

        // 骸骨柱
        const pillars = this.add.graphics();
        pillars.fillStyle(0x442211, 0.7);
        for (let i = 0; i < 6; i++) {
            const px = Phaser.Math.Between(50, w - 50);
            const ph = Phaser.Math.Between(80, 160);
            pillars.fillRect(px - 8, gY - ph, 16, ph);
            pillars.fillCircle(px, gY - ph, 12);
        }
        pillars.setDepth(-7);

        // 赤い霧
        for (let i = 0; i < 8; i++) {
            const fog = this.add.ellipse(Phaser.Math.Between(0, w), Phaser.Math.Between(gY - 30, gY + 10),
                Phaser.Math.Between(150, 300), Phaser.Math.Between(20, 40), 0xFF2200, 0.12);
            fog.setDepth(-3);
        }
    }

    // ステージ10: 終焉の地
    bgFinal(w, gY, gH) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x000000, 0x0A0010, 0x150020, 0x200030, 1);
        sky.fillRect(0, 0, w, gY);
        sky.setDepth(-10);

        const ground = this.add.graphics();
        ground.fillStyle(0x110011, 1);
        ground.fillRect(0, gY, w, gH);
        ground.fillStyle(0x220022, 1);
        ground.fillRect(0, gY, w, 4);
        ground.setDepth(-5);

        // 不気味な星
        for (let i = 0; i < 50; i++) {
            const color = Phaser.Math.RND.pick([0xFF4444, 0xFFFFFF, 0xFF88FF, 0x8888FF]);
            const s = this.add.circle(Phaser.Math.Between(0, w), Phaser.Math.Between(5, gY - 40),
                Phaser.Math.Between(1, 3), color, Phaser.Math.FloatBetween(0.3, 0.9));
            s.setDepth(-9);
        }

        // 巨大な裂け目
        const crack = this.add.graphics();
        crack.lineStyle(4, 0xFF00FF, 0.4);
        crack.lineBetween(w * 0.5, 0, w * 0.48, gY * 0.3);
        crack.lineBetween(w * 0.48, gY * 0.3, w * 0.52, gY * 0.6);
        crack.lineBetween(w * 0.52, gY * 0.6, w * 0.47, gY);
        crack.lineStyle(8, 0xFF00FF, 0.15);
        crack.lineBetween(w * 0.5, 0, w * 0.48, gY * 0.3);
        crack.lineBetween(w * 0.48, gY * 0.3, w * 0.52, gY * 0.6);
        crack.lineBetween(w * 0.52, gY * 0.6, w * 0.47, gY);
        crack.setDepth(-8);

        // 紫と赤の霧
        for (let i = 0; i < 12; i++) {
            const color = Phaser.Math.RND.pick([0x6600AA, 0xAA0044, 0x440066]);
            const fog = this.add.ellipse(Phaser.Math.Between(0, w), Phaser.Math.Between(gY - 40, gY + 10),
                Phaser.Math.Between(150, 350), Phaser.Math.Between(25, 50), color, 0.12);
            fog.setDepth(-3);
        }

        // 浮遊する破片
        for (let i = 0; i < 10; i++) {
            const d = this.add.rectangle(Phaser.Math.Between(0, w), Phaser.Math.Between(50, gY - 20),
                Phaser.Math.Between(5, 15), Phaser.Math.Between(5, 15), 0x332244, Phaser.Math.FloatBetween(0.3, 0.6));
            d.setAngle(Phaser.Math.Between(0, 360));
            d.setDepth(-7);
        }
    }

    setupCameraControls() {
        this.isDragging = false;
        this.dragStartX = 0;
        this.cameraStartX = 0;
        this.manualCameraTimer = 0; // 手動操作後に自動追従に戻るタイマー

        // HUDエリア（下部100px）以外でドラッグ可能
        this.input.on('pointerdown', (pointer) => {
            if (pointer.y < Game.CONFIG.height - 100) {
                this.isDragging = true;
                this.dragStartX = pointer.x;
                this.cameraStartX = this.cameras.main.scrollX;
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                const dx = this.dragStartX - pointer.x;
                this.cameras.main.scrollX = this.cameraStartX + dx;
                this.manualCameraTimer = 3.0; // 3秒間は手動モード維持
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });
    }

    updateCamera(dt) {
        // 手動操作タイマー減少
        if (this.manualCameraTimer > 0) {
            this.manualCameraTimer -= dt;
            return; // 手動操作中は自動追従しない
        }

        // 最前線のプレイヤーユニットを探す
        let frontX = this.playerBase.x;
        for (const unit of this.playerUnits) {
            if (unit.state !== 'dead' && unit.x > frontX) {
                frontX = unit.x;
            }
        }

        // 前線が画面の中央やや左に来るようにカメラを追従
        const targetScrollX = frontX - Game.CONFIG.width * 0.4;
        const cam = this.cameras.main;
        // スムーズに追従（lerp）
        cam.scrollX += (targetScrollX - cam.scrollX) * 0.05;
    }

    setupPause() {
        const W = Game.CONFIG.width;

        // ポーズボタン（右上）
        this.pauseBtn = this.add.rectangle(W - 40, 50, 50, 30, 0x333333, 0.8);
        this.pauseBtn.setScrollFactor(0);
        this.pauseBtn.setDepth(101);
        this.pauseBtn.setInteractive({ useHandCursor: true });

        this.pauseBtnText = this.add.text(W - 40, 50, '⏸', {
            fontSize: '18px', fontFamily: 'Arial', color: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(102);

        // ポーズオーバーレイ（初期非表示）
        this.pauseOverlay = this.add.rectangle(W / 2, Game.CONFIG.height / 2, W, Game.CONFIG.height, 0x000000, 0.5);
        this.pauseOverlay.setScrollFactor(0);
        this.pauseOverlay.setDepth(400);
        this.pauseOverlay.setVisible(false);

        this.pauseText = this.add.text(W / 2, Game.CONFIG.height / 2 - 60, 'PAUSED', {
            fontSize: '48px', fontFamily: 'Arial', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(401);
        this.pauseText.setVisible(false);

        this.pauseHint = this.add.text(W / 2, Game.CONFIG.height / 2 - 10, 'クリックまたはSpaceで再開', {
            fontSize: '18px', fontFamily: 'Arial', color: '#CCCCCC'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(401);
        this.pauseHint.setVisible(false);

        // 編成に戻るボタン
        this.pauseBackBtn = this.add.rectangle(W / 2, Game.CONFIG.height / 2 + 40, 220, 40, 0x4466AA, 1);
        this.pauseBackBtn.setScrollFactor(0).setDepth(401);
        this.pauseBackBtn.setInteractive({ useHandCursor: true });
        this.pauseBackBtn.setVisible(false);

        this.pauseBackText = this.add.text(W / 2, Game.CONFIG.height / 2 + 40, '編成に戻る', {
            fontSize: '18px', fontFamily: 'Arial', color: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);
        this.pauseBackText.setVisible(false);

        this.pauseBackBtn.on('pointerdown', () => {
            this.scene.start('prepare', { stageKey: this.stageKey });
        });
        this.pauseBackBtn.on('pointerover', () => this.pauseBackBtn.setFillStyle(0x5577BB));
        this.pauseBackBtn.on('pointerout', () => this.pauseBackBtn.setFillStyle(0x4466AA));

        // ポーズボタンクリック
        this.pauseBtn.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.togglePause();
        });

        // Spaceキーでもポーズ切り替え
        this.input.keyboard.on('keydown-SPACE', () => {
            this.togglePause();
        });
    }

    togglePause() {
        this.paused = !this.paused;
        this.pauseOverlay.setVisible(this.paused);
        this.pauseText.setVisible(this.paused);
        this.pauseHint.setVisible(this.paused);
        this.pauseBackBtn.setVisible(this.paused);
        this.pauseBackText.setVisible(this.paused);
        this.pauseBtnText.setText(this.paused ? '▶' : '⏸');
    }

    showStageName(name) {
        const text = this.add.text(Game.CONFIG.width / 2, 80, name, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

        this.tweens.add({
            targets: text,
            alpha: 0,
            y: 60,
            delay: 2000,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    updateBaseCannon(dt) {
        const cannon = this.baseCannon;
        if (cannon.timer > 0) {
            cannon.timer -= dt;
            if (cannon.timer < 0) cannon.timer = 0;
        }
        // ready状態ならtimer=0のまま待機（手動発射を待つ）
    }

    tryFireBaseCannon() {
        if (this.baseCannon.timer <= 0 && !this.gameOver && !this.paused) {
            this.baseCannon.timer = this.baseCannon.cooldown;
            this.fireBaseCannon();
        }
    }

    fireBaseCannon() {
        const baseX = this.playerBase.x;
        const baseY = this.groundY - 100;

        // 範囲内の敵を探す（最も近い敵をターゲット）
        let target = null;
        let closestDist = Infinity;
        for (const e of this.enemyUnits) {
            if (e.state === 'dying' || e.state === 'dead') continue;
            const dist = Math.abs(e.x - baseX);
            if (dist < closestDist && dist <= this.baseCannon.range) {
                closestDist = dist;
                target = e;
            }
        }

        // ターゲットがなければ敵拠点方向に撃つ
        const targetX = target ? target.x : baseX + this.baseCannon.range;
        const targetY = target ? target.y - 20 : this.groundY - 20;

        // 発射フラッシュ
        const flash = this.add.circle(baseX + 30, baseY, 20, 0xFFFF00, 0.9);
        flash.setDepth(30);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scaleX: 3,
            scaleY: 3,
            duration: 200,
            onComplete: () => flash.destroy()
        });

        // 砲弾（大きめ）
        const bullet = this.add.circle(baseX + 30, baseY, 10, 0xFF8800, 1);
        bullet.setDepth(30);

        const distance = Math.abs(targetX - baseX);
        const duration = Math.min(600, distance * 1.0);
        const arcHeight = Math.min(100, distance * 0.2);
        const startX = baseX + 30;
        const startY = baseY;

        this.tweens.add({
            targets: bullet,
            x: targetX,
            duration: duration,
            ease: 'Linear',
            onUpdate: (tween) => {
                const p = tween.progress;
                const arc = Math.sin(p * Math.PI) * arcHeight;
                bullet.y = startY + (targetY - startY) * p - arc;
            },
            onComplete: () => {
                bullet.destroy();

                // 着弾爆発（大きい）
                const exp = this.add.circle(targetX, targetY, 10, 0xFF4400, 1);
                exp.setDepth(31);
                this.tweens.add({
                    targets: exp,
                    scaleX: 6,
                    scaleY: 6,
                    alpha: 0,
                    duration: 400,
                    onComplete: () => exp.destroy()
                });

                // 衝撃波リング
                const ring = this.add.circle(targetX, targetY, 10, 0xFFAA00, 0.5);
                ring.setDepth(31);
                ring.setStrokeStyle(3, 0xFFCC00);
                this.tweens.add({
                    targets: ring,
                    scaleX: 5,
                    scaleY: 5,
                    alpha: 0,
                    duration: 350,
                    onComplete: () => ring.destroy()
                });

                // 範囲ダメージ（着弾点から100px以内の敵）
                for (const e of this.enemyUnits) {
                    if (e.state === 'dying' || e.state === 'dead') continue;
                    if (Math.abs(e.x - targetX) <= 100) {
                        e.takeDamage(this.baseCannon.damage);
                    }
                }
            }
        });
    }

    spawnBoss() {
        this.bossSpawned = true;
        // ステージごとにボスを強化
        const stageIndex = Game.StageOrder.indexOf(this.stageKey);
        const scale = 1 + stageIndex * 0.5; // ステージ1=1倍, 2=1.5倍, 3=2倍, 4=2.5倍, 5=3倍
        const base = Game.UnitData.enemies.boss;
        const bossData = Object.assign({}, base, {
            hp: Math.floor(base.hp * scale),
            attack: Math.floor(base.attack * scale),
            moneyDrop: Math.floor(base.moneyDrop * scale)
        });
        this.bossUnit = new Game.Unit(this, 'enemy', bossData, this.enemyBase.x - 60, this.groundY);
        this.enemyUnits.push(this.bossUnit);

        // ボスと一緒に通常敵も出す
        this.bossWaveSpawner = new Game.EnemySpawner({
            waves: [
                { time: 1,  unitKey: 'doge',   count: 3, interval: 2.0 },
                { time: 5,  unitKey: 'snache',  count: 4, interval: 1.5 },
                { time: 10, unitKey: 'doge',    count: 4, interval: 1.5 },
                { time: 16, unitKey: 'those_guys', count: 1, interval: 0 },
                { time: 20, unitKey: 'snache',  count: 5, interval: 1.0 },
                { time: 28, unitKey: 'doge',    count: 5, interval: 1.0 }
            ]
        });

        // 警告演出
        const W = Game.CONFIG.width;
        const H = Game.CONFIG.height;
        const warning = this.add.text(W / 2, H / 2 - 60, 'WARNING!! ボス出現！', {
            fontSize: '40px',
            fontFamily: 'Arial',
            color: '#FF0000',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(300);

        // 画面を赤く点滅
        const flash = this.add.rectangle(W / 2, H / 2, W, H, 0xFF0000, 0.3);
        flash.setScrollFactor(0).setDepth(299);

        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 300,
            yoyo: true,
            repeat: 2,
            onComplete: () => flash.destroy()
        });

        this.tweens.add({
            targets: warning,
            alpha: 0,
            y: H / 2 - 80,
            delay: 2000,
            duration: 500,
            onComplete: () => warning.destroy()
        });
    }

    startPostBossWaves() {
        const postBossData = {
            waves: [
                { time: 0,  unitKey: 'doge',   count: 4, interval: 1.5 },
                { time: 3,  unitKey: 'snache',  count: 3, interval: 1.0 },
                { time: 8,  unitKey: 'doge',    count: 5, interval: 1.0 },
                { time: 12, unitKey: 'those_guys', count: 1, interval: 0 },
                { time: 15, unitKey: 'snache',  count: 6, interval: 0.8 }
            ]
        };
        this.postBossSpawner = new Game.EnemySpawner(postBossData);
    }

    getNewlyUnlockedCat(clearedStageIndex) {
        // このステージをクリアしたことで解放されるキャラを探す
        const unlockStage = clearedStageIndex + 1; // unlockStageは1始まり
        for (const key in Game.UnitData.cats) {
            const cat = Game.UnitData.cats[key];
            if (cat.unlockStage === unlockStage) {
                return cat;
            }
        }
        return null;
    }

    spawnPlayerUnit(catKey) {
        const y = this.groundY + Phaser.Math.Between(-25, 25);
        const unit = this.spawnSystem.spawn(this, catKey, this.playerBase.x + 60, y);
        if (unit) {
            this.playerUnits.push(unit);
        }
    }

    update(time, delta) {
        if (this.gameOver || this.paused) return;

        const dt = delta / 1000;

        // システム更新
        this.moneySystem.update(dt);
        this.spawnSystem.update(dt);
        this.enemySpawner.update(dt, this.enemyUnits, this, this.enemyBase.x - 60, this.groundY);

        // ボス出現判定（敵城HPが30%以下）
        if (!this.bossSpawned && this.enemyBase.getHPPercent() <= 0.5) {
            this.spawnBoss();
        }

        // ボス中の通常敵スポナー
        if (this.bossWaveSpawner) {
            this.bossWaveSpawner.update(dt, this.enemyUnits, this, this.enemyBase.x - 60, this.groundY);
        }

        // ボス撃破後に通常敵を出す
        if (this.bossSpawned && !this.bossDefeated && this.bossUnit &&
            (this.bossUnit.state === 'dead' || this.bossUnit.state === 'dying')) {
            this.bossDefeated = true;
            this.startPostBossWaves();
        }

        if (this.postBossSpawner) {
            this.postBossSpawner.update(dt, this.enemyUnits, this, this.enemyBase.x - 60, this.groundY);
        }

        // 拠点大砲
        this.updateBaseCannon(dt);

        // 戦闘処理
        this.combatSystem.update(this.playerUnits, this.enemyUnits, this.playerBase, this.enemyBase);

        // ユニット更新
        for (const unit of this.playerUnits) unit.update(dt);
        for (const unit of this.enemyUnits) unit.update(dt);

        // 死んだ敵からお金を得る
        for (const unit of this.enemyUnits) {
            if (unit.state === 'dead' && unit.data.moneyDrop && !unit._moneyAwarded) {
                this.moneySystem.earn(unit.data.moneyDrop);
                unit._moneyAwarded = true;
            }
        }

        // 死んだユニット除去
        this.playerUnits = this.playerUnits.filter(u => u.state !== 'dead');
        this.enemyUnits = this.enemyUnits.filter(u => u.state !== 'dead');

        // HUD更新
        this.hud.update();

        // カメラ自動追従
        this.updateCamera(dt);

        // 勝敗判定
        if (this.enemyBase.isDestroyed()) {
            this.showResult(true);
        } else if (this.playerBase.isDestroyed()) {
            this.showResult(false);
        }
    }

    showResult(isVictory) {
        this.gameOver = true;

        const W = Game.CONFIG.width;
        const H = Game.CONFIG.height;
        const stageOrder = Game.StageOrder;
        const currentIndex = stageOrder.indexOf(this.stageKey);

        // 背景オーバーレイ
        const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7);
        overlay.setScrollFactor(0);
        overlay.setDepth(500);

        if (isVictory) {
            // クリア記録
            Game.progress.markCleared(this.stageKey);

            const isLastStage = currentIndex >= stageOrder.length - 1;
            const msg = isLastStage ? '全ステージクリア！' : '勝利！';
            this.add.text(W / 2, H / 2 - 80, msg, {
                fontSize: isLastStage ? '48px' : '64px',
                fontFamily: 'Arial',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5).setScrollFactor(0).setDepth(501);

            if (isLastStage) {
                this.add.text(W / 2, H / 2 - 30, 'おめでとうございます！', {
                    fontSize: '24px', fontFamily: 'Arial', color: '#FFFFFF'
                }).setOrigin(0.5).setScrollFactor(0).setDepth(501);
            }

            // 新キャラ解放チェック
            const newCat = this.getNewlyUnlockedCat(currentIndex);
            if (newCat) {
                this.add.text(W / 2, H / 2 - 20, `NEW! 「${newCat.name}」が使えるようになった！`, {
                    fontSize: '20px', fontFamily: 'Arial', color: '#44FF44',
                    stroke: '#000000', strokeThickness: 3
                }).setOrigin(0.5).setScrollFactor(0).setDepth(501);

                // 新キャラアイコン
                const icon = this.add.circle(W / 2, H / 2 + 15, 16, newCat.color);
                icon.setScrollFactor(0).setDepth(501);
            }

            // 次へボタン
            const nextStageKey = isLastStage ? stageOrder[0] : stageOrder[currentIndex + 1];
            const btnLabel = isLastStage ? 'もう一度最初から' : '次のステージへ';

            const nextBtn = this.add.rectangle(W / 2, H / 2 + 60, 250, 50, 0x44AA44, 1);
            nextBtn.setScrollFactor(0).setDepth(501);
            nextBtn.setInteractive({ useHandCursor: true });

            this.add.text(W / 2, H / 2 + 60, btnLabel, {
                fontSize: '22px', fontFamily: 'Arial', color: '#FFFFFF'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

            nextBtn.on('pointerdown', () => {
                this.scene.start('prepare', { stageKey: nextStageKey });
            });
            nextBtn.on('pointerover', () => nextBtn.setFillStyle(0x55BB55));
            nextBtn.on('pointerout', () => nextBtn.setFillStyle(0x44AA44));
        } else {
            // 敗北
            this.add.text(W / 2, H / 2 - 60, '敗北...', {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: '#FF4444',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5).setScrollFactor(0).setDepth(501);

            this.add.text(W / 2, H / 2 - 5, 'ステージ1からやり直し', {
                fontSize: '20px', fontFamily: 'Arial', color: '#CCCCCC'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(501);

            const retryBtn = this.add.rectangle(W / 2, H / 2 + 60, 250, 50, 0x4488FF, 1);
            retryBtn.setScrollFactor(0).setDepth(501);
            retryBtn.setInteractive({ useHandCursor: true });

            this.add.text(W / 2, H / 2 + 60, 'ステージ1へ', {
                fontSize: '22px', fontFamily: 'Arial', color: '#FFFFFF'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(502);

            retryBtn.on('pointerdown', () => {
                this.scene.start('prepare', { stageKey: stageOrder[0] });
            });
            retryBtn.on('pointerover', () => retryBtn.setFillStyle(0x5599FF));
            retryBtn.on('pointerout', () => retryBtn.setFillStyle(0x4488FF));
        }
    }
};
