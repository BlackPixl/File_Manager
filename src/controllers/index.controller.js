const indexCtrl = {};
const currentRoute = "/home/";
const { exec } = require("child_process");

// indexCtrl.renderIndex = (req, res) => {
//   res.render("index");
// };

indexCtrl.renderIndexGet = (req, res) => {
  res.cookie("route", currentRoute);
  exec(
    "ls -p -A --group-directories-first",
    { cwd: currentRoute },
    (err, stdout, stderr) => {
      var files_folders = [];
      if (err) {
        console.log(stderr);
        console.log("hola");
        console.log(err);
        res.send("error, por favor recarga la pagina");
      } else {
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
      res.send("Pagina en construccion");
      break;

    case "create":
      res.send("Pagina en construccion");

    default:
      res.send("error, por favor recarga la pagina");
      break;
  }
};

module.exports = indexCtrl;
