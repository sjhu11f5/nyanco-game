Game.MoneySystem = class MoneySystem {
    constructor(startingMoney, incomeRate) {
        this.currentMoney = startingMoney;
        this.baseIncomeRate = incomeRate;
        this.incomeRate = incomeRate;
        this.incomeLevel = 1;
        this.upgradeCost = 100; // 最初のアップグレードコスト
    }

    update(delta) {
        this.currentMoney += this.incomeRate * delta;
    }

    canAfford(amount) {
        return this.currentMoney >= amount;
    }

    spend(amount) {
        if (!this.canAfford(amount)) return false;
        this.currentMoney -= amount;
        return true;
    }

    earn(amount) {
        this.currentMoney += amount;
    }

    getMoney() {
        return Math.floor(this.currentMoney);
    }

    canUpgradeIncome() {
        return this.canAfford(this.upgradeCost);
    }

    upgradeIncome() {
        if (!this.canUpgradeIncome()) return false;
        this.spend(this.upgradeCost);
        this.incomeLevel++;
        this.incomeRate = this.baseIncomeRate * (1 + (this.incomeLevel - 1) * 0.3);
        this.upgradeCost = Math.floor(this.upgradeCost * 1.5); // コストも上がる
        return true;
    }
};
