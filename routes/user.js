const router = require("express").Router()

router.get("/usertest", (req, res) => {
    res.send("teste de usuario completado com sucesso");
});

router.post("/userposttest", (req, res) => {
    const username = req.body.username;
    res.send(`seu nome de usuario é ${username}`);
});

module.exports = router;