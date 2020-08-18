'use strict';

var fs = require('fs');
var path = require('path');

var route = function route(req, res, next, abe) {
  if(req.query.active != null){
    var json = {deployers:{git:{active: (req.query.active === 'true')?true:false, repository: req.query.repository, branch: req.query.branch, username: req.query.username, email: req.query.email, relativePath: req.query.relativePath}}}
    abe.config.extend(json)
    res.json({'ok': 'ok'})
    return;
  }

  var data = path.join(__dirname + '/../../partials/configuration.html')
  var html = abe.coreUtils.file.getContent(data);
  var template = abe.Handlebars.compile(html, {noEscape: true})
  var tmp = template({
    manager: {config: JSON.stringify(abe.config)},
    config: abe.config,
    user: res.user,
    isPageConfigGit: true
  })
  res.send(tmp);

  return
}

exports.default = route
