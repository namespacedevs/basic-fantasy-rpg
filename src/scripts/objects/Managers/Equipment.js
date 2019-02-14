export default class Equipment {
  constructor(character) {
    let equipped = {
      mainHand: {},
      offHand: {},
      ranged: {},
      ammo: {},
      head: {},
      neck: {},
      shoulder: {},
      back: {},
      chest: {},
      tabard: {},
      wrist: {},
      hands: {},
      belt: {},
      legs: {},
      feet: {},
      trinket1: {},
      trinket2: {}
    }

    this.isDualWielding = function() {
      const hasDualWield = character.ability.getSpellbook().includes('dual-wield');
      const hasWeaponInOffhand = this.getEquipped().offHand.damage;
      if (hasDualWield && hasWeaponInOffhand) return true;
      else return false;
    }

    /**
     * getCurrentWeaponSkill
     *
     * @param  {string} hand to check
     * @returns {number} weapon skill
     */
    this.getCurrentWeaponSkill = function(hand = '') {
      const mainHandType = this.getEquipped().mainHand.type;
      const offHandType = this.getEquipped().offHand.type;
      const weaponType = (hand === 'main')
        ? mainHandType
        : offHandType;

      return character.skills.getWeaponSkills()[weaponType];
    }

    /**
     * getWeaponDmg - amount used in determining dmg
     * update with correct weapon values
     *
     * @param  {string} hand attacking with
     * @returns {object} dmg object: { min: 1, max: 2 }
     */
    this.getWeaponDmg = function(hand = '') {
      const mainHandWpnDmg = this.getEquipped().mainHand.damage;
      const offHandWpnDmg= this.getEquipped().offHand.damage;
      const weaponDamage = (hand === 'main')
        ? mainHandWpnDmg
        : offHandWpnDmg;
      return weaponDamage;
    }

    /**
     * getWeaponSpeed
     *
     * @param  {string} hand weapon is in
     * @returns {number}
     */
    this.getWeaponSpeed = function(hand = '') {
      const mainHandSpeed = this.getEquipped().mainHand.speed;
      const offHandSpeed = this.getEquipped().offHand.speed;
      const weaponSpeed = (hand === 'main')
        ? mainHandSpeed
        : offHandSpeed;
      return weaponSpeed;
    }

    /**
     * checkForTwoHandWeapon
     *
     * @returns {bool} true if using 2h
     */
    this.checkForTwoHandWeapon = function() {
      const weaponSlot = this.getEquipped().mainHand.slot;
      return weaponSlot === 'two-hand';
    }

    /**
     * getStatFromEquipped - equipped
     *
     * @param  {Character} character
     * @param  {string} stat e.g. 'armor', 'stamina', etc...
     * @returns {number} total of stat equipped
     */
    this.getStatFromEquipped = function(stat = '') {
      let total = 0;
      const equipped = this.getEquipped();
      for (let item in equipped) {
        if (equipped[item][stat]) {
          total += equipped[item][stat];
        }
      }
      return total;
    }

    /**
     * getEquipped
     *
     * @returns {object}
     */
    this.getEquipped = function() {
      return equipped;
    }

    /**
     * setEquipped
     *
     * @param  {object} equipped
     * @returns {void}
     */
    this.setEquipped = function(newEquipped) {
      equipped = newEquipped;
    }

    // methods for calculating stats from gear
  }
}
