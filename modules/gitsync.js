var Promise = require('es6-promise').Promise
var path = require('path')
var moment = require('moment')
var spawn = require('child_process').spawn

function gitsync(abe) {
  this.deployPath = path.join(abe.config.root, abe.config.publish.url);
  if(abe.config.deployers && abe.config.deployers.git){
    var elt = abe.config.deployers.git
    this.repository = (elt.hasOwnProperty("repository"))?elt.repository:""
    this.branch = (elt.hasOwnProperty("branch"))?elt.branch:"master"
    this.username = (elt.hasOwnProperty("username"))?elt.username:""
    this.email = (elt.hasOwnProperty("email")) ? elt.email : ""
    this.relativePath = (elt.hasOwnProperty("relativePath"))?elt.relativePath:""
  }
}

gitsync.prototype.git = function() {
  var len = arguments.length
  var args = new Array(len)
  var deployPath = this.deployPath
  for (var i = 0; i < len; i++) {
    args[i] = arguments[i];
  }

  var p = new Promise(function(resolve, reject) {
    var child = spawn('git', args, {cwd: deployPath});

    child.stdout.on('data', function (data) {
        resolve
    })

    child.stderr.on('data', function (data) {
        console.log(data)
        reject
    })

    child.on('close', function (code) {
        resolve(code)
    })
  });

  return p
}

gitsync.prototype.publish = function(repo) {

  return this.pull().then(function(data){
    return this.add().then(function(data){
      return this.commit().then(function(){
        return this.push(repo).then(function(data){
        }.bind(this)).catch(function(e){
          console.log('error: ' + e);
        })
      }.bind(this)).catch(function(e){
        console.log('error: ' + e);
      })
    }.bind(this))
  }.bind(this)).catch(function(e){
    console.log('error: ' + e);
  })
}

gitsync.prototype.add = function() {

  return this.git('add', '-A')
}

gitsync.prototype.commit = function() {
  var message = 'Site updated: ' + moment().format('YYYY-MM-DD HH:mm:ss');

  return this.git('commit', '-m', message)
}

gitsync.prototype.push = function() {
  return this.git('push', '-u', this.repository, 'HEAD:'+this.branch, '--force')
}

gitsync.prototype.pull = function() {
  return this.git('pull')
}

gitsync.prototype.setup = function () {
  return this.git('init').then(function(data){
    return this.git('config', 'user.name', this.username).then(function(data){
      return this.git('config', 'user.email', this.email)
    }.bind(this)).catch(function(e){
      console.log('error: ' + e);
    })
  }.bind(this)).catch(function(e){
    console.log('error: ' + e);
  })
};

module.exports = gitsync;
