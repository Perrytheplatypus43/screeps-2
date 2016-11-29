var creepsMaintainer = require('creeps.maintainer');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roomFinders = require('room.finders');
var towerController = require('tower.controller');

module.exports.loop = function() {
  creepsMaintainer.run();

  const room = Game.spawns.Spawn1.room;
  const roadsToRepair = roomFinders.findRoadsToRepair(room);
  const hostileCreeps = roomFinders.findHostiles(room);

  towerController.run(room, hostileCreeps, roadsToRepair);

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    assignSourceToCreep(creep);
    if (shouldRetire(creep)) {
      creepsMaintainer.retireOldCreep(creep);
    }
    putCreepToWork(creep, room);
  }
};

function assignSourceToCreep(creep) {
  if (!creep.memory.sourceId) {
    const sources = creep.room.find(FIND_SOURCES, {
      filter: (source) => {
        return !_.includes(source.room.memory.blacklistedSources, source.id);
      }
    });
    const desiredSource = sources[Math.floor(Math.random() * sources.length)];
    creep.memory.sourceId = desiredSource.id;
    console.log('Setting sourceId to ' + desiredSource.id + ' for creep: ' + creep);
  }
}

function shouldRetire(creep) {
  return creep.memory.role !== 'retired' &&
    creep.ticksToLive < 5;
}

function putCreepToWork(creep, room) {
  const constructionSites = roomFinders.findConstructionSites(room);
  const droppedResources = roomFinders.findDroppedResources(room);
  const energyStorageStructures = roomFinders.findEnergyStorageStructures(room);

  if (creep.memory.role == 'harvester') {
    if (energyStorageStructures.length) {
      roleHarvester.run(creep, energyStorageStructures);
    } else if (constructionSites.length) {
      roleBuilder.run(creep, constructionSites, droppedResources);
    } else {
      roleUpgrader.run(creep);
    }
  }

  if (creep.memory.role == 'upgrader') {
    roleUpgrader.run(creep);
  }

  if (creep.memory.role == 'builder') {
    if (constructionSites.length) {
      roleBuilder.run(creep, constructionSites, droppedResources);
    } else {
      roleUpgrader.run(creep);
    }
  }
}
