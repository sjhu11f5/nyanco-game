Game.Unit = class Unit {
    constructor(scene, faction, unitData, x, y) {
        this.scene = scene;
        this.faction = faction;
        this.data = unitData;
        this.maxHP = unitData.hp;
        this.currentHP = unitData.hp;
        this.x = x;
        this.y = y;
        this.state = 'walking'; // walking, attacking, dying, dead
        this.attackTimer = 0;
        this.target = null;
        this.dyingTimer = 0;

        // スプライト作成
        this.sprite = scene.add.sprite(x, y, unitData.spriteKey);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setDepth(5);

        // ボスは大きく表示
        const scale = unitData.scale || 1.0;
        this.sprite.setScale(scale);

        // 向き: プレイヤーは右向き、敵は左向き
        if (faction === 'enemy') {
            this.sprite.setFlipX(true);
        }

        // HPバー（ボスは大きめ）
        const barWidth = unitData.isBoss ? 60 : 36;
        const barInner = barWidth - 2;
        this.hpBarWidth = barInner;
        const barY = unitData.isBoss ? y - 110 : y - 65;
        this.hpBarBg = scene.add.rectangle(x, barY, barWidth, unitData.isBoss ? 6 : 4, 0x000000);
        this.hpBarBg.setDepth(10);
        this.hpBar = scene.add.rectangle(x, barY, barInner, unitData.isBoss ? 4 : 2, unitData.isBoss ? 0xFF4444 : 0x00FF00);
        this.hpBar.setDepth(11);
    }

    update(delta) {
        switch (this.state) {
            case 'walking':
                this.walk(delta);
                break;
            case 'attacking':
                this.attack(delta);
                break;
            case 'dying':
                this.dyingTimer += delta;
                if (this.sprite) {
                    this.sprite.setAlpha(1 - this.dyingTimer / 0.3);
                }
                if (this.dyingTimer >= 0.3) {
                    this.showSoulEffect();
                    this.state = 'dead';
                    this.destroy();
                }
                break;
        }

        // HPバー更新
        if (this.hpBar && this.state !== 'dead') {
            const pct = this.currentHP / this.maxHP;
            this.hpBar.width = this.hpBarWidth * pct;
            if (!this.data.isBoss) {
                this.hpBar.setFillStyle(pct > 0.5 ? 0x00FF00 : pct > 0.25 ? 0xFFFF00 : 0xFF0000);
            }
            const barOffsetY = this.data.isBoss ? -110 : -65;
            this.hpBarBg.setPosition(this.x, this.y + barOffsetY);
            this.hpBar.setPosition(this.x - (this.hpBarWidth * (1 - pct)) / 2, this.y + barOffsetY);
        }
    }

    walk(delta) {
        // moveTargetがあればそちらに向かう、なければデフォルト方向
        let dir = this.faction === 'player' ? 1 : -1;
        if (this.moveTarget != null) {
            const diff = this.moveTarget - this.x;
            if (Math.abs(diff) > 2) {
                dir = diff > 0 ? 1 : -1;
            }
        }
        this.x += this.data.speed * dir * delta;
        if (this.sprite) {
            this.sprite.setPosition(this.x, this.y);
            // 移動方向に応じて向きを変える
            this.sprite.setFlipX(dir < 0);
        }
    }

    attack(delta) {
        this.attackTimer -= delta;
        if (this.attackTimer <= 0) {
            // 攻撃実行
            if (this.target && this.target.currentHP > 0) {
                this.target.takeDamage(this.data.attack);

                // 攻撃エフェクト
                this.showAttackEffect();

                // ターゲットが死んだらwalking状態に戻る
                if (this.target.currentHP <= 0) {
                    this.target = null;
                    this.state = 'walking';
                    return;
                }
            } else {
                this.target = null;
                this.state = 'walking';
                return;
            }
            this.attackTimer = this.data.attackCooldown;
        }
    }

    showAttackEffect() {
        if (this.data.isProjectile && this.target) {
            // 砲弾が飛ぶ演出
            this.showProjectileEffect();
        } else {
            // 通常の近接攻撃エフェクト
            const effectX = this.faction === 'player' ? this.x + 20 : this.x - 20;
            const effect = this.scene.add.circle(effectX, this.y - 30, 8, 0xFFFFFF, 0.8);
            effect.setDepth(20);
            this.scene.tweens.add({
                targets: effect,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 200,
                onComplete: () => effect.destroy()
            });
        }
    }

    showProjectileEffect() {
        const targetX = this.target.x;
        const targetY = this.target.y ? this.target.y - 30 : this.y - 30;
        const startX = this.x + (this.faction === 'player' ? 25 : -25);
        const startY = this.y - 30;

        // 砲弾
        const bullet = this.scene.add.circle(startX, startY, 6, 0xFF6600, 1);
        bullet.setDepth(20);

        // 発射時のフラッシュ
        const flash = this.scene.add.circle(startX, startY, 12, 0xFFFF00, 0.9);
        flash.setDepth(21);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 150,
            onComplete: () => flash.destroy()
        });

        // 砲弾の飛行（放物線）
        const distance = Math.abs(targetX - startX);
        const duration = Math.min(400, distance * 1.2);
        const arcHeight = Math.min(60, distance * 0.15);

        this.scene.tweens.add({
            targets: bullet,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Linear',
            onUpdate: (tween) => {
                // 放物線の高さ
                const progress = tween.progress;
                const arc = Math.sin(progress * Math.PI) * arcHeight;
                bullet.y = startY + (targetY - startY) * progress - arc;
            },
            onComplete: () => {
                // 着弾エフェクト（爆発）
                bullet.destroy();
                const explosion = this.scene.add.circle(targetX, targetY, 5, 0xFF4400, 1);
                explosion.setDepth(21);
                this.scene.tweens.add({
                    targets: explosion,
                    scaleX: 4,
                    scaleY: 4,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => explosion.destroy()
                });
            }
        });
    }

    showSoulEffect() {
        const sx = this.x;
        const sy = this.y - 30;
        const scene = this.scene;

        // 外側のグロー（大きい光）
        const glow = scene.add.circle(sx, sy, 28, 0x7777FF, 0.25);
        glow.setDepth(24);

        // 魂本体
        const soul = scene.add.circle(sx, sy, 16, 0xDDDDFF, 0.95);
        soul.setDepth(25);

        // 内側の光
        const inner = scene.add.circle(sx, sy, 8, 0xFFFFFF, 1);
        inner.setDepth(26);

        // しっぽ（3段）
        const tail1 = scene.add.ellipse(sx, sy + 14, 14, 10, 0xCCCCFF, 0.7);
        tail1.setDepth(24);
        const tail2 = scene.add.ellipse(sx, sy + 26, 10, 8, 0xBBBBFF, 0.5);
        tail2.setDepth(24);
        const tail3 = scene.add.ellipse(sx, sy + 36, 6, 6, 0xAAAAFF, 0.3);
        tail3.setDepth(24);

        const allParts = [glow, soul, inner, tail1, tail2, tail3];
        const driftX = Phaser.Math.Between(-15, 15);

        scene.tweens.add({
            targets: allParts,
            duration: 2500,
            onUpdate: (tween) => {
                const p = tween.progress;
                const rise = p * 200;
                const sway = Math.sin(p * Math.PI * 5) * 15;
                const baseX = sx + driftX * p + sway;
                const baseY = sy - rise;

                soul.setPosition(baseX, baseY);
                glow.setPosition(baseX, baseY);
                inner.setPosition(baseX, baseY);
                tail1.setPosition(baseX, baseY + 14);
                tail2.setPosition(baseX, baseY + 26);
                tail3.setPosition(baseX, baseY + 36);

                // 後半でフェードアウト
                const alpha = p < 0.5 ? 1 : 1 - (p - 0.5) / 0.5;
                soul.setAlpha(0.95 * alpha);
                glow.setAlpha(0.25 * alpha);
                inner.setAlpha(1 * alpha);
                tail1.setAlpha(0.7 * alpha);
                tail2.setAlpha(0.5 * alpha);
                tail3.setAlpha(0.3 * alpha);

                // 脈動
                const pulse = 1 + Math.sin(p * Math.PI * 8) * 0.25;
                glow.setScale(pulse);
            },
            onComplete: () => {
                allParts.forEach(p => p.destroy());
            }
        });
    }

    takeDamage(amount) {
        this.currentHP -= amount;
        // ダメージ時に少し赤くする
        if (this.sprite) {
            this.sprite.setTint(0xFF0000);
            this.scene.time.delayedCall(100, () => {
                if (this.sprite) this.sprite.clearTint();
            });
        }
        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.state = 'dying';
            this.dyingTimer = 0;
        }
    }

    isInRange(otherX) {
        return Math.abs(this.x - otherX) <= this.data.attackRange;
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
        if (this.hpBar) {
            this.hpBar.destroy();
            this.hpBar = null;
        }
        if (this.hpBarBg) {
            this.hpBarBg.destroy();
            this.hpBarBg = null;
        }
    }
};
