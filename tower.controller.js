var roomFinders = require('room.finders');

var towerController = {
  run: function(room, hostileCreeps, roadsToRepair) {
    const towersInRoom = roomFinders.findTowers(room);
    towersInRoom.forEach(function(tower) {
      if (hostileCreeps.length > 0) {
        attackHostile(tower, room, hostileCreeps[0]);
        return;
      }

      const creepsNeedingHealing = roomFinders.findCreepsNeedingHealing(room);
      if (creepsNeedingHealing.length > 0) {
        healCreep(tower, creepsNeedingHealing[0]);
        return;
      }

      const structuresToRepair = roomFinders.findStructuresToRepair(room);
      //console.log('Structures to repair: '+structuresToRepair.length);
      if (structuresToRepair.length > 0) {
        repairStructure(tower, structuresToRepair[0]);
        return;
      }

      if (roadsToRepair.length > 0) {
        repairStructure(tower, roadsToRepair[0]);
        return;
      }
    });
  },
};

function attackHostile(tower, room, hostileCreep) {
  console.log('Attacking hostile ' + hostileCreep + ' in room ' + room);
  const attackResult = tower.attack(hostileCreep);
  switch (attackResult) {
    case OK:
      console.log('Successful attack on hostile ' + hostileCreep +
        ' by tower ' + tower);
      break;
    case ERR_NOT_ENOUGH_RESOURCES:
      console.log('Warning! Tower ' + tower + ' does not have enough ' +
        'resources for attacking');
      break;
    case ERR_INVALID_TARGET:
      console.log('Error: Tower ' + tower + ' attempted to attack an ' +
        'invalid target ' + hostileCreep);
      break;
    case ERR_RCL_NOT_ENOUGH:
      console.log('Error: Room Controller Level insufficient for tower');
      break;
    default:
      console.log('Unknown result ' + attackResult + ' of attack from ' +
        tower);
  }
}

function repairStructure(tower, structureToRepair) {
  console.log(tower + ' repairing ' + structureToRepair);
  const result = tower.repair(structureToRepair);
  switch (result) {
    case OK:
      console.log('Successful repair on ' + structureToRepair + ' by tower ' + tower);
      break;
    case ERR_NOT_ENOUGH_RESOURCES:
      console.log('Warning! Tower ' + tower + ' does not have enough ' +
        'resources for repairing');
      break;
    case ERR_INVALID_TARGET:
      console.log('Error: Tower ' + tower + ' attempted to repair an ' +
        'invalid target ' + structureToRepair);
      break;
    case ERR_RCL_NOT_ENOUGH:
      console.log('Error: Room Controller Level insufficient for tower');
      break;
    default:
      console.log('Unknown result ' + result + ' of heal from ' + tower);
  }
}

function healCreep(tower, creep) {
  console.log(tower + ' healing ' + creep);
  const result = tower.heal(creep);
  switch (result) {
    case OK:
      console.log('Successful heal on ' + creep + ' by tower ' + tower);
      break;
    case ERR_NOT_ENOUGH_RESOURCES:
      console.log('Warning! Tower ' + tower + ' does not have enough ' +
        'resources for healing');
      break;
    case ERR_INVALID_TARGET:
      console.log('Error: Tower ' + tower + ' attempted to heal an ' +
        'invalid target ' + creep);
      break;
    case ERR_RCL_NOT_ENOUGH:
      console.log('Error: Room Controller Level insufficient for tower');
      break;
    default:
      console.log('Unknown result ' + result + ' of heal from ' + tower);
  }
}

module.exports = towerController;