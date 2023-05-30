
const express = require ('express')
const router = express.Router()
const {auth, notAuth} = require ('../utils/authModules.js')
const {upload} = require('../utils/multer.js')
const user = require('../controllers/user.js')

//Rutas para el manejo de usuarios

router.get("/", auth, user.allUsers);

router.get("/:id", auth, user.userById);

router.post("/", notAuth, upload.single("avatar"), user.newUser2);

router.put("/:id", auth, user.modifyUser);

router.delete("/:id", notAuth, user.deleteUser);

router.post('/login',user.login)

router.get("/login", auth, user.userById);

module.exports = router;