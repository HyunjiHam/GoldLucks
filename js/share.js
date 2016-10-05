var share={};
$(document).ready(function () {

	/**
	 * Get JSON from server and store to db*/
	share.getFromServer = function getFromServer(Callback){
		$.ajax({
				url: "http://localhost:3000/refresh/sally",
				crossDomain : true,
				success: function(result){
            		console.log(result);
            		Callback(result);
				},
			    error: function(xhr) {
			        console.log('실패 - ', xhr);
			     }
       	});

	};
//	(share.getFromServer());
	(share.getFromServer(GoldLucksDB.shareBookInfo));
});