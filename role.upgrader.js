var roleUtility = require('role.utility');

var roleUpgrader = {

  run: function(creep, creepWorkData) {
    if (creep.memory.upgrading && creep.carry.energy === 0) {
      creep.memory.upgrading = false;
      creep.say('harvesting');
    }

    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.memory.containerId = undefined;
      creep.say('upgrading');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    } else {
      if (creep.memory.containerId !== undefined) {
        const container = Game.getObjectById(creep.memory.containerId);
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container);
        }
        return;
      }

      const controllerContainer = Game.getObjectById(creep.room.memory.ControllerContainer);
      const spawnContainer = Game.getObjectById(creep.room.memory.SpawnContainer);
      const towerContainer = Game.getObjectById(creep.room.memory.TowerContainer);
      const source1Container = Game.getObjectById(creep.room.memory.Source1Container);
      const source2Container = Game.getObjectById(creep.room.memory.Source2Container);
      const containers = [
        controllerContainer,
        spawnContainer,
        towerContainer,
        source1Container,
        source2Container,
      ];

      for (var container of containers) {
        if (container && container.store[RESOURCE_ENERGY] > 250) {
          creep.memory.containerId = container.id;
          if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
          }
          return;
        }
      }

      const containersWithEnergy =
        roleUtility.containersWithEnergy(creepWorkData.energyStorageStructures);
      if (containersWithEnergy.length) {
        creep.memory.containerId = containersWithEnergy[0].id;
        if (creep.withdraw(containersWithEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(containersWithEnergy[0]);
        }
        return;
      }

      const source = Game.getObjectById(creep.memory.sourceId);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
};

module.exports = roleUpgrader;
