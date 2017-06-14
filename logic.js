var locationKey = "";
var yodaSays = "";
var currentTemp = "";
var insideZipCodes = [];
var yodaParameters = "";
var zipcode = "";
var locationParameters = "";
var longPhrase = "";
var cityForWeather;
var stateForWeather;



////////////////////
// CODE FOR MODAL //
///////////////////


// Loads modal on DOM load
$(document).ready(function() {
    var overlay = $('<div id="overlay"></div>');
    overlay.show();
    overlay.appendTo(document.body);
    $('#zipCodeModal').show();

})

// Closes modal when clicking 'x' in upper-right corner of modal
$(".close").on("click", function() {

    $(".modal").hide();

});

// Closes modal if clicking outside of modal
$(document).mouseup(function(e) {
    var container = $(".modal-content");

    // if the target of the click isn't the container nor a descendant of the container, closes modal
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(".modal").hide();
    }
});


// Prevents modal from popping up if clicking on search in menu bar of main page
$('#menuZipInput').on("click", function() {

    event.preventDefault();
})



/////////////////////////
// Start of functions //
/////////////////////////

// location parameters for accuweather API


// Queries accuweather to get the local weather keycode
function local() {


    $.ajax({
        url: "https://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=cEXLg1f8FSe8se6GUurGnlmIVmuXmaWy&" + locationParameters,
        method: "GET",
    }).done(function(res) {
        // console.log(res);

        if (res.length == 0) {

            var overlay = $('<div id="overlay"></div>');
            overlay.show();
            overlay.appendTo(document.body);
            $('#zipCodeModal').show();
            $('#error-message').html("Please enter a valid zip code.");
            $("#modalzip").val("");
        } else {

            // console.log(res[0].Key);
            locationKey = res[0].Key;
            cityForWeather = res[0].LocalizedName;
            stateForWeather = res[0].AdministrativeArea.ID;
            // console.log(res);

        }



        //Calls 'forecast' function to translate key into local weather
        forecast();


    });


} // end of location




////////////////////


// Function gets uses key from 'local' function to get a weather forecast phrase
function forecast() {

    $.ajax({
        url: "https://dataservice.accuweather.com/forecasts/v1/daily/1day/" + locationKey + "?apikey=cEXLg1f8FSe8se6GUurGnlmIVmuXmaWy&details=true",
        method: "GET"
    }).done(function(results) {
        // console.log('Long Phrase' + results.DailyForecasts[0].Day.LongPhrase);

        // var longPhraseTestForWalmart = results.DailyForecasts[0].Day.LongPhrase;

        // Creates argument to pass through 'setSentence' function
        setSentence(results.DailyForecasts[0].Day.LongPhrase);
        // console.log(results.DailyForecasts[0]);
        // longPhrase = results.DailyForecasts[0].Day.LongPhrase;

        yoda();
        current();


    });


} //end of forecast

// Function gets current temperature for location
function current() {

    $.ajax({
        url: "https://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=cEXLg1f8FSe8se6GUurGnlmIVmuXmaWy&details=true",
        method: "GET"
    }).done(function(results) {

        currentTemp = results[0].ApparentTemperature.Imperial.Value;
        // console.log(currentTemp);
        // dtag = $("<div>");
        // $("#currentTemp").html("The current temperature is " + currentTemp + " degrees F");
        // $("h5").before(dtag);

    });



} // end of current

