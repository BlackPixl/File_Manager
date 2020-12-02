const indexCtrl = {};
const currentRoute = "/home/";
const { exec } = require("child_process");

// indexCtrl.renderIndex = (req, res) => {
//   res.render("index");
// };

const renderPage = (res, stdout) => {
  console.log(stdout);
  var files_folders = [];
  elementos = stdout.split("\n");
  elementos.pop();
  elementos.forEach((element) => {
    if (element.substr(-1) == "/") {
      files_folders.push({ type: "folder", name: element, folder: true });
    } else {
      files_folders.push({ type: "file", name: element, folder: false });
    }
  });
  res.render("index", { files_folders, route: currentRoute });
};

indexCtrl.renderIndexGet = (req, res) => {
  res.cookie("route", currentRoute);
  exec(
    "ls -p -A --group-directories-first",
    { cwd: currentRoute },
    (err, stdout, stderr) => {
      if (err) {
        console.log(stderr);
        console.log("hola");
        console.log(err);
        res.send("error, por favor recarga la pagina");
      } else {
        renderPage(res, stdout);
      }
    }
  );
};

indexCtrl.renderIndexPost = (req, res) => {
  var currentRoute = req.cookies.route;
  action = req.body.action;
  console.log(action);
  console.log(currentRoute);
  switch (action) {
    case "enter":
      currentRoute += req.body.folder;
      res.cookie("route", currentRoute);
      exec(
        "ls -p -A --group-directories-first",
        { cwd: currentRoute },
        (err, stdout, stderr) => {
          var files_folders = [];
          if (err) {
            console.log(err);
            console.log(currentRoute);
            res.send("error, por favor recarga la pagina");
          } else {
            elementos = stdout.split("\n");
            elementos.pop();
            elementos.forEach((element) => {
              if (element.substr(-1) == "/") {
                files_folders.push({
                  type: "folder",
                  name: element,
                  folder: true,
                });
              } else {
                files_folders.push({
                  type: "file",
                  name: element,
                  folder: false,
                });
              }
            });
            res.render("index", { files_folders, route: currentRoute });
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
            elementos = stdout.split("\n");
            elementos.pop();
            elementos.forEach((element) => {
              if (element.substr(-1) == "/") {
                files_folders.push({
                  type: "folder",
                  name: element,
                  folder: true,
                });
              } else {
                files_folders.push({
                  type: "file",
                  name: element,
                  folder: false,
                });
              }
            });
            res.render("index", { files_folders, route: currentRoute });
          }
        }
      );
      break;
    case "delete":
      var currentRoute = req.cookies.route;
      var nameObject = req.body.name;
      var objectType = req.body.type;
      console.log(nameObject)
      console.log(objectType)

      switch (objectType) {
        case 'folder':
          console.log("estamos en el delete")
          exec(
            "rm -rf " + nameObject,
            { cwd: currentRoute },
            (err, stdout, stderr) => {
              if (err) {
                res.send("error al eliminar carpeta");
              } else {
                exec(
                  "ls -p -A --group-directories-first",
                  { cwd: currentRoute },
                  (err, stdout, stderr) => {
                    if (err) {
                      console.log(stderr);
                      console.log("hola");
                      console.log(err);
                      res.send("error, por favor recarga la pagina");
                    } else {
                      renderPage(res, stdout);
                    }
                  }
                );
              }
            }
          );
        break

      }
      break;

    case "create":
      res.send("Pagina en construccion");

    default:
      res.send("error, por favor recarga la pagina");
      break;
  }
};

module.exports = indexCtrl;
