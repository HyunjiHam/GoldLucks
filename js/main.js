/*window.onload = function() {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    // Sample code
    var mainPage = document.querySelector('#main');

    mainPage.addEventListener("click", function() {
        var contentText = document.querySelector('#content-text');

        contentText.innerHTML = (contentText.innerHTML === "Basic") ? "Tizen" : "Basic";
    });
};*/

/*window.onload = function(){
	document.addEventListener('tizenhwkey',function(e){
		var activePageId = $.mobile.activePage.attr('id');
		if(e.keyName==='back'){
				if(activePageId==='page1'||activePageId==='page2'){
					$.mobile.changePage('#home');
				}else{
					history.back();
				}
		}
	});
};

$('#fixed').on('pagebeforeshow',function beforeshow(){
	var date = new Date(),
		startTime = date.getHours()+':'+date.getMinutes();
	alert('hi');
	$('#startTime').val(startTime);
});
*/
var moneys=[];
$(document).ready(function () {
    var mainList = $('#cd-timeline');
    var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        eDay = (new Date(year, month, 0)).getDate();

    if(month<10)
      month='0'+month;
    var firstDay = year+"-"+month+"-"+"01",
        lastDay = year+"-"+month+"-"+eDay;


    $("#addExpense").click(function(){
  		GoldLucksDB.insertData("fromExpense");
      GoldLucksDB.getMoney(firstDay,lastDay);
      getMoney(firstDay,lastDay);
      //console.log(moneys.length);
  	});

  	$("#addIncome").click(function(){
  		GoldLucksDB.insertData("fromIncome");
  	});

    function computeDate(){

    }

    function home_init() {
        var date = new Date(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            eDay = (new Date(year, month, 0)).getDate();

        $('#mainMonth').html(year + '-' + month);
        mainList.empty();

        for (var i = 1; i < eDay+1; i++) {
            /*list += '<div class = "cd-timeline-block">'
                        + '<div class="cd-timeline-img">'
                            + '<span class="cd-date">' + i + '</span>'
                        + '</div>'
                        + '<div class = "cd-timeline-content">'
                            + '<ul data-role="listview">'
                                + '<li>Food'
                                    + '<p class="ui-li-aside">(-1200)(won)</p>'
                                + '</li>'
                            + '</ul>'
                        + '</div>'
                    + '</div>';
                    */
            mainList.append('<div class="cd-timeline-block"id="block' + i + '"></div>');
            $('.cd-timeline-block#block' + i).append('<div class="cd-timeline-img" id="img' + i + '"></div>', '<div class="cd-timeline-content"id="content' + i + '"></div>');
            $('div[id="img' + i + '"]').append('<span class="cd-date">' + i + '</span>');
            $('.cd-timeline-content#content' + i).append('<ul data-role="listview" id="ul' + i + '"></ul>');
            $('ul[id="ul' + i + '"]').append('<li>Food<p class="ui-li-aside">(-1200)(won)</p></li>');
            $('ul[id="ul' + i + '"]').listview().listview('refresh');
        }
    }
    home_init();
    //alert(typeof(moneys));

    function getMoney(firstDay,lastDay){

    }

});
