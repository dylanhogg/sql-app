const version = "v1.0.0";
const predictionUrl = "https://sql-api.infocruncher.com/predict/";
const randomInputs = [
        "SELECT test, id FROM foo, bar",
        "SELECT * FROM foo",
        "SELECT a.* FROM product_a.users AS a JOIN product_b.users AS b ON a.ip_address = b.ip_address",
        "SELECT f.test FROM foo AS f"
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
    });

    $("#input-text").keypress(function (e) {
      if (e.which == 13) {
        $("#input-button").click();
        return false;
      }
    });

    $("#input-button").click(function(){
        $("#debug-response").html("");
        $("#loader").addClass("loader");

        var input = $("#input-text").val();
        if (input.length == 0) {
            $("#response").html("Sql input is empty.<br />Experiment with the Random button.");
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
           data: '{"query": "'+input+'"}',
           tryCount : 0,
           retryLimit : 1,
           success: function(data)
           {
               $("#loader").removeClass("loader");
               predict_count++;
               var end = new Date().getTime();
               var time = end - start;

               var response = "<table class='response'>";
               var segments = data["result"];
               for (var key in segments){
                 var key_display = key.replace(/_/g, " ");
                 key_display = key_display.charAt(0).toUpperCase() + key_display.slice(1);
                 response += "<tr><td>" + key_display + "</td><td>" + segments[key] + "</td></tr>";
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
               $("#response").html("Oops, something went wrong<br />Please try again")

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
