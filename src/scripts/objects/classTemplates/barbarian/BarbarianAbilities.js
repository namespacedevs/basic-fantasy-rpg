import processCombatObject from '../../Managers/Combat/processCombatObject';

export default class BarbarianAbilities {
  constructor(character) {
    let abilities = ['dodge', 'block', 'parry'];

    /**
    * getAbilities
    *
    * @returns {array}  characters abilitees
    */
    this.getAbilities = function() {
      return abilities;
    }

    /**
    * setAbilities - spells character knows
    *
    * @param  {array} newAbilities
    * @returns {void}
    */
    this.setAbilities = function(newAbilities) {
      abilities = newAbilities;
    }

    /**
     * Battle Shout - The barbarian shouts, increasing the melee
     * attack power of all party members within 20 yards by 15.
     * Lasts 2 minutes.
     *
     * level: 1
     *
     * requires: level 1
     *
     * @returns {void}
     */
    this.battleShout = function() {
      const alliesInRange = character.target.scanForAllies(200);
      // create a buff object.
      const buff = {
        name: 'battleShout',
        duration: 120 * 60,
        statObject: {
          attackPower: 25
        }
      }

      if (character.rage.spendRage(10)) {
        // push it to each of the allies in 20 yards
        if (alliesInRange.length !== 0) {
          alliesInRange.forEach(ally => {
            if (ally.buffs.has('battleShout'))
              ally.buffs.replace(buff);
            else
              ally.buffs.add(buff);
          })
        }
      };
    }

    /**
     * Heroic Strike - A strong attack that increases weapon
     * damage by 11 and causes a hight amount (20 for lvl 1) of threat.
     *
     * level: 1
     *
     * requires: level 1
     *
     * @returns {void}
     */
    this.heroicStrike = function() {
      const rageCost = 15;
      const oldRage = character.rage.rage();
      const enoughRage = oldRage >= rageCost;
      const onNextAttack = character.combat.getOnNextAttack();
      if (onNextAttack === 'heroicStrike') return;
      if (!enoughRage) return console.log("I need more rage");
      const newOnNextAttack = 'heroicStrike';
      character.combat.setOnNextAttack(newOnNextAttack)
    }

    /**
     * Charge - Charge an enemy, generate 9 rage, and stun it for 1 second.
     * Cannot be used in combat. Requires Battle Stance
     *
     * level: 1
     *
     * requires: level 4
     *
     * @returns {void}
     */
    this.charge = function() {
      const range = 60;
      const duration = 3;
      const target = character.target.currentTarget();
      if (!target) return console.log('I dont have a target!');
      if (target.combat.isDead()) return console.log("I can't attack that")
      const inRange = character.target.rangeCheck(target, range)
      if (inRange) return console.log('You are too close')
      const combatObject = {
        attacker: character.getName(),
        target: target.getName(),
        status: 'hit',
        type: 'stun',
        range: 'melee',
        damageType: 'physical',
        amount: 0,
        bonusThreat: 1,
        mitigationAmount: 0,
        hand: 'main',
        time: Date.now()
      }
      target.buffs.add({
        name: 'stun',
        duration: duration * 60,
        combatObject,
        attacker: character
      });
      character.rage.spendRage(-9)
      character.movement.setMoveTargetCoords([target.x, target.y])
      character.movement.setMovementSpeed(500)
    }

    /**
     * Rend - Wounds the target causing them to bleed for 15 damage
     * over 9 seconds. Requires Battle Stance/Defensive Stance
     *
     * level: 1
     *
     * requires: level 4
     *
     * @returns {void}
     */
    this.rend = function() {
      // check for valid target:
      const target = character.target.currentTarget();
      if (!target) return console.log('You need a target');
      // check for enough rage:
      const rageCost = 10;
      if (!character.rage.spendRage(rageCost)) return console.log('I need more rage')
      // build combatObject
      const myName = character.getName();
      const time = 9;
      const interval = 3;
      const dmgTick = 15;
      const combatObject = {
        attacker: character.getName(),
        target: target.getName(),
        status: 'hit',
        type: 'dot',
        range: 'melee',
        damageType: 'physical',
        amount: dmgTick,
        bonusThreat: 0,
        mitigationAmount: 0,
        hand: 'main',
        time: Date.now()
      }
      // build debuff
      const debuff = {
        name: 'rend',
        duration: time * 60,
        interval: interval * 60,
        combatObject,
        attacker: character
      }
      if (target.buffs.has('rend'))
        target.buffs.replace(debuff);
      else
        target.buffs.add(debuff);
      // placeholder animation, will make specific one for rend
      character.animations.swing();

    }

    /**
     * Thunder Clap - Blasts nearby enemies, increasing the time
     * between their attacks by 10% for 10 seconds and doing
     * 10 damage to them. Will affect up to 4 targets.
     * Requires Battle Stance
     *
     * threat: 1.75x damage.
     * damage is physical and is mitigated by
     * the armor of the opponent.
     * cannot be cast while silenced.
     *
     * level: 1
     *
     * requires: level 6
     * cooldown: 6 seconds
     * range: 8
     *
     * @returns {void}
     */
    this.thunderClap = function() {
      const rageCost = 20;
      const range = 80;
      const time = 10;
      // rage check
      if (character.rage.spendRage(rageCost)) {
        // scan for enemies
        const enemiesInRange = character.target.scanForEnemies(range);
        const closest = enemiesInRange.slice(0, 4);
        // push it to each of the allies in 20 yards
        if (closest.length !== 0) {

          closest.forEach(enemy => {
            // add in target
            const target = enemy.getName();
            // and armor
            const mAmount = character.stat.armorMitigationPercent(enemy)
            // make combat object
            const combatObject = {
              attacker: character.getName(),
              target,
              status: 'hit',
              type: 'special',
              range: 'melee',
              damageType: 'physical',
              amount: 10,
              bonusThreat: 10 * .75,
              mitigationAmount: mAmount,
              hand: 'main',
              time: Date.now()
            }
            // send object to be used
            processCombatObject(character, enemy, combatObject);
            const debuff = {
              name: 'thunderClap',
              duration: time * 60,
              statObject: {
                attackSpeed: 2
              },
              attacker: character
            }
            if (enemy.buffs.has('thunderClap'))
              enemy.buffs.replace(debuff);
            else
              enemy.buffs.add(debuff);
          })
        }
      }
    }

    /**
     * Hamstring - Maims the enemy, causing 5 damage and slowing
     * the enemy's movement by 40% for 15 seconds.
     * Requires Battle Stance/Berserker Stance
     *
     * level: 1
     *
     * requires: level 8
     *
     * @returns {void}
     */
    this.hamstring = function() {
      const dmg = 5;
      const rageCost = 10;
      const time = 15;
      const target = character.target.currentTarget();
      if (!target) return console.log('You need a target');
      if (!character.rage.spendRage(rageCost)) return console.log('I need more rage')
      const combatObject = {
        attacker: character.getName(),
        target,
        status: 'hit',
        type: 'special',
        range: 'melee',
        damageType: 'physical',
        amount: 5,
        bonusThreat: 0,
        mitigationAmount: 0,
        hand: 'main',
        time: Date.now()
      }
      // send object to be used
      processCombatObject(character, target, combatObject);
      // create combat object for 5 dmg, send it to be processed
      const debuff = {
        name: 'hamstring',
        duration: time * 60,
        statObject: {
          moveSpeed: .6
        },
        attacker: character
      }
      // create debuff for * .6 movement speed, send it to buff
      if (target.buffs.has('hamstring'))
        target.buffs.replace(debuff);
      else
        target.buffs.add(debuff);
      // placeholder animation, will make specific one for rend
      character.animations.swing();
    }
  }
}