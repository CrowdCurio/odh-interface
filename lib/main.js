//  file:   main.js
//  author: Linhai Yin
//  desc:   root file for bundling the Form Interface
var CrowdCurioClient = require('crowdcurio-client');
require('./odh-test');

global.csrftoken = $("[name='csrfmiddlewaretoken']").val();

// set UI vars
var DEV = window.DEV;
var task = window.task || -1;
var user = window.user || -1;
var experiment = window.experiment || -1;
var condition = window.condition|| -1;
var containerId = window.container || 'task-container';
containerElement = $('#' + containerId);

console.log(DEV);
console.log(task);
console.log(user);
console.log(experiment);
console.log(condition);
console.log(containerId);

var apiClient = new CrowdCurioClient();
var config = {
    apiClient: apiClient,
};

containerElement.ODHInterface(config);
Interface = containerElement.data('crowdcurio-ODHInterface');
