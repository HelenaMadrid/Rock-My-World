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
    var artist = "";
    var artist2 = "";
    var artistfinal = "";

    $(".submit").off();
    $(".submit").on("click", function (event) {
        event.preventDefault();
        $(".containerSearch").attr("hidden", "true");
        
        var urlAPI="https://api.songkick.com/api/3.0/search/artists.json?apikey=" + APIKEY + "&query=";
        
        artist2 = $("#inputUserNav").val().trim();
        artist = $("#inputUser").val().trim();
        
        console.log("artist " + artist);
        console.log(artist2);

        //https://api.songkick.com/api/3.0/artists/{artist_id}/calendar.json?apikey={your_api_key}
        
        if(artist2===""){
            artistfinal=artist;
            
        }
        if(artist===""){
            artistfinal=artist2;
        
        }
        

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

            $.ajax({
                url: "https://api.songkick.com/api/3.0/artists/" + artistID + "/calendar.json?apikey=" + APIKEY,
                method: "GET"
            }).then(function (responsetwo) {
                console.log(responsetwo);
                //$("#events").append("<li><a href=" + results[0].uri + ">" + results[0].displayName + "</a></li>");
                for (var x = 0; x < 11; x++) {
                    var responseShort = responsetwo.resultsPage.results.event[0];
                    var container = $("#events");
                    var imageConcert = $("<img>");
                    var eventName = $("<p>");
                    var venueName = $("<p>");
                    var location = $("<p>");
                    var dateTime = $("<p>");

                    container.addClass("border border-white");


                    var eventNameExtracted = responseShort.displayName;
                    var venueNameExtracted = responseShort.venue.displayName;
                    var locationExtracted = responseShort.location.city + " " + responseShort.venue.metroArea.displayName;
                    var dateTimeExtracted = responseShort.start.date + " " + " " + responseShort.start.time;

                    //$("#events").append(container);
                    container.append(imageConcert);
                    container.append(eventName);
                    container.append(venueName);
                    container.append(location);
                    container.append(dateTime);

                    eventName.text(eventNameExtracted);
                    venueName.text(venueNameExtracted);
                    location.text(locationExtracted);
                    dateTime.text(dateTimeExtracted);
                }

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
