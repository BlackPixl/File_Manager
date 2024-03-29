const indexCtrl = {};
const { exec } = require("child_process");

const renderPage = (res, props) => {
  exec(
    "ls -p -l -A --group-directories-first | awk '{$2=$5=$6=$7=$8=\"\";print $0}'",
    { cwd: props.cwd },
    (err, stdout, stderr) => {
      if (err) {
        res.status(400);
        res.render("partials/error2.hbs", {stderr});
      } else {
        const regex = /([ld-])([r-][w-][x-])([r-][w-][x-])([r-][w-][x-]) +([^ ]+) +([^ ]+) +(.+)/g;
        var m;
        var files_folders = [];
        var indexCount = 0;
        while ((m = regex.exec(stdout)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          indexCount += 1;
          tempObject = {
            index: indexCount,
            usr_perm: m[2],
            group_perm: m[3],
            other_perm: m[4],
            usr: m[5],
            group: m[6],
            name: m[7],
          };
          if (m[1] == "d") {
            tempObject.folder = true;
            tempObject.type = "folder";
          } else {
            tempObject.folder = false;
            tempObject.type = "file";
          }
          files_folders.push(tempObject);
        }
        res.render("index", { files_folders, route: props.cwd});
      }
    }
  );
};

const executeCommand = (req, res, props) => {
  exec(props.command, { cwd: props.cwd }, (err, stdout, stderr) => {
    if (err) {
      res.status(400);
      res.render("partials/error2.hbs", {stderr});
    } else {
      renderPage(res, props);
    }
  });
};

indexCtrl.renderIndexGet = (req, res) => {
  props = { cwd: "/home/" };
  res.cookie("route", props.cwd);
  renderPage(res, props);
};

indexCtrl.renderIndexPost = (req, res) => {
  var props = {};
  var currentRoute = req.cookies.route;
  action = req.body.action;

  switch (action) {
    case "enter":
      currentRoute += req.body.folder;
      res.cookie("route", currentRoute);
      props = { cwd: currentRoute };
      renderPage(res, props);
      break;

    case "back":
      var currentRoute = req.cookies.route;
      const routeArray = currentRoute.split("/");
      routeArray.pop();
      routeArray.pop();
      routeArray.push("");
      currentRoute = routeArray.join("/");
      res.cookie("route", currentRoute);
      props = {
        cwd: currentRoute,
        command: "ls -p -A --group-directories-first",
      };
      renderPage(res, props);

      break;

    case "delete":
      var objectType = req.body.typeObject;
      if (objectType == "folder") {
        props = {
          cwd: req.cookies.route,
          command: `rm -rf '${req.body.nameObject}'`,
        };
      } else if (objectType == "file") {
        props = {
          cwd: req.cookies.route,
          command: `rm -f '${req.body.nameObject}'`,
        };
      }
      executeCommand(req, res, props);
      break;

    case "create_file":
      props = {
        cwd: req.cookies.route,
        command: `touch '${req.body.nameObject}'`
      };
      executeCommand(req, res, props);
      break;

    case "create_folder":
      props = {
        cwd: req.cookies.route,
        command: `mkdir '${req.body.nameObject}'`,
      };
      executeCommand(req, res, props);
      break;

    case "rename":
      var currentName = req.body.currentName;
      props = {
        cwd: req.cookies.route,
        command: `mv '${currentName}' '${req.body.newName}'`,
      };
      executeCommand(req, res, props);
      break;

    case "copy":
      props = {
        cwd: req.cookies.route,
        command: `cp -r '${req.body.name}' '${req.body.destination}'`,
      };
      executeCommand(req, res, props);
      break;

    case "move":
      props = {
        cwd: req.cookies.route,
        command: `mv '${req.body.name}' '${req.body.destination}'`,
      };
      executeCommand(req, res, props);
      break;

    case "change_permission":
      const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);
      const permissionParser = (element)=>{
        if (element) {
          if (Array.isArray(element)){
            return element.reduce(reducer);
          }else{
            return parseInt(element);
          }
        }else return 0;
      }
      usr_perm = permissionParser(req.body.listU);
      group_perm = permissionParser(req.body.listG);
      others_perm = permissionParser(req.body.listO);
      props = {
        cwd: req.cookies.route,
        command: `chmod ${usr_perm}${group_perm}${others_perm} '${req.body.name}'`,
      };
      executeCommand(req, res, props);
      break;

    case "change_owner":
      props = {
        cwd: req.cookies.route,
        command: `sudo chown '${req.body.user}' '${req.body.name}'`
      };
      executeCommand(req, res, props);
      break;

    default:
      res.status(400);
      res.render("partials/error2.hbs", {stderr: 'Unknown error'});
      break;
  }
};

module.exports = indexCtrl;
