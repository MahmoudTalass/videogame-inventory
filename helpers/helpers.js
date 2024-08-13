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
function multipleInsertsParameterization(numOfInserts) {
   result = [];

   currentParameter = 1;
   for (let i = 0; i < numOfInserts; i++) {
      result.push(`($${currentParameter}, $${currentParameter + 1})`);
      currentParameter += 2;
   }

   return result.join(", ");
}

function multipleDeleteParameterization(gameId, numOfDeletes, categoryIdColumnName) {
   result = [];

   currentParameter = 1;
   for (let i = 0; i < numOfDeletes; i++) {
      let str = `(game_id = ${gameId} AND ${categoryIdColumnName} = $${currentParameter})`;

      currentParameter += 2;
      if (i != numOfDeletes - 1) {
         str += " OR";
      }

      result.push(str);
   }

   return result.join(" ");
}

function pairGameWithCategory(gameId, categoryIdsArr) {
   result = [];

   categoryIdsArr.forEach((id) => {
      result.push(gameId);
      result.push(id);
   });

   return result;
}

module.exports = {
   getListDifferences,
   multipleInsertsParameterization,
   pairGameWithCategory,
   multipleDeleteParameterization,
};
