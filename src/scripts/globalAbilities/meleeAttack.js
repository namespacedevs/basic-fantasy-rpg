import meleeAutoAttackHitTable from '../hitTables/meleeAutoAttackHitTable';
import { getRandomIntInclusive } from '../utilities/randomNumberUtilities';

/**
 * meleeAttack
 *
 * @param  {Character} attacker
 * @param  {Character} target
 * @param  {string} hand left or right
 * @returns {object} damage information
 */
function meleeAttack(attacker = {}, target = {}, hand = '', type = '') {
  attacker.timer.resetSwingTimer(hand);
  const weaponsDamageRange = attacker.equipment.getWeaponDmg(hand);
  const attackStatus = meleeAutoAttackHitTable(attacker, target, hand);
  let weaponDmg = getRandomIntInclusive(weaponsDamageRange.min, weaponsDamageRange.max);
  if (hand === 'off') weaponDmg /= 2;
  const damageAmount = weaponDmg + attacker.stat.getAttackPowerBonus(hand);
  const targetStartingHp = target.stat.getHp();
  const combatObject = attacker.combat.buildMeleeCombatObject(
    target,
    attackStatus,
    'melee',
    damageAmount,
    hand
  );
  attacker.combat.processCombatObject(target, combatObject);
  return combatObject;
}



/**
 * meleeAutoAttack - wrapper for melee attack.
 * checks each hand swing timer,
 * checks to see if two handed weapon is being used.
 *
 * @param  {Character} character attacking
 * @returns {void}
 */
function meleeAutoAttack(attacker = {}, target = {}) {
  const isTargetDead = target.combat.isDead();
  if (isTargetDead) return;
  const canAttackWithMainHand = attacker.timer.checkSwingTimer('main');
  if (canAttackWithMainHand) meleeAttack(attacker, target, 'main', 'autoAttack');
  const canAttackWithOffHand = attacker.timer.checkSwingTimer('off');
  // if offhand has damage key, must be a weapon.
  if (canAttackWithOffHand && attacker.equipment.isDualWielding()) {
    meleeAttack(attacker, target, 'off', 'autoAttack');
  }
}

export {
  meleeAutoAttack
};