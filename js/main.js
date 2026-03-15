// ゲームインスタンス作成
Game.CONFIG.scene = [Game.BootScene, Game.PrepareScene, Game.BattleScene];

const game = new Phaser.Game(Game.CONFIG);
