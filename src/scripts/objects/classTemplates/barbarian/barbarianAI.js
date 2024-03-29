import moveToMoveTarget from '../../../player/moveToMoveTarget';
/**
 * barbarianAI - barbarian script, used for
 * non player controlled barbarian characters.
 *
 * @param  {Character} character reference
 * @returns {function} update function
 */
export default function barbarianAI() {
  const meleeRange = 25;
  const rageDumpValue = 30;
  const AI = function() {
    if (this.combat.isDead()) return;

    const rage = this.rage.rage();

    // scan for enemies for body pull
    const enemies = this.target.scanForEnemies(75);
    // scan for enemies by threat table (pulled by attack)
    const target = this.threat.highestThreat()
      ? this.threat.highestThreat()
      : this.target.getClosestEnemy(enemies);
    // if no target in range and no aggro, wait
    if (!target) {
      this.animations.idle();
      return this.movement.stop();
    } else {
      this.target.setCurrentTarget(target);
    }

    // if target, is he far enough to charge?
    const isTooCloseToCharge = this.target.rangeCheck(target, 60);
    const canMelee = this.target.rangeCheck(target, meleeRange);
    if (canMelee) {
      // stop moving:
      this.movement.stop();
      // does target have gore? if not, give it to him!
      if (!target.buffs.has("gore") && rage > rageDumpValue) this.ability.gore();

      // do I have too much rage? spend it...
      if (rage > rageDumpValue) this.ability.savageBlow();
      this.combat.meleeAutoAttack(target);
      this.animations.combat();
    } else {
      // charge if not in melee range:
      moveToMoveTarget(this);
      if (!isTooCloseToCharge) return this.ability.rush();
    }
  }
  return AI;
}
