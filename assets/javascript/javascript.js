$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDDWmB56Wyxlkc6sB8xq55DR93TI0PwY1Y",
        authDomain: "rock-my-world-e94ae.firebaseapp.com",
        databaseURL: "https://rock-my-world-e94ae.firebaseio.com",
        projectId: "rock-my-world-e94ae",
        storageBucket: "",
        messagingSenderId: "1006942909376"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var Name = "";
    var Email = "";
    var Password = "";
    var emailDatabase = "";
    var passwordDatabase = "";
    var findUserKey = "";
    var emailPassword = false;
    var APIKEY = "8B9NyQks1iiVdMZV";
    var APIKEYTicketmaster = "Hc1CDHMvFbPBf3t8PaoGyuzOfvyTLPts";
    var artist = "";
    var artist2 = "";
    var artistfinal = "";


    function printEvents(results, y, container) {
        var row = $("<div>");
        var eventInfo = $("<div>");
        var extraInfoButton=$("<button>");
        var imageConcert = $("<img>");
        var eventName = $("<p>");
        var venueName = $("<p>");
        var location = $("<p>");
        var dateTime = $("<p>");
        eventId = results[y].id;
        console.log(eventId);

        imageConcert.addClass("col-xl-2 p-4");
        row.addClass("row text-center border border-white my-2");
        row.attr("value", eventId);
        eventInfo.addClass("col-xl-8 text-center p-2");
        extraInfoButton.addClass("btn btn-outline-light col-xl-2");
        extraInfoButton.attr({"value": eventId, "style": "height:50px; width:30px"});

        var eventNameExtracted = results[y].name;
        var venueNameExtracted = results[y]._embedded.venues[0].name;
        var locationExtracted = results[y]._embedded.venues[0].city.name + ", " + results[y]._embedded.venues[0].state.name;
        var dateTimeExtracted = results[y].dates.start.localDate + " " + results[y].dates.start.localTime;
        var imageConcertExtracted = results[y].images[2].url;

        console.log(results[y].dates);
        console.log(results[y].dates.start);
        console.log(results[y].dates.localTime);

        container.append(row);

        row.append(imageConcert);
        row.append(eventInfo);
        row.append(extraInfoButton);

        eventInfo.append(eventName);
        eventInfo.append(venueName);
        eventInfo.append(location);
        eventInfo.append(dateTime);

        imageConcert.attr({ "src": imageConcertExtracted, "style": "height:171px; width:240px;" });

        eventName.html("<h3>" + eventNameExtracted + "</h3>");
        venueName.text(venueNameExtracted);
        location.text(locationExtracted);
        dateTime.text(dateTimeExtracted);
        extraInfoButton.text("More information");
    }
    $(".submit").off();
    $(".submit").on("click", function (event) {
        event.preventDefault();
        $(".containerSearch").attr("hidden", "true");
        //artist2 = $("#inputUserNav").val().trim();
        artist = $("#inputUser").val().trim();
        console.log("artist " + artist);
        console.log(artist2);
        if (artist2 === "") {
            artistfinal = artist;
        }
        if (artist === "") {
            artistfinal = artist2;
        }
        //Now that we have the artistId, we look in events for all the events that have the artistid, this is to ensure that no cover bands to not show in the search. So here we find the eventID. We are limiting the results for 10 events.
        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=ZZCv9QiTrhtUYkyoww2oLH1fMUUX6Zwc&keyword=" + artistfinal,
            async: true,
            dataType: "json",
            success: function (response) {
                console.log(response);
                var results = response._embedded.events;
                var container = $("#events");
                container.addClass("container");

                if (results.length < 10) {
                    for (var y = 0; y < results.length; y++) {
                        printEvents(results, y, container);
                    }
                }
                else {
                    for (var y = 0; y < 10; y++) {
                        printEvents(results, y, container);
                    }
                }
            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        });

    });


    $("#signUpLink").off();
    $("#signUpLink").on("click", function (event) {
        event.preventDefault();
        if ($(".form-signin").attr("hidden") === "hidden") {
            $(".form-signup").removeAttr("hidden");
            $(".search").attr("hidden", "true");
            $(".containerSearch").attr("hidden", "true");
            $("#events").attr("hidden", "true");
        }
        else {
            $(".form-signin").attr("hidden", "true");
            $(".search").attr("hidden", "true");
            $(".form-signup").removeAttr("hidden");
            $(".containerSearch").attr("hidden", "true");
            $("#events").attr("hidden", "true");
        }
    });

    $("#signInLink").off();
    $("#signInLink").on("click", function (event) {
        event.preventDefault();
        if ($(".form-signup").attr("hidden") === "hidden") {
            $(".form-signin").removeAttr("hidden");
            $(".search").attr("hidden", "true");
            $(".containerSearch").attr("hidden", "true");
            $("#events").attr("hidden", "true");
        }
        else {
            $(".form-signup").attr("hidden", "true");
            $(".search").attr("hidden", "true");
            $(".form-signin").removeAttr("hidden");
            $(".containerSearch").attr("hidden", "true");
            $("#events").attr("hidden", "true");

        }
    });
    $("#signOutLink").off();
    $("#signOutLink").on("click", function (event) {
        event.preventDefault();
        window.location.href = "landingpage.html";
    });

    $("#signUp").off();
    $("#signUp").on("click", function (event) {
        event.preventDefault();
        var name = $("#inputUserName").val().trim();
        var email = $("#inputEmail").val().trim();
        var password = $("#inputPassword").val().trim();

        console.log(name + email + password);

        database.ref("users").push({
            Name: name,
            Email: email,
            Password: password
        });

        $("#inputUserName").val("");
        $("#inputEmail").val("");
        $("#inputPassword").val("");
    });

    $("#signIn").off();
    $("#signIn").on("click", function (event) {
        event.preventDefault();
        var emailInput = $("#emailSI").val().trim();
        var passwordInput = $("#passwordSI").val().trim();

        database.ref("users").on("child_added", function (childSnapshot) {
            //event.preventDefault();
            var emailDatabaseLocal = childSnapshot.val().Email;
            var passwordDatabaseLocal = childSnapshot.val().Password;
            //console.log("key "+keys);
            console.log(emailDatabaseLocal + " " + passwordDatabaseLocal);

            if (emailInput === emailDatabaseLocal && passwordInput === passwordDatabaseLocal) {
                //emailDatabase = emailDatabaseLocal;
                var keys = childSnapshot.key;
                findUserKey = keys;
                console.log("key " + keys);
                $("#messageSignIn").text("This email is registered in our database");
                console.log(emailInput + " is the same as " + emailDatabaseLocal);
                console.log(passwordInput + " is the same as " + passwordDatabaseLocal);
                window.location.href = "signedUser.html";
            }
            else {
                $("#messageSignIn").html("<p>Sorry, the email or password is incorrect</p>");
                console.log(emailInput + " is not the same as " + emailDatabaseLocal);
                console.log(passwordInput + " is not the same as " + passwordDatabaseLocal);
            }

            $("#emailSI").val("");
            $("#passwordSI").val("");


        });

    });

});

