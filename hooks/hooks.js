'use strict';
var path = require('path');
var fs = require('fs');

var gitsync = require('../modules/gitsync');

var hooks = {
  afterPublish: function (postPath, result, abe) {
    if(abe.config.deployers && abe.config.deployers.git && abe.config.deployers.git.active === true){

      var git = new gitsync(abe)
      var baseDir = path.join(abe.config.root, abe.config.publish.url);
      if (abe.config.deployers.git.relativePath && abe.config.deployers.git.relativePath != '') {
        baseDir = path.join(abe.config.root, abe.config.deployers.git.relativePath);
      }

      var deployDir = path.join(baseDir, '.git');

      fs.exists(deployDir, (exists) => {
        if (!exists) {
          git.setup().then(function(){
            git.publish().then(function(data){
              console.log('git publish done')
            })
          })
        } else {
          git.publish('').then(function(data){
            console.log('git publish done')
          })
        }
      })
    }

    return result;
  },
  afterUnpublish: function (pathFile, postPath, json, abe) {
    if(abe.config.deployers && abe.config.deployers.git && abe.config.deployers.git.active){

      var git = new gitsync(abe)
      var baseDir = path.join(abe.config.root, abe.config.publish.url);
      if (abe.config.deployers.git.relativePath && abe.config.deployers.git.relativePath != '') {
        baseDir = path.join(abe.config.root, abe.config.deployers.git.relativePath);
      }
      var deployDir = path.join(baseDir, '.git');

      fs.exists(deployDir, (exists) => {
        if (!exists) {
          git.setup().then(function(){
            git.publish().then(function(data){
              console.log('git unpublish done')
            })
          })
        } else {
          git.publish('').then(function(data){
            console.log('git unpublish done')
          })
        }
      })
    }

    return pathFile;
  }
};

exports.default = hooks;
