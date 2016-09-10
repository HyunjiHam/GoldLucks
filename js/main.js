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

window.onload = function(){
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
