const indexCtrl = {};
const currentRoute = "/home/";
const { exec } = require("child_process");

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

const executeCommand = (req, res, props) => {
  exec(props.command, {cwd: props.cwd}, (err, stdout, stderr) =>{
    if (err){
      res.send('Error, por favor vuelve a a pagina principal');
    }else{
      exec(
        "ls -p -A --group-directories-first", { cwd: props.cwd }, (err, stdout, stderr) => {
          if (err) {
            res.send("error, por favor recarga la pagina");
          } else {
            renderPage(res, stdout, props.cwd);
          }
        }
      );
    }
  });
};

indexCtrl.renderIndexGet = (req, res) => {
  res.cookie("route", currentRoute);
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
};

indexCtrl.renderIndexPost = (req, res) => {
  var currentRoute = req.cookies.route;
  action = req.body.action;
  console.log(action);
  console.log(currentRoute);
  console.log(req.body);

  switch (action) {
    case "enter":
      currentRoute += req.body.folder;
      res.cookie("route", currentRoute);
      exec(
        "ls -p -A --group-directories-first",
        { cwd: currentRoute },
        (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            console.log(currentRoute);
            res.send("error, por favor recarga la pagina");
          } else {
            renderPage(res, stdout, currentRoute);
          }
        }
      );
      break;

    case "back":
      var currentRoute = req.cookies.route;
      console.log(currentRoute);
      const routeArray = currentRoute.split("/");
      routeArray.pop();
      routeArray.pop();
      routeArray.push("");
      currentRoute = routeArray.join("/");
      res.cookie("route", currentRoute);
      exec(
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
      );
      break;
    
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

    case 'rename':
      var currentName = req.body.currentName;
      console.log(req.body);
      const command = 'mv \''+currentName+'\' '+req.body.newName;
      props = {
        cwd : req.cookies.route,
        command : command};
      executeCommand(req, res, props);
      break;

    default:
      res.send("error, por favor recarga la pagina");
      break;
  }
};

module.exports = indexCtrl;
