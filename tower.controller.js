var towerController = {
  run: function(room) {
    const towersInRoom = room.getTowers();
    towersInRoom.forEach(function(tower) {
      const hostileCreeps = room.getHostiles();
      if (hostileCreeps.length > 0) {
        attackHostile(tower, room, hostileCreeps[0]);
        return;
      }

      if (tower.energy <= 300) {
        return;
      }

      const creepsNeedingHealing = room.getCreepsNeedingHealing();
      if (creepsNeedingHealing.length > 0) {
        healCreep(tower, creepsNeedingHealing[0]);
        return;
      }

      const containersToRepair = room.getContainersNeedingRepair();
      if (containersToRepair.length > 0) {
        const containersToRepairSortedByHits = containersToRepair.sort(function(a,b) {
          return a.hits - b.hits;
        });
        repairStructure(tower, containersToRepairSortedByHits[0]);
        return;
      }

      const structuresToRepair = room.getStructuresNeedingRepair();
      if (structuresToRepair.length > 0) {
        repairStructure(tower, structuresToRepair[0]);
        return;
      }

      const roadsToRepair = room.getRoadsNeedingRepair();
      if (roadsToRepair.length > 0) {
        repairStructure(tower, roadsToRepair[0]);
        return;
      }

      const wallsToRepair = room.getRampartsAndWallsNeedingRepair();
      if (wallsToRepair.length > 0) {
        const sortedWallsByHits = _.sortByOrder(wallsToRepair, function(wall) {
          return wall.hits;
        }, ['asc']);
        repairStructure(tower, sortedWallsByHits[0]);
        return;
      }
    });
  },
};

function attackHostile(tower, room, hostileCreep) {
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
  const result = tower.repair(structureToRepair);
  switch (result) {
    case OK:
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
