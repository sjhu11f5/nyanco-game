Game.Base = class Base {
    constructor(scene, faction, hp, x, y) {
        this.scene = scene;
        this.faction = faction;
        this.maxHP = hp;
        this.currentHP = hp;
        this.x = x;
        this.y = y;

        // 拠点スプライト作成
        const color = faction === 'player' ? 0x4488FF : 0xFF4444;
        const g = scene.make.graphics({ add: false });
        // 城の形
        g.fillStyle(color, 1);
        g.fillRect(0, 20, 80, 100);
        // 城壁の凹凸
        g.fillRect(0, 0, 20, 30);
        g.fillRect(30, 0, 20, 30);
        g.fillRect(60, 0, 20, 30);
        // ドア
        g.fillStyle(0x222222, 1);
        g.fillRect(28, 70, 24, 50);
        const key = faction + '_base_tex';
        g.generateTexture(key, 80, 120);
        g.destroy();

        this.sprite = scene.add.sprite(x, y, key);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setDepth(1);
    }

    takeDamage(amount) {
        this.currentHP = Math.max(0, this.currentHP - amount);
    }

    isDestroyed() {
        return this.currentHP <= 0;
    }

    getHPPercent() {
        return this.currentHP / this.maxHP;
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
};