// Function queries Yoda API with weather and prints out forecast to html
function yoda() {

    // Loading image while api is loading
    var overlayForLoad = $('<div id="overlayForLoad"></div>');
    overlayForLoad.show();
    overlayForLoad.appendTo(document.body);
    $('#overlayForLoad').show();
    $('#overlayForLoad').html('<img id="loader-img" alt="yoda-fall" src="https://s-media-cache-ak0.pinimg.com/originals/61/ca/fe/61cafec1c48330268b36c84f9d2e8d78.gif" />');

    // AJAX request for Yoda speak
    $.ajax({
        url: "https://yoda.p.mashape.com/yoda?" + yodaParameters,
        method: "GET",
        headers: {
            "X-Mashape-Key": "ZUBst7R9scmshkIA9gXIoj9rqTicp1P3NC7jsnaceAAHyIv6iN",
            "Accept": "text/plain",

        }
    }).done(function(res) {

        //setTimeout function to delay display of weather and walmart api results after query is finished
        setTimeout(function() {
            $('#overlayForLoad').remove();
            $("#currentTemp").html(currentTemp + " degrees &#8457; is the current temperature");
            $('#firstSentence').html("<h2>For " + cityForWeather + ", " + stateForWeather + " is the weather:</h2><br>");
            $('h5').html(res);

            //start of conditional statments to display appropriate weather suggestions
            if (res.toLowerCase().search("cold") != -1 || currentTemp > "50" && currentTemp <= "69") {
                var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=f22q84qndgwhpaybz9vbwuez&query=550550283"
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).done(function(response) {
                    //   console.log("------")
                    // console.log(response);
                    // console.log(response.Runtime);
                    // console.log('Response.items: ' + response.items[0].productUrl);

                    $("#walmartHeader").html("<p> Cold as Hoth out there it is- On sale here's a " + response.items[0].name + ". </p>");
                    $("#walmartImage").html("<a href='" + response.items[0].productUrl + "'><img src='" + response.items[0].largeImage + "' height='200'></a>");
                });
            }
            //api call for umbrella 
            if (res.toLowerCase().search("rain") != -1 || res.toLowerCase().search("shower") != -1) {
                var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=f22q84qndgwhpaybz9vbwuez&query=907920686"
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).done(function(response) {
                    //   console.log("------")
                    // console.log(response);
                    // console.log(response.Runtime);
                    // console.log('Response.items: ' + response.items[0].productUrl);

                    $("#walmartHeader").html("<p> Raining like Kamino outside it is - Here's a " + response.items[0].name + " on sale. </p>");
                    $("#walmartImage").html("<a href='" + response.items[0].productUrl + "'><img src='" + response.items[0].largeImage + "' height='200'></a>");
                });
            }
            //api call for sunscreen 
            if (res.toLowerCase().search("hot") != -1 || res.toLowerCase().search("sun") != -1 && currentTemp > "80") {
                var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=f22q84qndgwhpaybz9vbwuez&query=51023409"
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).done(function(response) {
                    //   console.log("------")
                    // console.log(response);
                    // console.log(response.Runtime);
                    // console.log('Response.items: ' + response.items[0].productUrl);

                    $("#walmartHeader").html("<p> Hot as Tattoine outside it is - Here's some " + response.items[0].name + " on sale. </p>");
                    $("#walmartImage").html("<a href='" + response.items[0].productUrl + "'><img src='" + response.items[0].largeImage + "' height='200'></a>");
                });
            }


            //api call for heavy jacket
            if (currentTemp < "50") {
                var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=f22q84qndgwhpaybz9vbwuez&query=172428887"
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).done(function(response) {
                    //   console.log("------")
                    // console.log(response);
                    // console.log(response.Runtime);
                    // console.log('Response.items: ' + response.items[0].productUrl);

                    $("#walmartHeader").html("<p> Like Bespin out it is- Here's a " + response.items[0].name + " on sale. </p>");
                    $("#walmartImage").html("<a href='" + response.items[0].productUrl + "'><img src='" + response.items[0].largeImage + "' height='200'></a>");
                });
            }


            //api call for t-shirt
            if (res.toLowerCase().search("cool") != -1 || currentTemp > "70" && currentTemp < "80") {
                var queryURL = "https://api.walmartlabs.com/v1/search?apiKey=f22q84qndgwhpaybz9vbwuez&query=122586015"
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).done(function(response) {
                    //   console.log("------")
                    // console.log(response);
                    // console.log(response.Runtime);
                    // console.log('Response.items: ' + response.items[0].productUrl);

                    $("#walmartHeader").html("<p> Pleasant and temperate like Naboo out it is, - Here's a " + response.items[0].name + " on sale. </p>");
                    $("#walmartImage").html("<a href='" + response.items[0].productUrl + "'><img src='" + response.items[0].largeImage + "' height='200'></a>");
                });
            }

        }, 3000);
        // console.log(res);
        // console.log('finding word "sun":' + res.toLowerCase().indexOf("sun"));

    });



} // end of yoda



function setSentence(yodaSays) {
    yodaParameters = $.param({

        sentence: yodaSays

    });
}

function setLocal(zipcode) {
    locationParameters = $.param({

        q: zipcode

    });

}

