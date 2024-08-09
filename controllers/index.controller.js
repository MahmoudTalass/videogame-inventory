const asyncHandler = require("express-async-handler");
const { IndexService } = require("../db/query");

const getInventoryCount = asyncHandler(async (req, res) => {
   const inventoryCount = await IndexService.getInventoryCount();

   res.render("index", { title: "Home", inventoryCount });
});

module.exports = {
   getInventoryCount,
};
