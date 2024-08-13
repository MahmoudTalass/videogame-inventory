function getListDifferences(updatedList, oldList) {
   const toBeAdded = new Set();
   const toBeDeleted = new Set();

   let i = 0;

   while (i < updatedList.length || i < oldList.length) {
      if (i < oldList.length && !updatedList.includes(oldList[i])) {
         toBeDeleted.add(oldList[i]);
      }

      if (i < updatedList.length && !oldList.includes(updatedList[i])) {
         toBeAdded.add(updatedList[i]);
      }

      i++;
   }

   return {
      toBeAdded: [...toBeAdded],
      toBeDeleted: [...toBeDeleted],
   };
}
function multipleInsertsParameterization(gameId, numOfInserts) {
   result = [];

   for (let i = 1; i < numOfInserts + 1; i++) {
      result.push(`(${gameId}, $${i})`);
      currentParameter += 2;
   }

   return result.join(", ");
}

function multipleDeleteParameterization(gameId, numOfDeletes, categoryIdColumnName) {
   result = [];

   for (let i = 1; i < numOfDeletes + 1; i++) {
      let str = `(game_id = ${gameId} AND ${categoryIdColumnName} = $${i})`;

      if (i != numOfDeletes - 1) {
         str += " OR";
      }

      result.push(str);
   }

   return result.join(" ");
}

module.exports = {
   getListDifferences,
   multipleInsertsParameterization,
   multipleDeleteParameterization,
};
