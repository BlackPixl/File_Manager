const indexCtrl = {};
const { exec } = require("child_process");

const renderPage = (res, props) => {
  exec('ls -p -A --group-directories-first', {cwd: props.cwd}, (err, stdout, stderr) => {
    if (err) {
      res.send("error, por favor recarga la pagina");
    } else {
      var files_folders = [];
      elementos = stdout.split("\n");
      elementos.pop();
      var indexCount = 0;
      elementos.forEach((element) => {
        indexCount+=1;
        if (element.substr(-1) == "/") {
          files_folders.push({ type: "folder", name: element, folder: true, index: indexCount});
        } else {
          files_folders.push({ type: "file", name: element, folder: false, index: indexCount});
        }
      });
      res.render("index", { files_folders, route: props.cwd });
    }
  });
};

const executeCommand = (req, res, props) => {
  exec(props.command, {cwd: props.cwd}, (err, stdout, stderr) =>{
    if (err){
      res.send('Error, por favor vuelve a a pagina principal');
    }else{
      renderPage(res, props);
    }
  });
};

indexCtrl.renderIndexGet = (req, res) => {
  props = {cwd: '/home/'}
  res.cookie("route", props.cwd);
  renderPage(res, props);
};

indexCtrl.renderIndexPost = (req, res) => {
  var props = {};
  var currentRoute = req.cookies.route;
  action = req.body.action;
  
  switch (action) {
    case 'enter':
      currentRoute += req.body.folder;
      res.cookie("route", currentRoute);
      props = {cwd: currentRoute}
      renderPage(res, props);
      break;

    case 'back':
      var currentRoute = req.cookies.route;
      const routeArray = currentRoute.split("/");
      routeArray.pop();
      routeArray.pop();
      routeArray.push("");
      currentRoute = routeArray.join("/");
      res.cookie("route", currentRoute);
      props = {
        cwd: currentRoute,
        command: 'ls -p -A --group-directories-first'
      };
      renderPage(res, props);
      
      break;

    case 'delete':
      console.log('paso por delete');
      var objectType = req.body.typeObject;
      if (objectType == 'folder'){
        props = {
          cwd: req.cookies.route,
          command: 'rm -rf ' + req.body.nameObject
        };
      }else if (objectType == 'file'){
        props = {
          cwd: req.cookies.route,
          command: 'rm -f ' + req.body.nameObject
        };
      }
      executeCommand(req, res, props);
      break;

    case 'create_file':
      props = {
        cwd: req.cookies.route,
        command: 'touch ' + req.body.nameObject
      };
      executeCommand(req, res, props);
      break;

    case 'create_folder':
      props = {
        cwd: req.cookies.route,
        command: 'mkdir ' + req.body.nameObject
      };
      executeCommand(req, res, props);
      break;

    case 'rename':
      var currentName = req.body.currentName;
      props = {
        cwd : req.cookies.route,
        command : 'mv \''+currentName+'\' '+req.body.newName
      };
      executeCommand(req, res, props);
      break;

    default:
      res.send("error, por favor recarga la pagina");
      break;
  }
};

module.exports = indexCtrl;

/*OLD CODE */

/*
const renderPage = (res, stdout, currentRoute) => {
  var files_folders = [];
  elementos = stdout.split("\n");
  elementos.pop();
  var indexCount = 0;
  elementos.forEach((element) => {
    indexCount+=1;
    if (element.substr(-1) == "/") {
      files_folders.push({ type: "folder", name: element, folder: true, index: indexCount});
    } else {
      files_folders.push({ type: "file", name: element, folder: false, index: indexCount});
    }
  });
  res.render("index", { files_folders, route: currentRoute });
};
*/




  /*  
    case "delete":
      var currentRoute = req.cookies.route;
      var nameObject = req.body.nameObject;
      var objectType = req.body.typeObject;

      switch (objectType) {
        case "folder":
          exec(
            "rm -rf " + nameObject,
            { cwd: currentRoute },
            (err, stdout, stderr) => {
              if (err) {
                res.send("error al eliminar la carpeta");
              } else {
                exec(
                  "ls -p -A --group-directories-first",
                  { cwd: currentRoute },
                  (err, stdout, stderr) => {
                    if (err) {
                      // console.log(stderr);
                      // console.log("hola");
                      // console.log(err);
                      res.send("error, por favor recarga la pagina");
                    } else {
                      renderPage(res, stdout, currentRoute);
                    }
                  }
                );
              }
            }
          );
          break;

        case "file":
          exec(
            "rm -f " + nameObject,
            { cwd: currentRoute },
            (err, stdout, stderr) => {
              if (err) {
                res.send("error al eliminar el archivo");
              } else {
                exec(
                  "ls -p -A --group-directories-first",
                  { cwd: currentRoute },
                  (err, stdout, stderr) => {
                    if (err) {
                      // console.log(stderr);
                      // console.log("hola");
                      // console.log(err);
                      res.send("error, por favor recarga la pagina");
                    } else {
                      renderPage(res, stdout, currentRoute);
                    }
                  }
                );
              }
            }
          );
          break;
      }
      break;
*/


/* 
    case "create_file":
      var nameObject = req.body.nameObject;
      console.log(req.body);
      exec(
        "touch " + nameObject,
        { cwd: currentRoute },
        (err, stdout, stderr) => {
          if (err) {
            res.send("error al crear el archivo");
          } else {
            exec(
              "ls -p -A --group-directories-first",
              { cwd: currentRoute },
              (err, stdout, stderr) => {
                if (err) {
                  res.send("error, por favor recarga la pagina");
                } else {
                  renderPage(res, stdout, currentRoute);
                }
              }
            );
          }
        }
      );
      break;
*/

/*
    case "create_folder":
      var nameObject = req.body.nameObject;
      console.log(req.body);
      exec(
        "mkdir " + nameObject,
        { cwd: currentRoute },
        (err, stdout, stderr) => {
          if (err) {
            res.send("error al crear la carpeta");
          } else {
            exec(
              "ls -p -A --group-directories-first",
              { cwd: currentRoute },
              (err, stdout, stderr) => {
                if (err) {
                  res.send("error, por favor recarga la pagina");
                } else {
                  renderPage(res, stdout, currentRoute);
                }
              }
            );
          }
        }
      );

      break;
*/

/*exec(
        "ls -p -A --group-directories-first",
        { cwd: currentRoute },
        (err, stdout, stderr) => {
          var files_folders = [];
          if (err) {
            res.send("error, por favor recarga la pagina");
          } else {
            renderPage(res, stdout, currentRoute);
          }
        }
      );*/