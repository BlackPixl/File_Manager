
// const { exec } = require('child_process');
const { Router } = require("express");
const router = Router();
const { renderIndexGet, renderIndexPost } = require("../controllers/index.controller");

const currentRoute = '/home/';

router.get("/", renderIndexGet);

router.post("/", renderIndexPost);

module.exports = router;
