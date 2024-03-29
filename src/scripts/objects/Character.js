import Stat from './Managers/Stats';
import Skills from './Managers/Skills';
import Timer from './Managers/Timer';
import Inventory from './Managers/Inventory';
import Combat from './Managers/Combat';
import Movement from './Managers/Movement';
import Equipment from './Managers/Equipment';
import Lvl from './Managers/Level';
import Target from './Managers/Target';
import Threat from './Managers/Threat';
import Buffs from './Managers/Buffs';
import Consumables from './Managers/Consumables';
import ResourceBar from './Managers/ResourceBar';
import playerUpdate from '../player/playerUpdate';

/**
 * Main character class, inherited by all characters.
 */
export default class Character extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y)
    scene.add.existing(this)
    scene.physics.add.existing(this);


    // working on this: keeps messing up the hit test though when they are circles.
    // this.setInteractive().setCircle(8)

    // who is controlling this character:
    this.controller = 'AI';


    const humanStartingStats = {strength: 20, agility: 20, intellect: 20, stamina: 20, spirit: 20};

    // managers to track and change state:
    this.stat = new Stat(this, humanStartingStats);
    this.skills = new Skills(this);
    this.equipment = new Equipment(this);
    this.timer = new Timer(this);
    this.consumables = new Consumables(this);
    this.combat = new Combat(this);
    this.movement = new Movement(this, x, y);
    this.equipment = new Equipment(this);
    this.lvl = new Lvl(this, 1);
    this.target = new Target(this);
    this.threat = new Threat(this);
    this.buffs = new Buffs(this);
    this.inventory = new Inventory(this);
    this.healthBar = new ResourceBar(scene, 'health', this.stat.maxHp());
    this.hands = scene.add.sprite(x, y - 4);
    this.depth = 1;
    this.hands.depth = 2;

    scene.characters.add(this);



    // method to keep bars up to date:
    this.updateBars = function() {
      // keep hands in right place:
      this.depth = this.y + 1;
      this.hands.x = this.x;
      this.hands.y = this.y - 4;
      this.hands.depth = this.y + 2;
      this.healthBar.set(this.stat.hp());
      this.healthBar.p = 14 / (this.stat.maxHp());
      this.healthBar.x = this.x - 8;
      this.healthBar.y = this.y - 20;
      this.healthBar.bar.depth = this.y;
      this.healthBar.draw();
      if (this.rage) {
        this.rageBar.set(this.rage.rage());
        this.rageBar.x = this.x - 8;
        this.rageBar.y = this.y - 17;
        this.rageBar.bar.depth = this.y;
        this.rageBar.draw();
      } else if (this.mana) {
        this.manaBar.p = 14 / (this.mana.maxMana());
        this.manaBar.set(this.mana.mana());
        this.manaBar.x = this.x - 8;
        this.manaBar.y = this.y - 17;
        this.manaBar.bar.depth = this.y;
        this.manaBar.draw();
      }

    }

    this.playerControlled = playerUpdate();



    // character name
    let name = '';
    // ['dwarf', 'night-elf', 'gnome', 'human'];
    let race = 'human';
    // ['druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'warlock', 'barbarian'];
    let characterClass = '';
    // 'horder', 'alliance', 'monster'
    let team = '';
    // person the kill belongs to:
    let tapped = undefined;

    // generate loot:
    let loot = undefined;

    /**
     * getName
     *
     * @returns {string} character name
     */
    this.getName = function() {
      return name;
    }

    /**
     * getRace
     *
     * @returns {string} character race
     */
    this.getRace = function() {
      return race;
    }

    /**
    * getCharacterClass
    *
    * @returns {string} character class
    */
    this.getCharacterClass = function() {
      return characterClass;
    }

    /**
    * team
    *
    * @returns {string}  characters team
    */
    this.team = function() {
      return team;
    }

    /**
     * tapped - who owns loot and xp
     *
     * @returns {Character}
     */
    this.tapped = function() {
      return tapped;
    }

    /**
     * loot - return loot object
     *
     * @returns {object} or undefined, if no loot
     */
    this.loot = function() {
      return loot;
    }

    /**
     * setName
     *
     * @param  {string} newName
     * @returns {void}
     */
    this.setName = function(newName) {
      name = newName;
    }

    /**
     * setRace
     *
     * @param  {string} newRace
     * @returns {void}
     */
    this.setRace = function(newRace) {
      race = newRace;
    }

    /**
    * setCharacterClass
    *
    * @param  {string} newCharacterClass
    * @returns {void}
    */
    this.setCharacterClass = function(newCharacterClass) {
      characterClass = newCharacterClass;
    }

    /**
    * setTeam
    *
    * @param  {string} newTeam
    * @returns {void}
    */
    this.setTeam = function(newTeam) {
      team = newTeam;
    }

    /**
     * setTapped
     *
     * @param  {Character} newTapped
     * @returns {void}
     */
    this.setTapped = function(newTapped) {
      if (tapped) return;
      tapped = newTapped;
    }

    this.setLoot = function(newLoot) {
      loot = newLoot;
    }
  }
}
