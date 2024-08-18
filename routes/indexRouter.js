const { Router } = require("express");
indexRouter = Router();

const indexController = require("../controllers/indexController");

const links = [
    { href: "/", text: "Home" },
    { href: "/new", text: "Add new item" },
];

// middleware to inject data into request
indexRouter.use((req, res, next) => {
  req.links = links;
  next();
})

indexRouter.get("/", indexController.getAllPokemon);
indexRouter.get("/new", indexController.createPokemonGet);
indexRouter.post("/new", indexController.createPokemonPost);
indexRouter.get("/view/:id", indexController.viewPokemon);
indexRouter.get("/edit/:id", indexController.editPokemonGet);
indexRouter.post("/edit/:id", indexController.editPokemonPost);
indexRouter.post("/delete/:id", indexController.deletePokemon);
indexRouter.post("/search", indexController.searchPokemonPost);
indexRouter.get("/search", indexController.searchPokemonGet);

indexRouter.use((req, res, next) => {
  res.status(404);
  res.render("404", { title: "Oops!", links: req.links });
})

module.exports = indexRouter;