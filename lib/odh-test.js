var jQuery = require('jquery');
var $ = jQuery;
require('jquery-ui-browserify');


$.widget('crowdcurio.ODHInterface', {
    
    options: {
        apiClient: undefined,
         config:{}
    },
    
    _create: function() {
        
        var that = this;
        
        // 1. initialize the config
        this.options.config = window.config;

        // 1.5. make sure we have a mode set
        this.options.config.mode = this.options.config.mode || 'static'; // default to static

        // 3. init the api client
        var apiClient = that._getApiClient();
        console.log(window);
        apiClient.init({
            user: window.user,
            task: window.task,
            experiment: window.experiment,
            condition: window.condition,
            configuration: window.config
        });
        
        var ele = $("#main");
        apiClient.help_request.build(ele);
    },
    
    
    
    _getApiClient: function() {
        var that = this;
        return that.options.apiClient;
    },
    
    _createStaticHTMLContainers: function() {
        var that = this;
        var content= ' \
<div id="d4o-container" > \
    <div id="header"> \
    </div> \
    <div id="nav-bar" class="nav-bar"> \
    </div> \
    <div id="submit-a-dive" class="submit-a-dive"> \
        <form id="submit-a-dive-form"> \
        </form> \
        <button id="submit-btn" class="btn submit-btn waves-effect waves-light" name="action" style="margin-left: auto; margin-right: auto; display: block;">Submit\
            <i class="material-icons right">send</i>\
        </button>\
    </div> \
    <div id="your-dives" style="display: none;"> \
    </div> \
</div> \
        ';
        
        $(that.element).html(content);
    },
    
    
    
    _renderNavBar: function() {
        
        var that = this;
        
        /*
         * 
         * Nav Bar Section
         * 
         */
        
        var sub_a_dive = $('<a>').attr('class', "nav-bar").text("Submit a Dive").appendTo('#nav-bar');
        sub_a_dive.attr('style', "color: #FFFFFF;");
        sub_a_dive.attr('id', "submit-a-dive-nav");
        sub_a_dive.click(function(e) {
            $('#submit-a-dive-nav').attr('style', "font-size: 25pt; color: #FFFFFF;");
            $('#your-dives-nav').attr('style', "font-size:20pt; color: #039be5;");
            $('#submit-a-dive').attr('style', that.sub_a_dive_active_style);
            $('#your-dives').attr('style', that.your_dives_inactive_style);
        });
        
        var your_dives = $('<a>').attr('class', "nav-bar").text("Your Dives").appendTo('#nav-bar');
        your_dives.attr('style', "font-size: 20pt;");
        your_dives.attr('id', 'your-dives-nav');
        your_dives.click(function(e) {
            $('#your-dives-nav').attr('style', "font-size: 25pt; color: #FFFFFF;");
            $('#submit-a-dive-nav').attr('style', "font-size:20pt; color: #039be5;");
            $('#submit-a-dive').attr('style', that.sub_a_dive_inactive_style);
            $('#your-dives').attr('style', that.your_dives_active_style);
        });
        
    },
    
    _renderInputForm: function(data) {
        
        that = this;
        
        // create the dive which holds everything
        var div = $("<div>").appendTo("#submit-a-dive-form");
        div.addClass("d40");
        
        // for each element we want to put into the div
        $.each(data.content, function(k, element) {
            
            // Generate the question before the DOM element
            if(typeof element.question !== 'undfined' && element.question) {
                div.append(element.question);
            }
            
            // Generate the DOM element
            if(typeof element.html === 'undefined' || !element.html) {
                console.log("ERROR: " + data.slug + " did not have an html tag");
            }
            var domObj = $("<" + element.html + ">").appendTo(div);
            domObj.attr('id', data.slug);
            
            // Set up the attributes
            $.each(element.headers, function(i, header) {
                domObj.attr(i, header);
            });
            
            domObj.append(element.content);
           
            that._submit_forms.push(domObj);
            
        });
        
        
    },
    
    _renderYourDives : function() {
        var that = this;
        
        var headers = [];
        var temp = that._submit_forms;
        
        var apiClient = that._getApiClient();
        // create table to hold the data
        // for/.each
        var table = $("<table>").appendTo("#your-dives");
        table.attr('id', 'your-dives-table');
        
        var thead = $("<thead>").appendTo(table);
        
        var headerList = $("<tr>").appendTo(thead);
        // Get the data items
        
        $.each(that._submit_forms, function(i, form) {
            
            headers.push(form[0].id);
            headerList.append("<th>" + form[0].id + "</th>");
        });
        
        // load the data into the table
        apiClient.listAll('response', {},function(data) {
            that._fillPrevDiveTable(data, headers);
        });
        
        // graph it somehow?
        // find a library?
        
        
    },
    
    _fillPrevDiveTable : function(data, headers) {
        var tbody = $("<tbody>").appendTo("#your-dives-table");
        
        data.forEach(function(ele) {
            var tableRow = $("<tr>").appendTo(tbody);
            headers.forEach(function(header) {
                tableRow.append("<td>" + ele.content[header] + "</td>");
            });
        });
    },
    
    _submitResponse: function(e) {
    
        var that = this;
        
        var headers = []
        var content = {}
        
        that._submit_forms.forEach(function(form) {
            console.log(form);
            content[form[0].id] = form.val();
            headers.push(form[0].id);
        });
        
        console.log(headers);
        
        // save a response through the api client

        var apiClient = that._getApiClient();
        apiClient.create('response', {
                content: content
            }, function(result){
                that._responseSubmitted(headers);
        });
        // for testing the UI only
        //that._responseSubmitted(headers);
        
    },
    
    _responseSubmitted : function(headers) {
        that = this;
        $('#your-dives-nav').attr('style', "font-size: 25pt; color: #FFFFFF; display: none;");
        $('#submit-a-dive-nav').attr('style', "font-size:20pt; color: #039be5; display: none;");
        $('#submit-a-dive').attr('style', that.sub_a_dive_inactive_style);
        $('#your-dives').attr('style', that.your_dives_active_style);
        
        $("#your-dives").html("");
        that._renderYourDives();
        
    }
    
});
