/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class RunecairnActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();
    const actorData = this.data; // Not sure actorData is to spec.
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
    if (actorData.type === 'npc') this._prepareNpcData(actorData);
    if (actorData.type === 'container') this._prepareContainerData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    if(actorData.items) {
      console.log('Item Data: ', actorData.items);
      actorData.items.filter((item) => {
        console.log('In Filter: ', item, 'type:', item.type);
        return item.type == 'armor' || item.type == 'item'
      }).map(item => {
        console.log(item, 'In Map: ', item.data.data.armor * item.data.data.equipped);
        return item.data.data.armor * item.data.data.equipped
      })
    }
    data.def = actorData.items
      .filter((item) => item.type == 'armor' || item.type == 'item')
      .map((item) => item.data.data.armor * item.data.data.equipped)
      .reduce((a, b) => a + b, 0);
    console.log('Result of def: ', data.def);
    data.slotsUsed = calcSlotsUsed(this.items);

    data.encumbered = data.slotsUsed >= 10;

    if (data.encumbered) {
      data.hp.value = 0;
    }
    if (data.def > 3) {
      data.def = 3;
    }
  }

  _prepareNpcData(actorData) {
    const data = actorData.data;

    let itemDef = actorData.items
      .filter((item) => item.type == 'armor' || item.type == 'item')
      .map((item) => item.data.data.armor * item.data.data.equipped)
      .reduce((a, b) => a + b, 0);

    data.def = Math.max(itemArmor, data.def);
    if (data.def > 3) {
      data.def = 3;
    }
  }

  _prepareContainerData(actorData) {
    const data = actorData.data;
    data.slotsUsed = calcSlotsUsed(this.items);
  }

  /** @override */
  getRollData() {
    const data = super.getRollData();
    // Let us do @str etc, instead of @abilities.str.value
    for (const [k, v] of Object.entries(data.abilities)) {
      if (!(k in data)) data[k] = v.value;
    }
    return data;
  }

  getOwnedItem(itemId) {
    return this.getEmbeddedDocument('Item', itemId);
  }

  createOwnedItem(itemData) {
    this.createEmbeddedDocuments('Item', [itemData]);
  }

  /** No longer an override as deleteOwnedItem is deprecated on type Actor */
  deleteOwnedItem(itemId) {
    const item = this.items.get(itemId);
    const currentQuantity = item.data.data.quantity;
    if (item) {
      if (currentQuantity > 1) {
        item.update({
          'data.quantity': currentQuantity - 1,
        });
      } else {
        item.delete();
      }
    } else {
      ui.notifications.error('Cannot find Item to delete.');
    }
  }
}

function calcSlotsUsed(actorItems) {
  const milliSlots = actorItems
    .map((item) => {
      const milliSlots = item.data.data.slots * 1000;
      const itemSlotPercentage = (item.data.data.quantity || 1) * milliSlots;
      return Math.trunc(itemSlotPercentage);
    })
    .reduce((memo, slots) => memo + slots, 0);
  return milliSlots / 1000;
}
