Game.CombatSystem = class CombatSystem {
    update(playerUnits, enemyUnits, playerBase, enemyBase) {
        // プレイヤーユニットの戦闘処理
        for (const pUnit of playerUnits) {
            if (pUnit.state === 'dying' || pUnit.state === 'dead') continue;

            if (pUnit.state === 'walking') {
                let closestTarget = null;
                let closestDist = Infinity;

                // 全敵ユニットから最も近いものを探す（左右問わず）
                for (const eUnit of enemyUnits) {
                    if (eUnit.state === 'dying' || eUnit.state === 'dead') continue;
                    const dist = Math.abs(eUnit.x - pUnit.x);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestTarget = eUnit;
                    }
                }

                // 敵拠点もチェック（拠点は必ず右側にある）
                const baseDist = enemyBase.x - pUnit.x;
                if (baseDist > 0 && baseDist < closestDist) {
                    closestDist = baseDist;
                    closestTarget = enemyBase;
                }

                // 射程内なら攻撃開始、射程外なら敵に向かって歩く
                if (closestTarget && closestDist <= pUnit.data.attackRange) {
                    pUnit.state = 'attacking';
                    pUnit.target = closestTarget;
                    pUnit.attackTimer = 0;
                    pUnit.moveTarget = null;
                } else if (closestTarget) {
                    const targetX = closestTarget.x != null ? closestTarget.x : closestTarget.x;
                    pUnit.moveTarget = targetX;
                } else {
                    pUnit.moveTarget = null;
                }
            } else if (pUnit.state === 'attacking') {
                if (!pUnit.target || pUnit.target.currentHP <= 0 ||
                    (pUnit.target instanceof Game.Unit && (pUnit.target.state === 'dying' || pUnit.target.state === 'dead'))) {
                    pUnit.state = 'walking';
                    pUnit.target = null;
                }
                // 城を攻撃中に敵ユニットが射程内に来たら、そちらを優先
                else if (!(pUnit.target instanceof Game.Unit)) {
                    for (const eUnit of enemyUnits) {
                        if (eUnit.state === 'dying' || eUnit.state === 'dead') continue;
                        const dist = Math.abs(eUnit.x - pUnit.x);
                        if (dist <= pUnit.data.attackRange) {
                            pUnit.target = eUnit;
                            pUnit.attackTimer = 0;
                            break;
                        }
                    }
                }
            }
        }

        // 敵ユニットの戦闘処理
        for (const eUnit of enemyUnits) {
            if (eUnit.state === 'dying' || eUnit.state === 'dead') continue;

            if (eUnit.state === 'walking') {
                let closestTarget = null;
                let closestDist = Infinity;

                // 全プレイヤーユニットから最も近いものを探す（左右問わず）
                for (const pUnit of playerUnits) {
                    if (pUnit.state === 'dying' || pUnit.state === 'dead') continue;
                    const dist = Math.abs(eUnit.x - pUnit.x);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestTarget = pUnit;
                    }
                }

                // プレイヤー拠点もチェック（拠点は必ず左側にある）
                const baseDist = eUnit.x - playerBase.x;
                if (baseDist > 0 && baseDist < closestDist) {
                    closestDist = baseDist;
                    closestTarget = playerBase;
                }

                if (closestTarget && closestDist <= eUnit.data.attackRange) {
                    eUnit.state = 'attacking';
                    eUnit.target = closestTarget;
                    eUnit.attackTimer = 0;
                    eUnit.moveTarget = null;
                } else if (closestTarget) {
                    eUnit.moveTarget = closestTarget.x;
                } else {
                    eUnit.moveTarget = null;
                }
            } else if (eUnit.state === 'attacking') {
                if (!eUnit.target || eUnit.target.currentHP <= 0 ||
                    (eUnit.target instanceof Game.Unit && (eUnit.target.state === 'dying' || eUnit.target.state === 'dead'))) {
                    eUnit.state = 'walking';
                    eUnit.target = null;
                }
                // 城を攻撃中にプレイヤーユニットが射程内に来たら、そちらを優先
                else if (!(eUnit.target instanceof Game.Unit)) {
                    for (const pUnit of playerUnits) {
                        if (pUnit.state === 'dying' || pUnit.state === 'dead') continue;
                        const dist = Math.abs(eUnit.x - pUnit.x);
                        if (dist <= eUnit.data.attackRange) {
                            eUnit.target = pUnit;
                            eUnit.attackTimer = 0;
                            break;
                        }
                    }
                }
            }
        }
    }
};
