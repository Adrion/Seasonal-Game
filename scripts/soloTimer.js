$(document).ready(function() {
    var zindex = 50,
        score = 0;
    // Create your interaction code here
    $("#pinboard div.actif").each(function() {
        // console.log($(window).height());
        // console.log($(document).height());
        console.log($("#pinboard ul li").width());
        console.log($("#pinboard").width());
        xpos = Math.floor(Math.random());
        ypos = Math.floor(Math.random());
        rotation = Math.floor(Math.random() * 15);
        if (Math.floor(Math.random() * 11) > 5) {
            rotation = rotation * -1;
        }
        $(this).data("rotation", rotation);
        $(this).delay(0).animate({
            top: ypos,
            left: xpos
        }).css({
            webkitTransform: "rotate(" + rotation + "deg)",
            MozTransform: "rotate(" + rotation + "deg)",
            msTransform: "rotate(" + rotation + "deg)",
            transform: "rotate(" + rotation + "deg)"
        });
    }).draggable({
        start: function() {
            zindex = zindex + 1;
            $(this).css({
                zIndex: zindex
            });
        },
        stop: function() {
            rotation = Math.floor(Math.random() * 15);
            if (Math.floor(Math.random() * 11) > 5) {
                rotation = rotation * -1;
            }
            $(this).data("rotation", rotation);
            $(this).css({
                webkitTransform: "rotate(" + rotation + "deg)",
                MozTransform: "rotate(" + rotation + "deg)",
                msTransform: "rotate(" + rotation + "deg)",
                transform: "rotate(" + rotation + "deg)"
            });
        },
        containment: "#pinboard"
    });

    $("#spring").droppable({
        drop: function(event, ui) {
            ui.draggable.remove();
            checkStillDiv();
        }
    });

    $("#summer").droppable({
        drop: function(event, ui) {
            ui.draggable.remove();
            checkStillDiv();
        }
    });

    $("#autumn").droppable({
        drop: function(event, ui) {
            ui.draggable.remove();
            checkStillDiv();
        }
    });

    $("#winter").droppable({
        drop: function(event, ui) {
            ui.draggable.remove();
            checkStillDiv();
        }
    });

    function getpoint(points) {
        score += points;
        $('#score').html(score);
    }

    function checkStillDiv() {
        if (!$('#pinboard div.actif')[0]) {
            endGame();
            console.log("il en reste plus");
        }
    }

    function endGame() {
        $("#pinboard").html($('#game-over-template').html());
        $("#finalScore").html(score);
        $(document).on('click', '#btnRestartGame', function() {
            $("#pinboard").html($('#solo-game-template').html());
        });
    }


    //-----------------CHRONO-------------------

    var startTime = 0,
        start = 0,
        end = 0,
        diff = 0,
        timerID = 0;

    function chrono() {
        end = new Date();
        diff = end - start;
        diff = new Date(diff);
        var msec = diff.getMilliseconds(),
            sec = diff.getSeconds(),
            min = diff.getMinutes(),
            hr = diff.getHours() - 1;
        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        if (msec < 10) {
            msec = "00" + msec;
        } else if (msec < 100) {
            msec = "0" + msec;
        }
        console.log($("#chronotime").innerHTML = hr + ":" + min + ":" + sec + ":" + msec);
        timerID = setTimeout("chrono()", 10);
    }

    function chronoStart() {
        start = new Date();
        chrono();
    }

    function chronoContinue() {
        start = new Date() - diff;
        start = new Date(start);
        chrono();
    }

    function chronoReset() {
        document.getElementById("chronotime").innerHTML = "0:00:00:000";
        start = new Date();
    }

    function chronoStopReset() {
        document.getElementById("chronotime").innerHTML = "0:00:00:000";
        document.chronoForm.startstop.onclick = chronoStart;
    }

    function chronoStop() {
        clearTimeout(timerID);
    }

    //-----------------END CHRONO----------------

});
