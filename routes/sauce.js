const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const sauceCtrl = require("../controllers/sauce");
const multer = require('../middlewares/multer-config')

//Route pour recuperer toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauce);

//Route pour creer une sauce
router.post("/", auth, multer, sauceCtrl.createSauce);

//Route pour recuperer une sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);

//Route pour modifier une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

//Route pour supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//Route pour display les likes/dislikes
router.post("/:id/like", auth, sauceCtrl.likeSauce)

module.exports = router;