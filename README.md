# abe-deployer-git
An Abe deployer for your Git repositories and static websites

##Introduction
This plugin is a Git deployer for your Abe blog. Once you've created your git repository, just install this plugin with Abe and fill in the parameters.

Everytime you'll publish/unpublish a content, your blog will be sync'ed 

## Configuration
In abe.json, you must have this entry:

```
"deployers": {
  "git": {
    "active":true,
    "repository": "https://github.com/gregorybesson/abegittest.git",
    "branch": "master",
    "username": "gregorybesson",
    "email": "mymail@domain.com"
  }
}
```
If you want to deactivate the sync, set active as ```false.```
