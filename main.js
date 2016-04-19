'use strict';

$(function() {
	  $('.greeting').append(themessage);
    $("button").button();
    $("#symbol").focus();

    //form submit event
    $("form").submit(function(e) {

        e.preventDefault();

        $("button").button("loading");

        var ticker = $("#symbol").val();

        new Markit.QuoteService(ticker, function(jsonResult) {
            //clearResult();
            //saveToStorage();
            //Catch errors
            if (!jsonResult || jsonResult.Message) {
                renderAlert(jsonResult);
                return;
            }
            renderSuccess(jsonResult);
            saveToStorage();
        });
    });
});

var thehours = new Date().getHours();
var themessage;
var morning = ('Good morning');
var afternoon = ('Good afternoon');
var evening = ('Good evening');

if (thehours >= 0 && thehours < 12) {
    themessage = morning;

} else if (thehours >= 12 && thehours < 17) {
    themessage = afternoon;

} else if (thehours >= 17 && thehours < 24) {
    themessage = evening;
}


function saveToStorage() {
    localStorage.jsonResult = JSON.stringify(jsonResult);
}

function loadFromStorage() {
    if (!localStorage.jsonResult) {
        localStorage.jsonResult = '[]';
    };
    contacts = JSON.parse(localStorage.jsonResult);
}

function resetForm() {
    $("button").button("reset");
    $("form").removeClass("error");
    $("#symbol")
        .val($("#symbol").val().toUpperCase())
        .select()
        .focus();
};

function renderSuccess(jsonResult) {
    var $container = $("<div id='resultContainer' />");
    $container.append("<h4>" + jsonResult.Name + " (" + jsonResult.Symbol + ")</h4>");
    $container.append(renderResultTable(jsonResult));

    $("form").after($container);
    $container.hide().fadeIn('fast');
    resetForm();
    loadFromStorage();
    saveToStorage();
};

function renderAlert(jsonResult) {
    $("form").addClass("error");
    $("form").before("<div class='alert alert-error'><a class='close' data-dismiss='alert'>&times;</a>" + jsonResult.Message + "</div>");
    $("div.alert").alert();
};

function renderResultTable(jsonResult) {
    var $table = $("<table />"),
        $thead = $("<thead />"),
        $tbody = $("<tbody />"),
        tableHeadCells = [],
        tableCells = [];

    tableHeadCells.push("<tr>");
    tableHeadCells.push("<th>Last Price</th>");
    tableHeadCells.push("<th>Change</th>");
    tableHeadCells.push("<th>Change Percent</th>");
    tableHeadCells.push("<th>Change Percent YTD</th>");
    tableHeadCells.push("<th>Last Traded</th>");
    tableHeadCells.push("</tr>");

    tableCells.push("<tr>");
    tableCells.push("<td>$", jsonResult.LastPrice, "</td>");
    tableCells.push("<td>", formatChgPct(jsonResult.Change), "</td>");
    tableCells.push("<td>", formatChgPct(jsonResult.ChangePercent), "%</td>");
    tableCells.push("<td>", jsonResult.ChangePercentYTD.toFixed(2), "%</td>");
    tableCells.push("<td>", jsonResult.Timestamp, "</td>");
    tableCells.push("</tr>");

    $table.addClass("table table-bordered table-striped");
    $thead.append(tableHeadCells.join(""));
    $tbody.append(tableCells.join(""));

    $table.append($thead).append($tbody);

    return $table;
    saveToStorage();

};

function formatChgPct(chg) {
    //the quote API returns negative numbers already,
    //so we just need to add the + sign to positive numbers
    return (chg <= 0) ? chg.toFixed(2) : "+" + chg.toFixed(2);
};
