
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


    $("#submit").off();
    $("#submit").on("click", function (event) {
        event.preventDefault();
        $("#print").text("Hello there!");
    });

    $("#signUp").off();
    $("#signUp").on("click", function (event) {
        event.preventDefault();
        var name = $("#userName").val().trim();
        var email = $("#userEmail").val().trim();
        var password = $("#userPassword").val().trim();

        console.log(name + email + password);

        database.ref("users").push({
            Name: name,
            Email: email,
            Password: password
        });

        $("#userName").val("");
        $("#userEmail").val("");
        $("#userPassword").val("");
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
                emailDatabase = emailDatabaseLocal;
                var keys = childSnapshot.key;
                findUserKey = keys;
                console.log("key " + keys);
                passwordDatabase=passwordDatabaseLocal;
                emailPassword=true;
                //console.log("match!");
                //console.log(emailInput + " is the same as " + emailDatabase);
                // $("#messageSignIn").text("This email is registered in our database");
            }
            //else{
            //    console.log("Not a match!");
            //   console.log(emailInput+" is not the same as "+emailDatabase);
            //    $("#messageSignIn").text("Sorry, this email is not registered in our database, please sign up");
            //}

            //dos ideas: switch, o exists de firebase

            $("#emailSI").val("");
            $("#passwordSI").val("");

        })
        switch (emailPassword) {
            case true:
                $("#messageSignIn").text("This email is registered in our database");
                console.log(emailInput + " is the same as " + emailDatabase);
                console.log(passwordInput + " is the same as " + passwordDatabase);

                break;
            default:
                $("#messageSignIn").text("Sorry, this email is not registered in our database, please sign up");
                console.log(emailInput + " is not the same as " + emailDatabase);
        }
    });
});
