$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDDWmB56Wyxlkc6sB8xq55DR93TI0PwY1Y",
        authDomain: "rock-my-world-e94ae.firebaseapp.com",
        databaseURL: "https://rock-my-world-e94ae.firebaseio.com",
        projectId: "rock-my-world-e94ae",
        storageBucket: "rock-my-world-e94ae.appspot.com",
        messagingSenderId: "1006942909376"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var auth = firebase.auth();

    var Name = "";
    var Email = "";
    var Password = "";
    var SavedEvents = "";
    var EventID = "";
    var emailDatabase = "";
    var passwordDatabase = "";
    var findUserKey = "";
    var emailPassword = false;
    var APIKEYTicketmaster = "Hc1CDHMvFbPBf3t8PaoGyuzOfvyTLPts";
    var artist = "";
    var artist2 = "";
    var artistfinal = "";
    var saved = false;
    var mapsAPIKEY = "AIzaSyAlrquPmGfxKhaYwfzdeFVpnVxB-875Lc4";



    auth.onAuthStateChanged(function (user) {
        if (user) {
            console.log(user + " signed in");
            var userSignedIn = auth.currentUser;

            if (userSignedIn) {
                console.log(userSignedIn);
            } else {
                // No user is signed in.
                //console.log(userSignedIn);
            }
        } else {
            // No user is signed in.
            console.log("no user");
        }
    });

    function printEvents(results, y, container) {
        var row = $("<div>");
        var eventInfo = $("<div>");
        var buttonAndHeart = $("<form>");
        var heart = $("<i>");
        var favorite = $("<button>");
        var extraInfoButton = $("<button>");
        var imageConcert = $("<img>");
        var eventName = $("<p>");
        var venueName = $("<p>");
        var location = $("<p>");
        var dateTime = $("<p>");
        eventId = results[y].id;
        //console.log(eventId);

        imageConcert.addClass("col-xl-2 p-4");
        row.addClass("row text-center border border-white my-2");
        row.attr("value", eventId);
        eventInfo.addClass("col-xl-8 text-center p-2");
        buttonAndHeart.addClass("col-xl-2 pt-5");
        extraInfoButton.addClass("btn btn-outline-light mt-4 moreInfo");
        extraInfoButton.attr({ "value": eventId, "style": "height:auto; width:100%", "type": "button", "data-toggle": "modal", "data-target": ".bd-example-modal-lg" });
        heart.addClass("far fa-heart text-white fa-lg");
        heart.attr({ "style": "width:100%", "value": eventId });
        favorite.attr({ "style": "background:none; border:none", "value": eventId });
        favorite.addClass("favorite");


        var eventNameExtracted = results[y].name;
        var venueNameExtracted = results[y]._embedded.venues[0].name;
        var locationExtracted = results[y]._embedded.venues[0].city.name + ", " + results[y]._embedded.venues[0].state.name;
        var dateTimeExtracted = results[y].dates.start.localDate + " " + results[y].dates.start.localTime;
        var imageConcertExtracted = results[y].images[2].url;

        container.append(row);

        row.append(imageConcert);
        row.append(eventInfo);
        row.append(buttonAndHeart);

        eventInfo.append(eventName);
        eventInfo.append(venueName);
        eventInfo.append(location);
        eventInfo.append(dateTime);

        buttonAndHeart.append(favorite);
        //buttonAndHeart.append(heart);
        buttonAndHeart.append(extraInfoButton);

        imageConcert.attr({ "src": imageConcertExtracted, "style": "height:171px; width:240px;" });

        eventName.html("<h3>" + eventNameExtracted + "</h3>");
        venueName.text(venueNameExtracted);
        location.text(locationExtracted);
        dateTime.text(dateTimeExtracted);
        extraInfoButton.text("More information");
        favorite.html(heart);
    }

    $(".submit").off();
    $(".submit").on("click", function (event) {
        $("#events").empty();
        event.preventDefault();
        $(".containerSearch").attr("hidden", "true");
        artist2 = $("#inputUserNav").val().trim();
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
            url: "https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=ZZCv9QiTrhtUYkyoww2oLH1fMUUX6Zwc&sort=date,asc&keyword=" + artistfinal,
            async: true,
            dataType: "json",
            success: function (response) {
                //console.log(response);
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

    $("#favoritesPage").off();
    $("#favoritesPage").on("click", function (event) {
        event.preventDefault();
        window.location.href = "favorites.html";

    });

    $(".favorite").off();
    $(".favorite").on("click", function (event) {
        event.preventDefault();
        console.log("favorite clicked");
        console.log(this);
        var eventId = $(this).attr("value");
        console.log(eventId);
        saved = true;
    });

    //$().off();
    $(document.body).on("click", ".moreInfo", function (event) {
        $(".modal-title").empty();
        $(".modal-body").empty();
        event.preventDefault();
        var eventId = $(this).attr("value");
        console.log("hola " + eventId);
        var bodyContainer = $("<div>");
        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v2/events/" + eventId + "?apikey=ZZCv9QiTrhtUYkyoww2oLH1fMUUX6Zwc&",
            async: true,
            dataType: "json",
            success: function (response) {
                console.log(response);
                var imageEvent = $("<img>");
                var dateTime = $("<p>");
                var location = $("<p>");
                var venue = $("<p>");
                var notes = $("<p>");
                var buyticket = $("<a>");
                var itunes = $("<a>");
                var youtube = $("<a>");
                var facebook = $("<a>");
                var lastfm = $("<a>");
                var instagram = $("<a>");
                var address = $("<p>");
                var parking = $("<p>");
                var homepage = $("<a>");
                var seatmap = $("<img>");
                var ticketPrice = $("<p>");
                var mapDiv = $("<div>");
                var seatMapButton = $("<a>");
                var latitude = response._embedded.venues[0].location.latitude;
                var longitude = response._embedded.venues[0].location.longitude;
                //var latitude = 39.305;
                //var longitude = -76.617;
                console.log(latitude);
                
                $(".modal-title").text(response.name);
                $(".modal-body").append(bodyContainer);
                bodyContainer.append(imageEvent);
                bodyContainer.append(venue);
                bodyContainer.append(location);
                bodyContainer.append(dateTime);
                bodyContainer.append(address);
                bodyContainer.append(ticketPrice);
                //bodyContainer.append(seatMapButton);
                bodyContainer.append(seatmap);
                bodyContainer.append(parking);
                bodyContainer.append(notes);
                bodyContainer.append(buyticket);
                bodyContainer.append(itunes);
                bodyContainer.append(youtube);
                bodyContainer.append(instagram);
                bodyContainer.append(facebook);
                bodyContainer.append(lastfm);
                bodyContainer.append(homepage);
                bodyContainer.append(mapDiv);

                var locationFormated = new google.maps.LatLng(latitude, longitude);

                mapDiv.attr("id", "map");
                mapDiv.attr("style", "height:400px");
               
                dateTime.text(response.dates.start.localDate + " " + response.dates.start.localTime);
                location.text(response._embedded.venues[0].city.name + ", " + response._embedded.venues[0].state.name);
                venue.text(response._embedded.venues[0].name);
                address.html("<strong>Address:</strong> " + response._embedded.venues[0].address.line1);
                parking.html("<strong>Parking Details:</strong> " + response._embedded.venues[0].parkingDetail);
                notes.html("<strong>Please note:</strong> " + response.pleaseNote);
                ticketPrice.html("<strong>Tickets: </strong><p>$" + response.priceRanges[0].min + " - $" + response.priceRanges[0].max + " USD.</p>");
                buyticket.text("Buy ticket");
                itunes.text("iTunes");
                youtube.html("<img src='assets/images/Youtube.svg' style='height:50px; width:50px'>");
                instagram.html("<img src='assets/images/Instagram.svg' style='height:50px; width:50px'>");
                facebook.html("<img src='assets/images/Facebook.svg' style='height:50px; width:50px'>");
                lastfm.html("<img src='assets/images/LastFm.svg' style='height:50px; width:50px'>");
                homepage.text("homepage");

                seatmap.attr("src", response.seatmap.staticUrl);
                imageEvent.attr("src", response.images[1].url);
                buyticket.attr("href", response.url);
                itunes.attr("href", response._embedded.attractions[0].externalLinks.itunes[0].url);
                youtube.attr("href", response._embedded.attractions[0].externalLinks.youtube[0].url);
                instagram.attr("href", response._embedded.attractions[0].externalLinks.instagram[0].url);
                facebook.attr("href", response._embedded.attractions[0].externalLinks.facebook[0].url);
                lastfm.attr("href", response._embedded.attractions[0].externalLinks.lastfm[0].url);
                homepage.attr("href", response._embedded.attractions[0].externalLinks.homepage[0].url)

                bodyContainer.addClass("text-center");
                venue.addClass("font-weight-bold mt-3");

                //seatMapButton.attr({"href": "#", "role": "button", "title": "Seat Map", "data-content":"hola"});
                //seatMapButton.addClass("btn btn-secondary popover-test");
                //seatMapButton.text("Seat Map");

                var map = new google.maps.Map(document.getElementById('map'), { center: locationFormated, zoom: 15 });
                var marker = new google.maps.Marker({position: locationFormated, map: map});
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
        auth.signOut().then(function () {
            window.location.href = "index.html";
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
    });

    $("#signUp").off();
    $("#signUp").on("click", function (event) {
        event.preventDefault();
        var name = $("#inputUserName").val().trim();
        var email = $("#inputEmail").val().trim();
        var password = $("#inputPassword").val().trim();

        console.log(name + email + password);

        // database.ref("users").push({
        //     Name: name,
        //     Email: email,
        //    Password: password,
        // });

        auth.createUserWithEmailAndPassword(email, password).then(function () {
            window.location.href = "signedUser.html";
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            // ...
        });



        // $("#inputUserName").val("");
        //$("#inputEmail").val("");
        //$("#inputPassword").val("");
    });

    $("#signIn").off();
    $("#signIn").on("click", function (event) {
        event.preventDefault();
        var emailInput = $("#emailSI").val().trim();
        var passwordInput = $("#passwordSI").val().trim();
        var checkbox = $("#rememberMe");
        if (checkbox[0].checked === true) {
            console.log("hola");
            Cookies.set("Email", emailInput);
            Cookies.set("Password", passwordInput);
        }
        else {
            console.log("adios");
        }

        auth.signInWithEmailAndPassword(emailInput, passwordInput).then(function () {
            window.location.href = "signedUser.html";
            console.debug($.cookie("Email"));
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            $("#messageSignIn").html("<p>" + errorMessage + "</p>");
            // ...
        });
    });


});

