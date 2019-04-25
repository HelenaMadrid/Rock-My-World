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
    //var SavedEvents = "";
    var EventID = "";
    var EventName = "";
    var savedEvents;
    var emailDatabase = "";
    var passwordDatabase = "";
    var findUserKey = "";
    var emailPassword = false;
    var APIKEYTicketmaster = "Hc1CDHMvFbPBf3t8PaoGyuzOfvyTLPts";
    var artistfinal = "";
    var saved = false;
    var mapsAPIKEY = "AIzaSyAlrquPmGfxKhaYwfzdeFVpnVxB-875Lc4";
    //var user = auth.currentUser;
    var nameUser;

    function updateProfile() {
        var user = auth.currentUser;
        user.updateProfile({
            displayName: nameUser
        }).then(function () {
            // Update successful.
            window.location.href = "signedUser.html";

        }).catch(function (error) {
            // An error happened.
        });
    }

    auth.onAuthStateChanged(function (user) {
        if (user) {
            console.log(user + " signed in");
            console.log(nameUser);
            //updateProfile();
            if (user) {
                console.log(user);
                console.log(user.uid);
                var named, email, uid;
                if (user != null) {
                    named = user.displayName;
                    email = user.email;
                    uid = user.uid;
                    console.log("name " + named);
                    console.log("name displayed" + user.displayName);
                    console.log("email " + email);
                    console.log("uid " + uid);
                    $("#hiUser").html("Welcome <strong>" + user.displayName + "</strong>");

                    //console.log(user);
                }
            } else {
                // No user is signed in.
                //console.log(userSignedIn);
            }

        }
        else {
            // No user is signed in.
            console.log("no user");
        }
    });

    $("#signUp").off();
    $("#signUp").on("click", function (event) {
        event.preventDefault();
        var name = $("#inputUserName").val().trim();
        var email = $("#inputEmail").val().trim();
        var password = $("#inputPassword").val().trim();

        console.log(name + email + password);

        nameUser = name;

        auth.createUserWithEmailAndPassword(email, password).then(function () {
            updateProfile();
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
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
            //console.debug($.cookie("Email"));
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
        var imageDiv = $("<div>");
        eventId = results[y].id;
        //console.log(eventId);

        container.append(row);
        row.append(imageDiv);
        row.append(eventInfo);
        row.append(buttonAndHeart);
        eventInfo.append(eventName);
        eventInfo.append(venueName);
        eventInfo.append(location);
        eventInfo.append(dateTime);
        imageDiv.append(imageConcert);
        buttonAndHeart.append(favorite);
        buttonAndHeart.append(extraInfoButton);

        imageDiv.addClass("col-xl-3 col-lg-3 col-md-5 my-4");
        imageConcert.addClass("rounded mx-auto d-block .img-fluid");
        row.addClass("row text-center border border-white my-4 resultsRow");
        row.attr("value", eventId);
        eventInfo.addClass("col-xl-7 col-md-7 text-center mt-3");
        buttonAndHeart.addClass("col-xl-2 col-md-12 mt-xl-5 mt-lg-5 mt-md-3");
        extraInfoButton.addClass("btn btn-outline-light mt-4 moreInfo");
        extraInfoButton.attr({ "value": eventId, "style": "height:auto; width:100%", "type": "button", "data-toggle": "modal", "data-target": ".bd-example-modal-lg" });
        heart.addClass("far fa-heart text-white fa-lg");
        heart.attr({ "style": "width:100%", "value": eventId });
        favorite.attr({ "style": "background:none; border:none", "value": eventId, "type": "button" });
        favorite.addClass("favorite " + artistfinal);

        var eventNameExtracted = results[y].name;
        var venueNameExtracted = results[y]._embedded.venues[0].name;
        var cityExtracted = results[y]._embedded.venues[0].city.name;
        var stateExtracted = results[y]._embedded.venues[0].state.name;
        var dateTimeExtracted = results[y].dates.start.localDate + " " + results[y].dates.start.localTime;
        var imageConcertExtracted = results[y].images[2].url;
        var locationExtracted = cityExtracted + ", " + stateExtracted;

        imageConcert.attr({ "src": imageConcertExtracted, "style": "height:auto; max-width:100%;" });

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
        $("#printSavedEvents").attr("hidden", "true");
        $(".form-signin").attr("hidden", "true");
        $(".form-signup").attr("hidden", "true");

        var artist2 = $("#inputUserNav").val().trim();
        var artist = $("#inputUser").val().trim();
        if (artist === "" & artist2 === "") {
            $("#events").append("<h3 id='emptySearch'>Dear user, please type something.</h3>");
            $("#events").removeAttr("hidden");
        }
        else {
            $(".containerSearch").attr("hidden", "true");
            $("#events").removeAttr("hidden");
            $("#printSavedEvents").attr("hidden", "true");
            console.log("artist " + artist);
            console.log(artist2);
            if (artist2 === "") {
                artistfinal = artist;
                //artist = "";
            }
            if (artist === "") {
                artistfinal = artist2;
                //artist2 = "";
            }

            $("#inputUserNav").val("");
            $("#inputUser").val("");

            console.log("artist " + artist);
            console.log(artist2);
            //Now that we have the artistId, we look in events for all the events that have the artistid, this is to ensure that no cover bands to not show in the search. So here we find the eventID. We are limiting the results for 10 events.
            $.ajax({
                type: "GET",
                url: "https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=ZZCv9QiTrhtUYkyoww2oLH1fMUUX6Zwc&sort=date,asc&source=ticketmaster&keyword=" + artistfinal,
                async: true,
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if (response.page.totalElements === 0) {
                        $("#events").append("<h2 class='text-white noNavBar noEventsFound'>Sorry, but we couldn't find any events by this artist or at this location. Please try finding other artist or location.");
                    }
                    else {
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
                    }
                },
                error: function (xhr, status, err) {
                    // This time, we do not end up here!

                }
            });
        }
    });

    $("#favoritesPage").off();
    $("#favoritesPage").on("click", function (event) {
        event.preventDefault();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var dropdown = $("#dropdown");
                var userSignedIn = auth.currentUser;
                $("#dropdown").removeAttr("hidden");
                $("#printSavedEvents").removeAttr("hidden");
                $(".form-signup").attr("hidden", "true");
                $(".search").attr("hidden", "true");
                $(".containerSearch").attr("hidden", "true");
                $("#events").attr("hidden", "true");
                $(".form-signin").attr("hidden", "true");


                //database.ref("users/" + userSignedIn.displayName+"/Lady Gaga").on("child_added", function (snapshot) {
                database.ref("users/" + userSignedIn.displayName).orderByKey().once("value").then(function (snapshot) {
                    var haschildren = snapshot.hasChildren();
                    var numchildren = snapshot.numChildren();

                    console.log(snapshot);
                    console.log(haschildren);
                    console.log(numchildren);

                    snapshot.forEach(function (childSnapshot) {
                        console.log(childSnapshot.key);
                        console.log(childSnapshot.val());
                        var option = $("<option>");
                        var artist = childSnapshot.key;
                        dropdown.append(option);

                        option.text(artist);
                        option.attr("value", artist);


                    });

                });
            } else {
                // No user is signed in.
                $("#printSavedEvents").removeAttr("hidden");
                $(".form-signup").attr("hidden", "true");
                $(".search").attr("hidden", "true");
                $(".containerSearch").attr("hidden", "true");
                $("#events").attr("hidden", "true");
                $(".form-signin").attr("hidden", "true");
                $("#printSavedEvents").html("<h2 class='text-white noNavBar signInNeeded'>You need to log in to check the events you saved.</h2>");
            }
        });


    });

    //$(".favorite").off();
    //$(document.body).off();

    //$(".favorite").off("click");
    $(document.body).on("click", ".favorite", function (event) {
        event.preventDefault();
        var eventId = $(this).attr("value");
        console.log(this);
        console.log(eventId);

        if (saved === false) {
            $(this).children().removeClass("far");
            $(this).children().addClass("fas");
            saved = true;
            console.log("favorite saved");
            var userSignedIn = auth.currentUser;
            database.ref("users/" + userSignedIn.displayName + "/" + artistfinal).push({
                EventID: eventId
            });
        }
        else {
            var userSignedIn = auth.currentUser;
            console.log(userSignedIn);
            $(this).children().removeClass("fas");
            $(this).children().addClass("far");
            saved = false;
            //database.ref("users/"+ userSignedIn.displayName.eventId).remove();
            database.ref("users/" + userSignedIn.displayName + "/" + artistfinal).child(eventId).remove();
            // database.ref("TrainScheduler").child($(this).attr("data-id")).remove();
            console.log("favorite unsaved");
        }
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
                bodyContainer.append(buyticket);
                bodyContainer.append(itunes);
                bodyContainer.append(youtube);
                bodyContainer.append(instagram);
                bodyContainer.append(facebook);
                bodyContainer.append(lastfm);
                bodyContainer.append(seatmap);
                bodyContainer.append(parking);
                bodyContainer.append(notes);
                //bodyContainer.append(homepage);
                bodyContainer.append(mapDiv);

                mapDiv.attr("id", "map");
                mapDiv.attr("style", "height:400px");

                dateTime.text(response.dates.start.localDate + " " + response.dates.start.localTime);
                location.text(response._embedded.venues[0].city.name + ", " + response._embedded.venues[0].state.name);
                venue.html("<h3>" + response._embedded.venues[0].name + "</h3>");
                address.html("<strong>Address</strong><p>" + response._embedded.venues[0].address.line1 + "</p>");
                parking.html("<strong>Parking Details</strong><p>" + response._embedded.venues[0].parkingDetail + "</p>");
                notes.html("<strong>Please note</strong><p> " + response.pleaseNote + "</p>");
                ticketPrice.html("<strong>Tickets</strong><p>$" + response.priceRanges[0].min + " - $" + response.priceRanges[0].max + " USD.</p>");
                buyticket.html("<img src='assets/images/ticketmaster.png' class='m-2' style='height:50px; width:50px'>");
                itunes.html("<img src='assets/images/itunes.png' class='m-2' style='height:50px; width:50px'>");
                youtube.html("<img src='assets/images/Youtube.svg' class='m-2' style='height:50px; width:50px'>");
                instagram.html("<img src='assets/images/Instagram.svg' class='m-2' style='height:50px; width:50px'>");
                facebook.html("<img src='assets/images/Facebook.svg' class='m-2' style='height:50px; width:50px'>");
                lastfm.html("<img src='assets/images/LastFM.svg'class='m-2' style='height:50px; width:50px'>");
                homepage.text("homepage");

                seatmap.addClass("rounded mx-auto d-block .img-fluid my-2");
                seatmap.attr({ "src": response.seatmap.staticUrl, "style": "height:auto; max-width:100%" });
                imageEvent.attr({ "src": response.images[1].url, "style": "height:auto; max-width:100%" });
                imageEvent.addClass("rounded mx-auto d-block .img-fluid my-2");
                buyticket.attr({ "href": response.url, "target": "_blank" });
                itunes.attr({ "href": response._embedded.attractions[0].externalLinks.itunes[0].url, "target": "_blank" });
                youtube.attr({ "href": response._embedded.attractions[0].externalLinks.youtube[0].url, "target": "_blank" });
                instagram.attr({ "href": response._embedded.attractions[0].externalLinks.instagram[0].url, "target": "_blank" });
                facebook.attr({ "href": response._embedded.attractions[0].externalLinks.facebook[0].url, "target": "_blank" });
                lastfm.attr({ "href": response._embedded.attractions[0].externalLinks.lastfm[0].url, "target": "_blank" });
                homepage.attr({ "href": response._embedded.attractions[0].externalLinks.homepage[0].url, "target": "_blank" });

                bodyContainer.addClass("text-center");
                venue.addClass("font-weight-bold mt-3");

                //seatMapButton.attr({"href": "#", "role": "button", "title": "Seat Map", "data-content":"hola"});
                //seatMapButton.addClass("btn btn-secondary popover-test");
                //seatMapButton.text("Seat Map");

                var locationFormated = new google.maps.LatLng(latitude, longitude);
                var map = new google.maps.Map(document.getElementById('map'), { center: locationFormated, zoom: 15 });
                var marker = new google.maps.Marker({ position: locationFormated, map: map });
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
            $("#printSavedEvents").attr("hidden", "true");
        }
        else {
            $(".form-signin").attr("hidden", "true");
            $(".search").attr("hidden", "true");
            $(".form-signup").removeAttr("hidden");
            $(".containerSearch").attr("hidden", "true");
            $("#events").attr("hidden", "true");
            $("#printSavedEvents").attr("hidden", "true");
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
            $("#printSavedEvents").attr("hidden", "true");
        }
        else {
            $(".form-signup").attr("hidden", "true");
            $(".search").attr("hidden", "true");
            $(".form-signin").removeAttr("hidden");
            $(".containerSearch").attr("hidden", "true");
            $("#events").attr("hidden", "true");
            $("#printSavedEvents").attr("hidden", "true");

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


});