Game.StageData = {
    stage1: {
        name: 'ステージ1: にゃんこ草原',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 200,
        moneyPerSecond: 15,
        worldWidth: 1600,
        waves: [
            { time: 2,   unitKey: 'doge',      count: 2,  interval: 3.0 },
            { time: 12,  unitKey: 'snache',     count: 3,  interval: 2.0 },
            { time: 25,  unitKey: 'doge',       count: 4,  interval: 2.0 },
            { time: 35,  unitKey: 'those_guys', count: 1,  interval: 0 },
            { time: 40,  unitKey: 'snache',     count: 5,  interval: 1.5 },
            { time: 55,  unitKey: 'doge',       count: 6,  interval: 1.5 },
            { time: 65,  unitKey: 'those_guys', count: 2,  interval: 4.0 },
            { time: 75,  unitKey: 'doge',       count: 8,  interval: 1.0 },
            { time: 90,  unitKey: 'those_guys', count: 3,  interval: 3.0 }
        ]
    },
    stage2: {
        name: 'ステージ2: 夕焼け砂漠',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 250,
        moneyPerSecond: 15,
        worldWidth: 1700,
        waves: [
            { time: 1,   unitKey: 'snache',     count: 4,  interval: 2.0 },
            { time: 10,  unitKey: 'doge',       count: 5,  interval: 1.5 },
            { time: 20,  unitKey: 'those_guys', count: 2,  interval: 3.0 },
            { time: 30,  unitKey: 'snache',     count: 6,  interval: 1.0 },
            { time: 40,  unitKey: 'doge',       count: 8,  interval: 1.0 },
            { time: 50,  unitKey: 'those_guys', count: 3,  interval: 3.0 },
            { time: 65,  unitKey: 'snache',     count: 8,  interval: 0.8 },
            { time: 80,  unitKey: 'those_guys', count: 4,  interval: 2.5 }
        ]
    },
    stage3: {
        name: 'ステージ3: 暗黒の森',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 300,
        moneyPerSecond: 15,
        worldWidth: 1800,
        waves: [
            { time: 1,   unitKey: 'doge',       count: 6,  interval: 1.5 },
            { time: 8,   unitKey: 'those_guys', count: 2,  interval: 2.0 },
            { time: 18,  unitKey: 'snache',     count: 8,  interval: 1.0 },
            { time: 28,  unitKey: 'doge',       count: 10, interval: 0.8 },
            { time: 38,  unitKey: 'those_guys', count: 3,  interval: 2.5 },
            { time: 50,  unitKey: 'snache',     count: 10, interval: 0.7 },
            { time: 60,  unitKey: 'those_guys', count: 4,  interval: 2.0 },
            { time: 75,  unitKey: 'doge',       count: 12, interval: 0.6 }
        ]
    },
    stage4: {
        name: 'ステージ4: 灼熱の火山',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 350,
        moneyPerSecond: 15,
        worldWidth: 1800,
        waves: [
            { time: 0,   unitKey: 'those_guys', count: 2,  interval: 2.0 },
            { time: 5,   unitKey: 'snache',     count: 6,  interval: 1.0 },
            { time: 15,  unitKey: 'doge',       count: 10, interval: 0.8 },
            { time: 25,  unitKey: 'those_guys', count: 4,  interval: 2.0 },
            { time: 35,  unitKey: 'snache',     count: 12, interval: 0.6 },
            { time: 45,  unitKey: 'those_guys', count: 5,  interval: 2.0 },
            { time: 55,  unitKey: 'doge',       count: 15, interval: 0.5 },
            { time: 70,  unitKey: 'those_guys', count: 6,  interval: 1.5 }
        ]
    },
    stage5: {
        name: 'ステージ5: 魔王城',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 400,
        moneyPerSecond: 15,
        worldWidth: 1900,
        waves: [
            { time: 0,   unitKey: 'those_guys', count: 3,  interval: 1.5 },
            { time: 5,   unitKey: 'doge',       count: 10, interval: 0.8 },
            { time: 12,  unitKey: 'snache',     count: 10, interval: 0.6 },
            { time: 22,  unitKey: 'those_guys', count: 5,  interval: 1.5 },
            { time: 32,  unitKey: 'doge',       count: 15, interval: 0.5 },
            { time: 42,  unitKey: 'those_guys', count: 6,  interval: 1.5 },
            { time: 52,  unitKey: 'snache',     count: 15, interval: 0.4 },
            { time: 65,  unitKey: 'those_guys', count: 8,  interval: 1.0 },
            { time: 80,  unitKey: 'doge',       count: 20, interval: 0.3 }
        ]
    },
    stage6: {
        name: 'ステージ6: 凍結の氷原',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 400,
        moneyPerSecond: 15,
        worldWidth: 1800,
        waves: [
            { time: 0,   unitKey: 'snache',     count: 8,  interval: 1.0 },
            { time: 5,   unitKey: 'those_guys', count: 3,  interval: 2.0 },
            { time: 15,  unitKey: 'doge',       count: 12, interval: 0.6 },
            { time: 25,  unitKey: 'those_guys', count: 5,  interval: 1.5 },
            { time: 35,  unitKey: 'snache',     count: 15, interval: 0.5 },
            { time: 50,  unitKey: 'those_guys', count: 6,  interval: 1.5 },
            { time: 60,  unitKey: 'doge',       count: 18, interval: 0.4 },
            { time: 75,  unitKey: 'those_guys', count: 7,  interval: 1.0 }
        ]
    },
    stage7: {
        name: 'ステージ7: 深海の神殿',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 450,
        moneyPerSecond: 15,
        worldWidth: 1800,
        waves: [
            { time: 0,   unitKey: 'those_guys', count: 4,  interval: 1.5 },
            { time: 5,   unitKey: 'doge',       count: 15, interval: 0.5 },
            { time: 15,  unitKey: 'snache',     count: 12, interval: 0.5 },
            { time: 25,  unitKey: 'those_guys', count: 6,  interval: 1.2 },
            { time: 38,  unitKey: 'doge',       count: 20, interval: 0.3 },
            { time: 50,  unitKey: 'those_guys', count: 7,  interval: 1.0 },
            { time: 65,  unitKey: 'snache',     count: 18, interval: 0.3 },
            { time: 80,  unitKey: 'those_guys', count: 8,  interval: 0.8 }
        ]
    },
    stage8: {
        name: 'ステージ8: 天空の回廊',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 500,
        moneyPerSecond: 15,
        worldWidth: 1900,
        waves: [
            { time: 0,   unitKey: 'those_guys', count: 5,  interval: 1.2 },
            { time: 3,   unitKey: 'snache',     count: 15, interval: 0.4 },
            { time: 12,  unitKey: 'doge',       count: 20, interval: 0.4 },
            { time: 25,  unitKey: 'those_guys', count: 7,  interval: 1.0 },
            { time: 35,  unitKey: 'snache',     count: 20, interval: 0.3 },
            { time: 48,  unitKey: 'those_guys', count: 8,  interval: 0.8 },
            { time: 60,  unitKey: 'doge',       count: 25, interval: 0.3 },
            { time: 78,  unitKey: 'those_guys', count: 10, interval: 0.6 }
        ]
    },
    stage9: {
        name: 'ステージ9: 煉獄の門',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 500,
        moneyPerSecond: 15,
        worldWidth: 1900,
        waves: [
            { time: 0,   unitKey: 'those_guys', count: 6,  interval: 1.0 },
            { time: 3,   unitKey: 'doge',       count: 20, interval: 0.3 },
            { time: 10,  unitKey: 'snache',     count: 20, interval: 0.3 },
            { time: 22,  unitKey: 'those_guys', count: 8,  interval: 0.8 },
            { time: 32,  unitKey: 'doge',       count: 25, interval: 0.2 },
            { time: 45,  unitKey: 'those_guys', count: 10, interval: 0.6 },
            { time: 58,  unitKey: 'snache',     count: 25, interval: 0.2 },
            { time: 72,  unitKey: 'those_guys', count: 12, interval: 0.5 }
        ]
    },
    stage10: {
        name: 'ステージ10: 終焉の地',
        baseHP: 1500,
        playerBaseHP: 1500,
        startingMoney: 550,
        moneyPerSecond: 15,
        worldWidth: 2000,
        waves: [
            { time: 0,   unitKey: 'those_guys', count: 8,  interval: 0.8 },
            { time: 3,   unitKey: 'doge',       count: 25, interval: 0.2 },
            { time: 10,  unitKey: 'snache',     count: 25, interval: 0.2 },
            { time: 20,  unitKey: 'those_guys', count: 10, interval: 0.6 },
            { time: 30,  unitKey: 'doge',       count: 30, interval: 0.2 },
            { time: 42,  unitKey: 'those_guys', count: 12, interval: 0.5 },
            { time: 55,  unitKey: 'snache',     count: 30, interval: 0.15 },
            { time: 68,  unitKey: 'those_guys', count: 15, interval: 0.4 },
            { time: 82,  unitKey: 'doge',       count: 30, interval: 0.15 }
        ]
    }
};

Game.StageOrder = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6', 'stage7', 'stage8', 'stage9', 'stage10'];
