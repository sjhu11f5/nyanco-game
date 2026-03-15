Game.HUD = class HUD {
    constructor(scene, moneySystem, spawnSystem, playerBase, enemyBase) {
        this.scene = scene;
        this.moneySystem = moneySystem;
        this.spawnSystem = spawnSystem;
        this.playerBase = playerBase;
        this.enemyBase = enemyBase;
        this.buttons = [];
        this.currentPage = 0;
        this.catsPerPage = 5;

        this.createUI();
    }

    createUI() {
        const scene = this.scene;
        const W = Game.CONFIG.width;
        const H = Game.CONFIG.height;
        this.panelH = 110;
        const panelH = this.panelH;

        // 下部パネル背景
        this.panel = scene.add.rectangle(W / 2, H - panelH / 2, W, panelH, 0x333333, 0.85);
        this.panel.setScrollFactor(0).setDepth(100);

        // === 左側エリア ===
        this.moneyText = scene.add.text(10, H - panelH + 6, '', {
            fontSize: '20px', fontFamily: 'Arial', color: '#FFD700', fontStyle: 'bold'
        }).setScrollFactor(0).setDepth(101);

        this.incomeText = scene.add.text(10, H - panelH + 30, '', {
            fontSize: '12px', fontFamily: 'Arial', color: '#AAAAAA'
        }).setScrollFactor(0).setDepth(101);

        // 収入アップボタン
        this.incomeUpBtn = scene.add.rectangle(75, H - panelH + 55, 130, 22, 0x336633, 1);
        this.incomeUpBtn.setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
        this.incomeUpText = scene.add.text(75, H - panelH + 55, '', {
            fontSize: '11px', fontFamily: 'Arial', color: '#FFFFFF', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(102);
        this.incomeUpBtn.on('pointerdown', () => { this.moneySystem.upgradeIncome(); });

        // 大砲発射ボタン
        this.cannonBtn = scene.add.rectangle(75, H - panelH + 85, 130, 28, 0x664400, 1);
        this.cannonBtn.setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
        this.cannonBtnText = scene.add.text(75, H - panelH + 80, '', {
            fontSize: '12px', fontFamily: 'Arial', color: '#FFFFFF', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(102);
        this.cannonLabel = scene.add.text(75, H - panelH + 92, '', {
            fontSize: '10px', fontFamily: 'Arial', color: '#FFAA44'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(102);
        this.cannonBtn.on('pointerdown', () => { scene.tryFireBaseCannon(); });

        // === ページ切り替えボタン（テキストで矢印） ===
        const pageY = H - panelH / 2;

        this.prevPageBtn = scene.add.text(152, pageY, '<', {
            fontSize: '28px', fontFamily: 'Arial', color: '#AAAAAA', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(104).setInteractive({ useHandCursor: true });
        this.prevPageBtn.on('pointerdown', () => { this.changePage(-1); });

        this.nextPageBtn = scene.add.text(W - 10, pageY, '>', {
            fontSize: '28px', fontFamily: 'Arial', color: '#AAAAAA', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(104).setInteractive({ useHandCursor: true });
        this.nextPageBtn.on('pointerdown', () => { this.changePage(1); });

        this.pageText = scene.add.text(W / 2 + 80, H - panelH + 2, '', {
            fontSize: '11px', fontFamily: 'Arial', color: '#888888'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

        // ネコボタン生成
        this.buildCatButtons();

        // === 上部: HPバー ===
        this.playerHPLabel = scene.add.text(10, 10, '自軍拠点', {
            fontSize: '14px', fontFamily: 'Arial', color: '#FFFFFF'
        }).setScrollFactor(0).setDepth(101);
        this.playerHPBg = scene.add.rectangle(110, 18, 200, 14, 0x333333);
        this.playerHPBg.setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);
        this.playerHPBar = scene.add.rectangle(110, 18, 200, 12, 0x44AA44);
        this.playerHPBar.setOrigin(0, 0.5).setScrollFactor(0).setDepth(102);

        this.enemyHPLabel = scene.add.text(W - 320, 10, '敵拠点', {
            fontSize: '14px', fontFamily: 'Arial', color: '#FFFFFF'
        }).setScrollFactor(0).setDepth(101);
        this.enemyHPBg = scene.add.rectangle(W - 240, 18, 200, 14, 0x333333);
        this.enemyHPBg.setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);
        this.enemyHPBar = scene.add.rectangle(W - 240, 18, 200, 12, 0xDD4444);
        this.enemyHPBar.setOrigin(0, 0.5).setScrollFactor(0).setDepth(102);
    }

    buildCatButtons() {
        const scene = this.scene;
        const W = Game.CONFIG.width;
        const H = Game.CONFIG.height;
        const panelH = this.panelH;

        // 既存ボタン削除
        for (const btn of this.buttons) {
            btn.bg.destroy();
            btn.icon.destroy();
            btn.nameText.destroy();
            btn.costText.destroy();
            btn.cooldownOverlay.destroy();
        }
        this.buttons = [];

        // 選択されたキャラのみ（選択情報があれば使う、なければ全解放キャラ）
        this.unlockedKeys = scene.selectedCats || Game.progress.getUnlockedCatKeys();
        this.totalPages = Math.max(1, Math.ceil(this.unlockedKeys.length / this.catsPerPage));
        if (this.currentPage >= this.totalPages) this.currentPage = 0;

        const startIdx = this.currentPage * this.catsPerPage;
        const pageKeys = this.unlockedKeys.slice(startIdx, startIdx + this.catsPerPage);

        if (pageKeys.length === 0) return;

        const btnStartX = 170;
        const btnEndX = W - 25;
        const btnGap = 5;
        const count = pageKeys.length;
        const btnWidth = Math.floor((btnEndX - btnStartX - btnGap * (count - 1)) / count);
        const btnH = panelH - 10;

        pageKeys.forEach((key, i) => {
            const catData = Game.UnitData.cats[key];
            const bx = btnStartX + i * (btnWidth + btnGap) + btnWidth / 2;
            const by = H - panelH / 2;

            const bg = scene.add.rectangle(bx, by, btnWidth, btnH, 0x555555, 1);
            bg.setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });

            const icon = scene.add.circle(bx, by - 20, Math.min(13, btnWidth / 5), catData.color);
            icon.setScrollFactor(0).setDepth(102);

            const nameText = scene.add.text(bx, by + 5, catData.name, {
                fontSize: '10px', fontFamily: 'Arial', color: '#FFFFFF'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(102);

            const costText = scene.add.text(bx, by + 20, '$' + catData.cost, {
                fontSize: '11px', fontFamily: 'Arial', color: '#FFD700'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(102);

            const cooldownOverlay = scene.add.rectangle(bx, by + btnH / 2, btnWidth, 0, 0x000000, 0.6);
            cooldownOverlay.setScrollFactor(0).setDepth(103).setOrigin(0.5, 1);

            bg.on('pointerdown', () => {
                if (this.spawnSystem.canSpawn(key)) {
                    scene.spawnPlayerUnit(key);
                }
            });

            this.buttons.push({ key: key, bg: bg, icon: icon, nameText: nameText, costText: costText, cooldownOverlay: cooldownOverlay, maxH: btnH });
        });
    }

    changePage(dir) {
        this.currentPage += dir;
        if (this.currentPage < 0) this.currentPage = this.totalPages - 1;
        if (this.currentPage >= this.totalPages) this.currentPage = 0;
        this.buildCatButtons();
    }

    update() {
        this.moneyText.setText('$ ' + this.moneySystem.getMoney());
        this.incomeText.setText('+' + Math.floor(this.moneySystem.incomeRate) + '/秒 (Lv.' + this.moneySystem.incomeLevel + ')');

        // 収入アップ
        this.incomeUpText.setText('収入UP Lv.' + (this.moneySystem.incomeLevel + 1) + '  $' + this.moneySystem.upgradeCost);
        this.incomeUpBtn.setFillStyle(this.moneySystem.canUpgradeIncome() ? 0x338833 : 0x333333);

        // ネコボタン
        for (var i = 0; i < this.buttons.length; i++) {
            var btn = this.buttons[i];
            var canSpawn = this.spawnSystem.canSpawn(btn.key);
            var cooldownPct = this.spawnSystem.getCooldownPercent(btn.key);
            var canAfford = this.moneySystem.canAfford(Game.UnitData.cats[btn.key].cost);
            btn.cooldownOverlay.height = btn.maxH * cooldownPct;
            if (!canAfford && cooldownPct <= 0) {
                btn.bg.setFillStyle(0x443333, 1);
            } else if (canSpawn) {
                btn.bg.setFillStyle(0x556655, 1);
            } else {
                btn.bg.setFillStyle(0x555555, 1);
            }
        }

        // 大砲
        var cannon = this.scene.baseCannon;
        if (cannon.timer <= 0) {
            this.cannonLabel.setText('READY!');
            this.cannonBtn.setFillStyle(0xAA4400);
            this.cannonBtnText.setText('大砲発射!');
        } else {
            this.cannonLabel.setText(Math.ceil(cannon.timer) + '秒');
            this.cannonBtn.setFillStyle(0x443322);
            this.cannonBtnText.setText('チャージ中');
        }

        // ページ表示
        this.pageText.setText('' + (this.currentPage + 1) + '/' + this.totalPages);
        this.prevPageBtn.setAlpha(this.totalPages > 1 ? 1 : 0.3);
        this.nextPageBtn.setAlpha(this.totalPages > 1 ? 1 : 0.3);

        // HPバー
        this.playerHPBar.width = 200 * this.playerBase.getHPPercent();
        this.enemyHPBar.width = 200 * this.enemyBase.getHPPercent();
    }

    destroy() {
        var items = [
            this.panel, this.moneyText, this.incomeText,
            this.incomeUpBtn, this.incomeUpText,
            this.cannonBtn, this.cannonBtnText, this.cannonLabel,
            this.prevPageBtn, this.nextPageBtn, this.pageText,
            this.playerHPLabel, this.playerHPBg, this.playerHPBar,
            this.enemyHPLabel, this.enemyHPBg, this.enemyHPBar
        ];
        for (var i = 0; i < items.length; i++) {
            if (items[i]) items[i].destroy();
        }
        for (var j = 0; j < this.buttons.length; j++) {
            var btn = this.buttons[j];
            btn.bg.destroy();
            btn.icon.destroy();
            btn.nameText.destroy();
            btn.costText.destroy();
            btn.cooldownOverlay.destroy();
        }
    }
};
