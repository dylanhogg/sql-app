const version = "v1.0.0";
const predictionUrl = "https://sql-api.infocruncher.com/predict/";
const randomInputs = [
        "SELECT test, id FROM foo, bar",
        "SELECT * FROM foo LIMIT 10 OFFSET 100",
        "SELECT a.* FROM product_a.users AS a\nJOIN product_b.users AS b\nON a.ip_address = b.ip_address",
        "SELECT t1.*, t2.* FROM table1 t1\nLEFT JOIN table2 t2 on t1.id = t2.id",
        "SELECT f.test FROM foo AS f",
        "SELECT u.id as userid, u.name, ud.address\nFROM User u\nLEFT JOIN UserDetail ud ON u.id = ud.id\nLIMIT 100 OFFSET 10"
    ]

var predict_count = 0;

$(document).ready(function () {
    var randomElement = randomInputs[Math.floor(Math.random() * randomInputs.length)];
    $("#input-text").val(randomElement)

    $("#clear-button").click(function(){
        $("#input-text").val("")
        $("#input-text").focus();
    });

    $("#random-button").click(function(){
        var randomElement = randomInputs[Math.floor(Math.random() * randomInputs.length)];
        $("#input-text").val(randomElement)
    });

    $("#view-debug-info").click(function(){
        $("#debug-response").toggle();
        return false;
    });

    $("#view-about-info").click(function(){
        var about = "Sql Query Parser App by Dylan Hogg\n" +
        "<a href='https://sql-app.infocruncher.com/'>sql-app.infocruncher.com</a>\n\n" +
        "I'm an app that extracts table and\ncolumn info from SQL queries using the\n<a href='https://github.com/macbre/sql-metadata'>sql-metadata</a> library\n\n" +
        "Source code available:\n<a href='https://github.com/dylanhogg/sql-app'>github.com/dylanhogg/sql-app</a>";
        $("#response").html(about)
        return false;
    });

//    $("#input-text").keypress(function (e) {
//      if (e.which == 13) {
//        $("#input-button").click();
//        return false;
//      }
//    });

    $("#input-button").click(function(){
        $("#debug-response").html("");
        $("#loader").addClass("loader");

        var input = $("#input-text").val();
        if (input.length == 0) {
            $("#response").html("Sql input is empty<br /><br />Experiment by clicking the Random button");
            $("#loader").removeClass("loader");
            return;
        }

        if (predict_count == 0) {
           $("#response").html("Parsing query...<br />...and waking up the server");
        } else {
           $("#response").html("Parsing query...");
        }

        var start = new Date().getTime();
        $.ajax({
           type: "POST",
           url: predictionUrl,
           data: '{"query": "'+input.replace(/(\r\n|\n|\r)/gm, " ") +'"}',
           tryCount : 0,
           retryLimit : 1,
           success: function(data)
           {
               $("#loader").removeClass("loader");
               predict_count++;
               var end = new Date().getTime();
               var time = end - start;

               var response = "<table class='response'>";
               response += "<tr><th>Key</th><th>Value(s)</th></tr>";
               var segments = data["result"];
               for (var key in segments){
                 var key_display = key.replace(/_/g, " ");
                 key_display = key_display.charAt(0).toUpperCase() + key_display.slice(1);
                 values = segments[key] == null ? "" : segments[key].toString().split(",").join("\n");
                 if (values != null && values != "")
                    response += "<tr><td>" + key_display + "</td><td>" + values + "</td></tr>";
               }
               response += "</table>";
               $("#response").html(response)

               var debugInfo = "\nDEBUG INFO:\nClient timing: " + time + "\n"
                                                    + "Retries: "+this.tryCount+"\n"
                                                    + "Success Reponse:\n"
                                                    + JSON.stringify(data, null, "  ");
               console.log(debugInfo);
               $("#debug-response").html(debugInfo)
           },
           error: function(data)
           {
               this.tryCount++;
               if (this.tryCount <= this.retryLimit) {
                   $("#response").html("Error, retry " + this.tryCount + " of " + this.retryLimit + "...");
                   $.ajax(this);
                   return;
               }
               var end = new Date().getTime();
               var time = end - start;

               $("#loader").removeClass("loader");
               $("#response").html("Oops, I didn't understand that<br /><br />Please check you entered valid SQL")

               var debugInfo = "\nDEBUG INFO:\nClient timing: " + time + "\n"
                                            + "Retries: "+this.tryCount+"\n"
                                            + "Error Reponse:\n"
                                            + JSON.stringify(data, null, "  ");
               console.log(debugInfo);
               $("#debug-response").html(debugInfo)
           },
         });
    });


    var start = new Date().getTime();
    $.ajax({
       type: "POST",
       url: predictionUrl,
       data: '{"query": "select prime from page"}',
       tryCount : 0,
       retryLimit : 1,
       success: function(data)
       {
            predict_count++;
            var end = new Date().getTime();
            var time = end - start;
            var debugInfo = "\nPRIME SUCCESS:\nClient timing: " + time + "\n"
                             + "Retries: "+this.tryCount+"\n"
                             + "Success Reponse:\n"
                             + JSON.stringify(data, null, "  ");
            console.log(debugInfo);
            $("#debug-response").html(debugInfo)
       },
       error: function(data)
       {
           this.tryCount++;
           if (this.tryCount <= this.retryLimit) {
               $("#response").html("Retry " + this.tryCount + "...");
               $.ajax(this);
               return;
           }
           var end = new Date().getTime();
           var time = end - start;

           var debugInfo = "\nPRIME ERROR:\nClient timing: " + time + "\n"
                            + "Retries: "+this.tryCount+"\n"
                            + "Error Reponse:\n"
                            + JSON.stringify(data, null, "  ");
           console.log(debugInfo);
           $("#debug-response").html(debugInfo)
       },
     });
});
