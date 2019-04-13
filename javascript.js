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

    $(".submit").off();
    $(".submit").on("click", function (event) {
        event.preventDefault();
        $(".containerSearch").attr("hidden", "true");
        var urlAPI = "https://api.songkick.com/api/3.0/search/artists.json?apikey=" + APIKEY + "&query=";
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

        //This first ajax call is searching in songkick the artist or band name. We need this to get the artistiD to do another ajax search for the event.
        $.ajax({

            url: urlAPI + artistfinal,
            method: "GET"
        }).then(function (response) {
            var results = response.resultsPage.results.artist;
            var artistID = results[0].id;

            //var results = response.data;
            console.log(response);
            console.log(response.resultsPage.results.artist[0].displayName);
            console.log(artistID);

            //this ajax call is using the artistID that we got from the previews ajax call. Here we get the tour calendar from the artist that the user input. This is still from the songkick API.
            $.ajax({
                url: "https://api.songkick.com/api/3.0/artists/" + artistID + "/calendar.json?apikey=" + APIKEY,
                method: "GET"
            }).then(function (responsetwo) {
                console.log(responsetwo);

                //Here we make a call using the ticketmaster API. First we search for the artist or band using the attractions with keyword. Here we find the artistID to do the search about the calendar and tour info in following ajax calls. The artistID we need to ensure that there are no cover bands in the results.
                $.ajax({
                    type: "GET",
                    url: "https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=Hc1CDHMvFbPBf3t8PaoGyuzOfvyTLPts&keyword=" + artistfinal,
                }).then(function (response3) {
                    console.log(response3);
                    var ticketmasterArtistId = response3._embedded.attractions[0].id;
                    console.log(ticketmasterArtistId);

                    //Now that we have the artistId, we look in events for all the events that have the artistid, this is to ensure that no cover bands to not show in the search. So here we find the eventID. We are limiting the results for 10 events.
                    $.ajax({
                        type: "GET",
                        url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Hc1CDHMvFbPBf3t8PaoGyuzOfvyTLPts&attractionId=" + ticketmasterArtistId,
                    }).then(function (responsefour) {
                        console.log(responsefour);
                        var shortcutresponsefour = responsefour._embedded.events;
                        var counter = 0;

                        for(var y=0; y<shortcutresponsefour.length; y++){
                            eventId = shortcutresponsefour[y].id;
                            console.log(eventId);
                        }
                        

                    });
            });
        });
    });
    $("#inputUser").val("");
});

$("#signUpLink").off();
$("#signUpLink").on("click", function (event) {
    event.preventDefault();
    if ($(".form-signin").attr("hidden") === "hidden") {
        $(".form-signup").removeAttr("hidden");
        $(".search").attr("hidden", "true");
        $(".containerSearch").attr("hidden", "true");
    }
    else {
        $(".form-signin").attr("hidden", "true");
        $(".search").attr("hidden", "true");
        $(".form-signup").removeAttr("hidden");
        $(".containerSearch").attr("hidden", "true");
    }
});

$("#signInLink").off();
$("#signInLink").on("click", function (event) {
    event.preventDefault();
    if ($(".form-signup").attr("hidden") === "hidden") {
        $(".form-signin").removeAttr("hidden");
        $(".search").attr("hidden", "true");
        $(".containerSearch").attr("hidden", "true");
    }
    else {
        $(".form-signup").attr("hidden", "true");
        $(".search").attr("hidden", "true");
        $(".form-signin").removeAttr("hidden");
        $(".containerSearch").attr("hidden", "true");

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


    })

});
});
