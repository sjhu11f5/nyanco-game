Game.PrepareScene = class PrepareScene extends Phaser.Scene {
    constructor() {
        super({ key: 'prepare' });
    }

    init(data) {
        this.stageKey = data.stageKey || 'stage1';
    }

    create() {
        var W = Game.CONFIG.width;
        var H = Game.CONFIG.height;
        var stage = Game.StageData[this.stageKey];
        var self = this;
        this.maxSlots = 5;

        // 背景
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // タイトル
        this.add.text(W / 2, 18, stage.name + '  -  出撃メンバーを選択（最大' + this.maxSlots + '体）', {
            fontSize: '16px', fontFamily: 'Arial', color: '#FFFFFF',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        // 解放済みキャラ一覧
        this.unlockedKeys = Game.progress.getUnlockedCatKeys();
        this.selectedKeys = [];

        // ページ管理
        this.catsPerPage = 8; // 4列x2行
        this.currentPage = 0;
        this.totalPages = Math.max(1, Math.ceil(this.unlockedKeys.length / this.catsPerPage));

        // カード配置エリア
        this.cols = 4;
        this.cardW = 110;
        this.cardH = 90;
        this.gapX = 10;
        this.gapY = 6;
        this.startY = 90;

        // カードコンテナ
        this.catCards = [];
        this.buildCards();

        // ページ切り替えボタン
        if (this.totalPages > 1) {
            this.prevBtn = this.add.text(40, 155, '<', {
                fontSize: '32px', fontFamily: 'Arial', color: '#AAAAAA', fontStyle: 'bold'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            this.prevBtn.on('pointerdown', function() { self.changePage(-1); });

            this.nextBtn = this.add.text(W - 40, 155, '>', {
                fontSize: '32px', fontFamily: 'Arial', color: '#AAAAAA', fontStyle: 'bold'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            this.nextBtn.on('pointerdown', function() { self.changePage(1); });

            this.pageText = this.add.text(W / 2, 290, '', {
                fontSize: '12px', fontFamily: 'Arial', color: '#888888'
            }).setOrigin(0.5);
            this.updatePageText();
        }

        // --- 下部エリア（固定）---

        // 選択スロット
        this.add.text(W / 2, 340, '出撃メンバー', {
            fontSize: '14px', fontFamily: 'Arial', color: '#FFD700'
        }).setOrigin(0.5);

        this.slotIcons = [];
        for (var s = 0; s < this.maxSlots; s++) {
            var sx = W / 2 - (this.maxSlots * 50) / 2 + s * 50 + 25;
            var slotBg = this.add.rectangle(sx, 370, 40, 40, 0x444444, 1);
            slotBg.setStrokeStyle(2, 0x666666);
            var slotText = this.add.text(sx, 370, '' + (s + 1), {
                fontSize: '12px', fontFamily: 'Arial', color: '#666666'
            }).setOrigin(0.5);
            this.slotIcons.push({ bg: slotBg, text: slotText });
        }

        // 出撃ボタン
        this.startBtn = this.add.rectangle(W / 2, 420, 200, 40, 0x444444, 1);
        this.startBtn.setInteractive({ useHandCursor: true });
        this.startBtnText = this.add.text(W / 2, 420, '出撃！', {
            fontSize: '20px', fontFamily: 'Arial', color: '#FFFFFF', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.startBtn.on('pointerdown', function() {
            if (self.selectedKeys.length > 0) {
                self.scene.start('battle', {
                    stageKey: self.stageKey,
                    selectedCats: self.selectedKeys.slice()
                });
            }
        });
        this.startBtn.on('pointerover', function() {
            if (self.selectedKeys.length > 0) self.startBtn.setFillStyle(0x55BB55);
        });
        this.startBtn.on('pointerout', function() {
            self.updateStartBtn();
        });

        this.updateStartBtn();
    }

    buildCards() {
        // 既存カード削除
        for (var i = 0; i < this.catCards.length; i++) {
            var c = this.catCards[i];
            c.bg.destroy(); c.icon.destroy(); c.nameText.destroy();
            c.statText.destroy(); c.descText.destroy(); c.costText.destroy(); c.checkMark.destroy();
        }
        this.catCards = [];

        var W = Game.CONFIG.width;
        var totalW = this.cols * this.cardW + (this.cols - 1) * this.gapX;
        var startX = (W - totalW) / 2 + this.cardW / 2;

        var startIdx = this.currentPage * this.catsPerPage;
        var endIdx = Math.min(startIdx + this.catsPerPage, this.unlockedKeys.length);

        for (var i = startIdx; i < endIdx; i++) {
            var key = this.unlockedKeys[i];
            var catData = Game.UnitData.cats[key];
            var localIdx = i - startIdx;
            var col = localIdx % this.cols;
            var row = Math.floor(localIdx / this.cols);
            var cx = startX + col * (this.cardW + this.gapX);
            var cy = this.startY + row * (this.cardH + this.gapY);

            var card = this.createCatCard(cx, cy, this.cardW, this.cardH, key, catData);
            this.catCards.push(card);
        }
    }

    changePage(dir) {
        this.currentPage += dir;
        if (this.currentPage < 0) this.currentPage = this.totalPages - 1;
        if (this.currentPage >= this.totalPages) this.currentPage = 0;
        this.buildCards();
        this.updatePageText();
    }

    updatePageText() {
        if (this.pageText) {
            this.pageText.setText('' + (this.currentPage + 1) + ' / ' + this.totalPages);
        }
    }

    createCatCard(x, y, w, h, key, catData) {
        var self = this;
        var bg = this.add.rectangle(x, y, w, h, 0x333344, 1);
        bg.setStrokeStyle(2, 0x555566);
        bg.setInteractive({ useHandCursor: true });

        // 既に選択済みかチェック
        var isSelected = this.selectedKeys.indexOf(key) >= 0;
        if (isSelected) {
            bg.setFillStyle(0x334433);
            bg.setStrokeStyle(2, 0x44FF44);
        }

        var icon = this.add.circle(x, y - 22, 11, catData.color);

        var nameText = this.add.text(x, y - 5, catData.name, {
            fontSize: '10px', fontFamily: 'Arial', color: '#FFFFFF'
        }).setOrigin(0.5);

        var statText = this.add.text(x, y + 8, 'HP:' + catData.hp + ' ATK:' + catData.attack, {
            fontSize: '8px', fontFamily: 'Arial', color: '#AAAAAA'
        }).setOrigin(0.5);

        var descText = this.add.text(x, y + 19, catData.desc || '', {
            fontSize: '7px', fontFamily: 'Arial', color: '#66CCFF',
            align: 'center', wordWrap: { width: w - 6 }
        }).setOrigin(0.5);

        var costText = this.add.text(x, y + 32, '$' + catData.cost, {
            fontSize: '10px', fontFamily: 'Arial', color: '#FFD700'
        }).setOrigin(0.5);

        var checkMark = this.add.text(x + w / 2 - 8, y - h / 2 + 4, isSelected ? '✓' : '', {
            fontSize: '14px', fontFamily: 'Arial', color: '#44FF44'
        }).setOrigin(0.5);

        var card = {
            key: key, bg: bg, icon: icon, nameText: nameText,
            statText: statText, descText: descText, costText: costText,
            checkMark: checkMark, selected: isSelected
        };

        bg.on('pointerdown', function() {
            self.toggleSelect(card);
        });

        return card;
    }

    toggleSelect(card) {
        if (card.selected) {
            card.selected = false;
            card.bg.setFillStyle(0x333344);
            card.bg.setStrokeStyle(2, 0x555566);
            card.checkMark.setText('');
            var idx = this.selectedKeys.indexOf(card.key);
            if (idx >= 0) this.selectedKeys.splice(idx, 1);
        } else {
            if (this.selectedKeys.length >= this.maxSlots) return;
            card.selected = true;
            card.bg.setFillStyle(0x334433);
            card.bg.setStrokeStyle(2, 0x44FF44);
            card.checkMark.setText('✓');
            this.selectedKeys.push(card.key);
        }
        this.updateSlots();
        this.updateStartBtn();
    }

    updateSlots() {
        for (var i = 0; i < this.maxSlots; i++) {
            var slot = this.slotIcons[i];
            if (i < this.selectedKeys.length) {
                var catData = Game.UnitData.cats[this.selectedKeys[i]];
                slot.bg.setFillStyle(catData.color, 0.6);
                slot.bg.setStrokeStyle(2, 0x44FF44);
                slot.text.setText(catData.name.substring(0, 3));
                slot.text.setColor('#FFFFFF');
                slot.text.setFontSize(10);
            } else {
                slot.bg.setFillStyle(0x444444, 1);
                slot.bg.setStrokeStyle(2, 0x666666);
                slot.text.setText('' + (i + 1));
                slot.text.setColor('#666666');
                slot.text.setFontSize(12);
            }
        }
    }

    updateStartBtn() {
        if (this.selectedKeys.length > 0) {
            this.startBtn.setFillStyle(0x44AA44);
            this.startBtnText.setText('出撃！（' + this.selectedKeys.length + '体）');
        } else {
            this.startBtn.setFillStyle(0x444444);
            this.startBtnText.setText('メンバーを選んでください');
        }
    }
};