// function creates recent zip codes list in menubar
function prependToPage() {
    insideZipCodes = JSON.parse(localStorage.getItem("zipCodes"));

    // Checks to see if we have any todos in localStorage
    // If we do, set the local insideList variable to our todos
    // Otherwise set the local insideList variable to an empty array
    if (!Array.isArray(insideZipCodes)) {
        insideZipCodes = [];
    }
    for (var i = 0; i < insideZipCodes.length && i < 5; i++) {
        //inserts li children of .pure-menu-children class..
        //might have issue because of existing pure-menu-item, prob delete it
        var b = $("<li class='pure-menu-item'><a href='#' class='pure-menu-link' data-value='" + insideZipCodes[i] + "'>" + insideZipCodes[i] + "</a></li>");
        $(".pure-menu-children").prepend(b);
    }
}

//call our function
prependToPage();

//click function for 'recent' zipcodes so they can search the weather
$(document).on("click", ".pure-menu-link", function(event) {
    event.preventDefault();
    // debugger
    // console.log($(this).attr("data-value"));
    setLocal($(this).attr("data-value"));


    local();

}); // end of li```


// Gets input value from the modal after clicking search button
$("#modalzipcode").on("click", function(event) {

    event.preventDefault();

    var zipValue = $("#modalzip").val().trim();

    // Uses if statement to check if input is a valid zipcode (numbers and 5-digits in length)
    if ($.isNumeric(zipValue) === true && zipValue.length === 5) {

        // If statement is true, takes zip code and passes it into 'setLocal' function
        setLocal(zipValue);

        // Calls local function after location has been set to start query for local weather
        local();


        //var zipCode grabs the modalzip from the input
        var zipCode = $("#modalzip").val().trim();
        $("#modalzip").val("");

        var badZips = insideZipCodes.indexOf(zipValue);

        //nested if else statement checking to see if duplicate of zip code
        if (badZips === -1) {

            insideZipCodes.unshift(zipValue);
            //sets zip code value as zip code in local storage 
            localStorage.setItem("zipCodes", JSON.stringify(insideZipCodes));

            var b = $("<li class='pure-menu-item'><a href='#' class='pure-menu-link' data-value='" + zipValue + "'>" + zipValue + " </a></li>");
            $(".pure-menu-children").prepend(b);
            // prependToPage();
            $("#modalzip").val("");
            $(".modal").hide();

        } else {

            // If statement is true, takes zip code and passes it into 'setLocal' function
            setLocal(zipValue);

            // Calls local function after location has been set to start query for local weather
            local();

            $("#modalzip").val("");
            $(".modal").hide();

        }

    }




    // If zip code is not a 5-digits and uses anything other than a number, an error message is generated
    else {

        $('#error-message').html("Please enter a valid zip code.");
        $("#modalzip").val("");
    }


})
// end of modalzipcode

//////////////////////////////////


// Gets input value from the modal after clicking search button from the menu bar
$("#zipcode").on("click", function(event) {

    event.preventDefault();


    var zipValue = $("#menuZipInput").val().trim();

    // Uses if statement to check if input is a valid zipcode (numbers and 5-digits in length)
    if ($.isNumeric(zipValue) === true && zipValue.length === 5) {


        // If statement is true, takes zip code and passes it into 'setLocal' function
        setLocal(zipValue);

        // Calls local function after location has been set to start query for local weather
        local();

        $("#menuZipInput").val("");

        var badZips = insideZipCodes.indexOf(zipValue);

        if (badZips === -1) {

            insideZipCodes.unshift(zipValue);
            //sets zip code value as zip code in local storage 
            localStorage.setItem("zipCodes", JSON.stringify(insideZipCodes));

            var b = $("<li class='pure-menu-item'><a href='#' class='pure-menu-link' data-value='" + zipValue + "'>" + zipValue + " </a></li>");
            $(".pure-menu-children").prepend(b);
            // prependToPage();


        } else {

            setLocal(zipValue);


            local();


        }


    }

    // If zip code is not a 5-digits and uses anything other than a number, modal pops up with error message
    else {

        $("#menuZipInput").val("");

        var overlay = $('<div id="overlay"></div>');
        overlay.show();
        overlay.appendTo(document.body);
        $('#zipCodeModal').show();
        $('#error-message').html("Please enter a valid zip code.");
        $("#modalzip").val("");

    }

});
// end of modalzipcdoe