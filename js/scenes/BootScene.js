Game.BootScene = class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'boot' });
    }

    create() {
        this.generatePlaceholderTextures();
        this.scene.start('prepare', { stageKey: 'stage1' });
    }

    generatePlaceholderTextures() {
        for (const key in Game.UnitData.cats) {
            const cat = Game.UnitData.cats[key];
            this.createCatTexture(cat);
        }
        for (const key in Game.UnitData.enemies) {
            const enemy = Game.UnitData.enemies[key];
            if (enemy.isBoss) {
                this.createBossTexture(enemy.spriteKey, enemy.color);
            } else {
                this.createEnemyTexture(enemy.spriteKey, enemy.color);
            }
        }
    }

    // ネコの基本パーツ
    drawCatBase(g, color, w, h) {
        g.fillStyle(color, 1);
        g.fillRoundedRect(4, 12, w - 8, h - 16, 6);
        // 耳
        g.fillTriangle(6, 16, 14, 2, 18, 16);
        g.fillTriangle(18, 16, 22, 2, 30, 16);
        // 目
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(13, 22, 5);
        g.fillCircle(23, 22, 5);
        g.fillStyle(0x000000, 1);
        g.fillCircle(14, 22, 3);
        g.fillCircle(24, 22, 3);
    }

    createCatTexture(cat) {
        const fn = this['tex_' + cat.key];
        if (fn) {
            fn.call(this, cat.spriteKey, cat.color);
        } else {
            // デフォルト
            const g = this.make.graphics({ add: false });
            this.drawCatBase(g, cat.color, 36, 50);
            g.generateTexture(cat.spriteKey, 36, 50);
            g.destroy();
        }
    }

    // === ネコ（基本）===
    tex_basic(key, color) {
        const g = this.make.graphics({ add: false });
        this.drawCatBase(g, color, 36, 50);
        // 口（にっこり）
        g.lineStyle(1, 0x000000, 1);
        g.beginPath();
        g.arc(18, 28, 5, 0.2, Math.PI - 0.2);
        g.strokePath();
        g.generateTexture(key, 36, 50);
        g.destroy();
    }

    // === タンクネコ（ヘルメット＋分厚い体）===
    tex_tank(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 40, h = 50;
        // 体（太め）
        g.fillStyle(color, 1);
        g.fillRoundedRect(2, 14, w - 4, h - 16, 8);
        // 耳
        g.fillTriangle(6, 18, 14, 4, 18, 18);
        g.fillTriangle(22, 18, 26, 4, 34, 18);
        // ヘルメット
        g.fillStyle(0x666688, 1);
        g.fillRoundedRect(4, 8, w - 8, 14, 5);
        // ヘルメットのライン
        g.fillStyle(0x8888AA, 1);
        g.fillRect(8, 14, w - 16, 3);
        // 目（小さめ）
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(14, 24, 4);
        g.fillCircle(26, 24, 4);
        g.fillStyle(0x000000, 1);
        g.fillCircle(15, 24, 2);
        g.fillCircle(27, 24, 2);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === キモネコ（長い腕）===
    tex_axe(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 40, h = 50;
        g.fillStyle(color, 1);
        g.fillRoundedRect(6, 12, 24, h - 16, 6);
        // 耳
        g.fillTriangle(8, 16, 16, 2, 20, 16);
        g.fillTriangle(20, 16, 24, 2, 28, 16);
        // 長い腕
        g.fillStyle(color, 1);
        g.fillRect(30, 20, 10, 4);
        g.fillRect(0, 22, 8, 4);
        // 手
        g.fillCircle(38, 22, 3);
        g.fillCircle(2, 24, 3);
        // 目（ぎょろ目）
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(14, 22, 5);
        g.fillCircle(24, 22, 5);
        g.fillStyle(0x000000, 1);
        g.fillCircle(16, 22, 3);
        g.fillCircle(26, 22, 3);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === ウシネコ（角＋太め）===
    tex_cow(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 38, h = 50;
        g.fillStyle(color, 1);
        g.fillRoundedRect(3, 14, w - 6, h - 18, 7);
        // 耳
        g.fillTriangle(6, 18, 12, 6, 16, 18);
        g.fillTriangle(22, 18, 26, 6, 32, 18);
        // 角（短い）
        g.fillStyle(0xDDDDBB, 1);
        g.fillTriangle(8, 12, 11, 0, 14, 12);
        g.fillTriangle(24, 12, 27, 0, 30, 12);
        // 目
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(13, 24, 4);
        g.fillCircle(25, 24, 4);
        g.fillStyle(0x000000, 1);
        g.fillCircle(14, 24, 2);
        g.fillCircle(26, 24, 2);
        // 鼻（牛っぽい）
        g.fillStyle(0xDDAA66, 1);
        g.fillCircle(19, 30, 5);
        g.fillStyle(0x000000, 1);
        g.fillCircle(17, 30, 1);
        g.fillCircle(21, 30, 1);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === ニンジャネコ（頭巾＋手裏剣）===
    tex_ninja(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 36, h = 50;
        g.fillStyle(color, 1);
        g.fillRoundedRect(4, 12, w - 8, h - 16, 6);
        // 耳
        g.fillTriangle(6, 16, 14, 2, 18, 16);
        g.fillTriangle(18, 16, 22, 2, 30, 16);
        // 頭巾
        g.fillStyle(0x111155, 1);
        g.fillRect(4, 14, w - 8, 10);
        // 目（鋭い）
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(10, 18, 7, 4);
        g.fillRect(20, 18, 7, 4);
        g.fillStyle(0x000000, 1);
        g.fillCircle(15, 20, 2);
        g.fillCircle(25, 20, 2);
        // マフラー
        g.fillStyle(0x111155, 1);
        g.fillTriangle(4, 18, 0, 30, 4, 26);
        // 手裏剣（手に持つ）
        g.lineStyle(2, 0xCCCCCC, 1);
        g.lineBetween(30, 32, 36, 26);
        g.lineBetween(30, 26, 36, 32);
        g.lineBetween(30, 29, 36, 29);
        g.lineBetween(33, 26, 33, 32);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === トリネコ（翼つき）===
    tex_bird(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 44, h = 50;
        g.fillStyle(color, 1);
        g.fillRoundedRect(10, 12, 24, h - 16, 6);
        // 耳
        g.fillTriangle(12, 16, 20, 2, 24, 16);
        g.fillTriangle(24, 16, 28, 2, 32, 16);
        // 翼（左）
        g.fillStyle(0x66DDDD, 1);
        g.fillTriangle(10, 22, 0, 14, 4, 30);
        g.fillTriangle(10, 26, 0, 20, 2, 34);
        // 翼（右）
        g.fillTriangle(34, 22, 44, 14, 40, 30);
        g.fillTriangle(34, 26, 44, 20, 42, 34);
        // 目
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(18, 22, 4);
        g.fillCircle(28, 22, 4);
        g.fillStyle(0x000000, 1);
        g.fillCircle(19, 22, 2);
        g.fillCircle(29, 22, 2);
        // くちばし
        g.fillStyle(0xFFAA00, 1);
        g.fillTriangle(20, 28, 24, 28, 22, 34);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === ドラゴンネコ（翼＋ツノ＋炎）===
    tex_dragon(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 44, h = 54;
        g.fillStyle(color, 1);
        g.fillRoundedRect(10, 16, 24, h - 20, 6);
        // 耳
        g.fillTriangle(12, 20, 20, 6, 24, 20);
        g.fillTriangle(24, 20, 28, 6, 32, 20);
        // 角
        g.fillStyle(0xFFDD00, 1);
        g.fillTriangle(14, 14, 18, 0, 22, 14);
        g.fillTriangle(26, 14, 30, 2, 32, 14);
        // 翼（小さめ）
        g.fillStyle(0xCC33CC, 1);
        g.fillTriangle(10, 24, 0, 18, 6, 34);
        g.fillTriangle(34, 24, 44, 18, 38, 34);
        // 目
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(19, 26, 4);
        g.fillCircle(29, 26, 4);
        g.fillStyle(0xFF0000, 1);
        g.fillCircle(20, 26, 2);
        g.fillCircle(30, 26, 2);
        // 口から炎
        g.fillStyle(0xFF4400, 0.8);
        g.fillTriangle(22, 36, 18, 44, 26, 44);
        g.fillStyle(0xFFAA00, 0.6);
        g.fillTriangle(22, 38, 20, 42, 24, 42);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === キャノンネコ（大砲に乗る）===
    tex_cannon(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 44, h = 50;
        // 台座
        g.fillStyle(0x555555, 1);
        g.fillRect(6, 32, 32, 18);
        // 車輪
        g.fillStyle(0x333333, 1);
        g.fillCircle(14, 46, 6);
        g.fillCircle(30, 46, 6);
        // 砲身
        g.fillStyle(color, 1);
        g.fillRect(16, 10, 24, 14);
        g.fillTriangle(40, 8, 44, 17, 40, 24);
        // 砲口
        g.fillStyle(0x222222, 1);
        g.fillCircle(42, 17, 4);
        // ネコ操縦者
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(12, 22, 8);
        g.fillTriangle(5, 18, 8, 10, 12, 16);
        g.fillTriangle(12, 16, 16, 10, 19, 18);
        g.fillStyle(0x000000, 1);
        g.fillCircle(10, 21, 2);
        g.fillCircle(15, 21, 2);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === サムライネコ（刀＋鎧）===
    tex_samurai(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 42, h = 50;
        g.fillStyle(color, 1);
        g.fillRoundedRect(6, 12, 26, h - 16, 6);
        // 耳
        g.fillTriangle(8, 16, 16, 2, 20, 16);
        g.fillTriangle(20, 16, 24, 2, 30, 16);
        // 兜（月の飾り）
        g.fillStyle(0xCCAA00, 1);
        g.fillRoundedRect(6, 10, 26, 8, 3);
        g.fillTriangle(16, 10, 19, 0, 22, 10);
        // 目
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(15, 22, 4);
        g.fillCircle(25, 22, 4);
        g.fillStyle(0x000000, 1);
        g.fillCircle(16, 22, 2);
        g.fillCircle(26, 22, 2);
        // 刀
        g.fillStyle(0xCCCCCC, 1);
        g.fillRect(34, 8, 3, 30);
        g.fillStyle(0x886622, 1);
        g.fillRect(33, 36, 5, 6);
        // 刀の光
        g.fillStyle(0xFFFFFF, 0.5);
        g.fillRect(35, 10, 1, 24);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === マホウネコ（杖＋帽子）===
    tex_wizard(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 40, h = 54;
        g.fillStyle(color, 1);
        g.fillRoundedRect(6, 20, 24, h - 24, 6);
        // 耳
        g.fillTriangle(8, 24, 14, 14, 18, 24);
        g.fillTriangle(22, 24, 26, 14, 30, 24);
        // 魔法帽子
        g.fillStyle(0x6622AA, 1);
        g.fillTriangle(6, 22, 18, 0, 30, 22);
        g.fillRect(2, 20, 32, 5);
        // 帽子の星
        g.fillStyle(0xFFFF00, 1);
        g.fillCircle(20, 10, 3);
        // 目
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(14, 30, 4);
        g.fillCircle(24, 30, 4);
        g.fillStyle(0x000000, 1);
        g.fillCircle(15, 30, 2);
        g.fillCircle(25, 30, 2);
        // 杖
        g.fillStyle(0x885522, 1);
        g.fillRect(34, 12, 3, 36);
        g.fillStyle(0xFF88FF, 1);
        g.fillCircle(35, 10, 5);
        g.fillStyle(0xFFBBFF, 1);
        g.fillCircle(35, 10, 3);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === テンシネコ（天使の輪＋翼）===
    tex_angel(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 44, h = 50;
        g.fillStyle(color, 1);
        g.fillRoundedRect(10, 14, 24, h - 18, 6);
        // 耳
        g.fillTriangle(12, 18, 18, 6, 22, 18);
        g.fillTriangle(24, 18, 28, 6, 32, 18);
        // 天使の輪
        g.lineStyle(2, 0xFFFF44, 1);
        g.beginPath();
        g.arc(22, 8, 8, 0, Math.PI * 2);
        g.strokePath();
        // 白い翼
        g.fillStyle(0xFFFFFF, 0.9);
        g.fillTriangle(10, 22, 0, 12, 4, 32);
        g.fillTriangle(10, 20, 2, 10, 6, 28);
        g.fillTriangle(34, 22, 44, 12, 40, 32);
        g.fillTriangle(34, 20, 42, 10, 38, 28);
        // 目
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(18, 24, 4);
        g.fillCircle(28, 24, 4);
        g.fillStyle(0x4488FF, 1);
        g.fillCircle(19, 24, 2);
        g.fillCircle(29, 24, 2);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === アクマネコ（悪魔の角＋尻尾＋砲撃型）===
    tex_devil(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 44, h = 50;
        // 台座（砲撃型）
        g.fillStyle(0x333333, 1);
        g.fillRect(8, 34, 28, 16);
        g.fillCircle(16, 46, 5);
        g.fillCircle(28, 46, 5);
        // 砲身
        g.fillStyle(0x440044, 1);
        g.fillRect(18, 12, 22, 12);
        g.fillTriangle(40, 10, 44, 18, 40, 24);
        g.fillStyle(0x220022, 1);
        g.fillCircle(42, 18, 3);
        // ネコ操縦者
        g.fillStyle(color, 1);
        g.fillCircle(14, 22, 10);
        // 角
        g.fillStyle(0xFF4444, 1);
        g.fillTriangle(6, 16, 8, 4, 12, 16);
        g.fillTriangle(16, 16, 20, 4, 22, 16);
        // 目
        g.fillStyle(0xFFFF00, 1);
        g.fillCircle(11, 22, 3);
        g.fillCircle(17, 22, 3);
        g.fillStyle(0x000000, 1);
        g.fillCircle(12, 22, 1.5);
        g.fillCircle(18, 22, 1.5);
        // 尻尾
        g.lineStyle(2, color, 1);
        g.lineBetween(4, 30, 0, 36);
        g.lineBetween(0, 36, 2, 32);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === スライムネコ（丸くてぷるぷる）===
    tex_slime(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 32, h = 40;
        // ぷるぷるの体
        g.fillStyle(color, 0.8);
        g.fillCircle(16, 24, 14);
        g.fillStyle(color, 0.5);
        g.fillCircle(16, 20, 10);
        // 小さい耳
        g.fillStyle(color, 1);
        g.fillTriangle(8, 14, 12, 6, 14, 14);
        g.fillTriangle(18, 14, 20, 6, 24, 14);
        // 目（つぶらな瞳）
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(12, 20, 4);
        g.fillCircle(20, 20, 4);
        g.fillStyle(0x000000, 1);
        g.fillCircle(13, 20, 2);
        g.fillCircle(21, 20, 2);
        // ハイライト
        g.fillStyle(0xFFFFFF, 0.4);
        g.fillCircle(10, 16, 3);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === ナイトネコ（鎧＋盾＋剣）===
    tex_knight(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 42, h = 50;
        // 鎧ボディ
        g.fillStyle(color, 1);
        g.fillRoundedRect(8, 14, 24, h - 18, 6);
        // 耳
        g.fillTriangle(10, 18, 16, 6, 20, 18);
        g.fillTriangle(22, 18, 26, 6, 30, 18);
        // ヘルメット（バイザー付き）
        g.fillStyle(0x888844, 1);
        g.fillRoundedRect(8, 10, 24, 12, 4);
        g.fillStyle(0xAAAA66, 1);
        g.fillRect(10, 16, 20, 3);
        // 目のスリット
        g.fillStyle(0x000000, 1);
        g.fillRect(14, 17, 5, 2);
        g.fillRect(22, 17, 5, 2);
        // 盾（左手）
        g.fillStyle(0x886622, 1);
        g.fillRoundedRect(0, 20, 10, 16, 3);
        g.fillStyle(0xBB8833, 1);
        g.fillCircle(5, 26, 3);
        // 剣（右手）
        g.fillStyle(0xCCCCCC, 1);
        g.fillRect(36, 10, 3, 26);
        g.fillStyle(0x886622, 1);
        g.fillRect(34, 34, 7, 5);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === ヒーラーネコ（ナース帽＋十字）===
    tex_healer(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 36, h = 50;
        g.fillStyle(color, 1);
        g.fillRoundedRect(4, 14, w - 8, h - 18, 6);
        // 耳
        g.fillTriangle(6, 18, 12, 6, 16, 18);
        g.fillTriangle(20, 18, 24, 6, 30, 18);
        // ナース帽
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(6, 10, 24, 8);
        g.fillStyle(0xFF4444, 1);
        g.fillRect(16, 11, 4, 6);
        g.fillRect(14, 13, 8, 2);
        // 目（やさしい）
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(13, 24, 4);
        g.fillCircle(23, 24, 4);
        g.fillStyle(0x22AA22, 1);
        g.fillCircle(14, 24, 2);
        g.fillCircle(24, 24, 2);
        // 注射器（手に持つ）
        g.fillStyle(0xCCCCCC, 1);
        g.fillRect(30, 28, 3, 14);
        g.fillStyle(0x88DDFF, 1);
        g.fillRect(30, 32, 3, 6);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === タイタンネコ（巨大、筋肉）===
    tex_titan(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 44, h = 54;
        // 太い体
        g.fillStyle(color, 1);
        g.fillRoundedRect(4, 14, w - 8, h - 18, 10);
        // 耳
        g.fillTriangle(8, 18, 16, 4, 20, 18);
        g.fillTriangle(24, 18, 28, 4, 36, 18);
        // 目（怒り）
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(16, 24, 5);
        g.fillCircle(28, 24, 5);
        g.fillStyle(0x000000, 1);
        g.fillCircle(17, 24, 3);
        g.fillCircle(29, 24, 3);
        // 怒り眉毛
        g.lineStyle(2, 0x000000, 1);
        g.lineBetween(10, 18, 20, 20);
        g.lineBetween(34, 18, 24, 20);
        // 筋肉ライン
        g.lineStyle(2, 0xAA5500, 0.5);
        g.lineBetween(14, 32, 14, 42);
        g.lineBetween(30, 32, 30, 42);
        // 腕（太い）
        g.fillStyle(color, 1);
        g.fillRect(0, 26, 6, 16);
        g.fillRect(w - 6, 26, 6, 16);
        g.fillCircle(3, 28, 5);
        g.fillCircle(w - 3, 28, 5);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === ゴーストネコ（半透明、浮遊）===
    tex_ghost(key, color) {
        const g = this.make.graphics({ add: false });
        const w = 36, h = 50;
        // 体（波打つ下部）
        g.fillStyle(color, 0.6);
        g.fillRoundedRect(4, 10, w - 8, 30, 8);
        // 下部の波
        g.fillTriangle(4, 36, 10, 46, 16, 36);
        g.fillTriangle(14, 36, 20, 48, 26, 36);
        g.fillTriangle(24, 36, 28, 44, 32, 36);
        // 耳（薄い）
        g.fillStyle(color, 0.5);
        g.fillTriangle(8, 14, 14, 2, 18, 14);
        g.fillTriangle(18, 14, 22, 2, 28, 14);
        // 目（光る）
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(13, 20, 5);
        g.fillCircle(23, 20, 5);
        g.fillStyle(0x6666FF, 1);
        g.fillCircle(14, 20, 3);
        g.fillCircle(24, 20, 3);
        // 口（おー）
        g.fillStyle(0x000000, 0.5);
        g.fillCircle(18, 30, 3);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // === 敵ユニット ===
    createEnemyTexture(spriteKey, color) {
        const g = this.make.graphics({ add: false });
        const w = 36, h = 50;
        g.fillStyle(color, 1);
        g.fillRoundedRect(4, 10, w - 8, h - 14, 6);
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(13, 20, 6);
        g.fillCircle(23, 20, 6);
        g.fillStyle(0xFF0000, 1);
        g.fillCircle(14, 20, 3);
        g.fillCircle(24, 20, 3);
        g.generateTexture(spriteKey, w, h);
        g.destroy();
    }

    // === ボス ===
    createBossTexture(spriteKey, color) {
        const g = this.make.graphics({ add: false });
        const w = 70, h = 90;
        g.fillStyle(color, 1);
        g.fillRoundedRect(8, 20, w - 16, h - 24, 10);
        g.fillStyle(0xAA0000, 1);
        g.fillRect(14, 50, w - 28, 6);
        g.fillRect(14, 62, w - 28, 6);
        g.fillStyle(0xFFCC00, 1);
        g.fillTriangle(15, 24, 22, 0, 28, 24);
        g.fillTriangle(42, 24, 48, 0, 55, 24);
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(24, 38, 10);
        g.fillCircle(46, 38, 10);
        g.fillStyle(0xFF0000, 1);
        g.fillCircle(26, 38, 6);
        g.fillCircle(48, 38, 6);
        g.fillStyle(0x000000, 1);
        g.fillCircle(27, 38, 3);
        g.fillCircle(49, 38, 3);
        g.lineStyle(3, 0x000000, 1);
        g.lineBetween(14, 26, 28, 30);
        g.lineBetween(56, 26, 42, 30);
        g.fillStyle(0x220000, 1);
        g.fillRect(20, 52, 30, 10);
        g.fillStyle(0xFFFFFF, 1);
        g.fillTriangle(24, 52, 28, 46, 32, 52);
        g.fillTriangle(38, 52, 42, 46, 46, 52);
        g.generateTexture(spriteKey, w, h);
        g.destroy();
    }
};
