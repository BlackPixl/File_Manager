
const { exec } = require('child_process');
const { Router } = require("express");
const { stdout, stderr } = require('process');
const router = Router();

const { renderIndex } = require("../controllers/index.controller");




router.get("/", (req,res)=>{
    const currentRoute = '/home';
    res.cookie('route' , currentRoute);
    console.log('req Cookies: ', req.cookies);
    console.log('res Cookies: ', res.cookies);
    exec('ls -p -A --group-directories-first', {cwd:currentRoute}, (err, stdout, stderr) => {
        var files_folders = []
        if (err){
            res.send('error, por favor recarga la pagina');
        }
        else{
            elementos = stdout.split('\n');
            elementos.pop();
            elementos.forEach(element => {
                if (element.substr(-1)=='/'){
                    files_folders.push({type:'folder', name:element, folder:true});
                }else{
                    files_folders.push({type:'file', name:element, folder:false});
                }
            });
            res.render("index", {files_folders, route:currentRoute});
        }
    });
});

router.post("/", (req,res)=>{
    currentRoute = req.cookies.route;
    console.log(req.query)
    const action = req.query.action;
    res.send(currentRoute);
});

module.exports = router;
