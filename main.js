// Setup
var fs = require('fs');
var path = require('path');

var GitHubApi = require("github");
var github = new GitHubApi();

// parse config file and student list
var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
var studentsData = (fs.readFileSync(path.join('/home/joe/projects/dma/', 'students')) + "").split("\n");
var students = studentsData.reduce(function (prev, e) {
    if (e !== "") {
        var splitUser = e.split(/\s/);
        prev[splitUser[0]] = splitUser[1];
    }
    return prev;
}, {});

// User authentication
if (config.token !== "") {
    github.authenticate({
        type: "token",
        token: config.token
    });
} else if (config.password !== "") {
    github.authenticate({
        type: "basic",
        username: config.username,
        password: config.password
    });
} else {
    console.log("Please provide a token or password in config.js");
    process.exit();
}

// API stuff, sorta works
var action = process.argv[2];
var repo = process.argv[3];

if (action === "close" || action === "open") {
    github.orgs.getTeams({
        org: config.organization,
        page: 1,
        per_page: 100
    }, getTeams);
} else {
    console.log("Invalid Operation");
}

function getTeams(err, res) {
    if (err) {
        return false;
    }
    for (var i = 0; i < res.length; i++) {
        if (students.hasOwnProperty(res[i].name)) {
            console.log('Opening/Closing repo for team:', res[i].name);
            github.orgs.addTeamRepo({
                id: res[i].id,
                org: config.organization,
                repo: res[i].name + "-" + repo,
                permission: (action === "close") ? "pull" : "push"
            }, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(res); 
                }
            });
        }
    }
    if (github.hasNextPage(res)) {
        github.getNextPage(res, getTeams)
    }
}
