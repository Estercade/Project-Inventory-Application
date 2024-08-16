const { Router } = require("express");
indexRouter = Router();

const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.getAllPokemon);
indexRouter.get("/new", indexController.createPokemonGet);
indexRouter.post("/new", indexController.createPokemonPost);
indexRouter.get("/view/:id", indexController.viewPokemon);

module.exports = indexRouter;