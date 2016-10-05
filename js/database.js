var GoldLucksDB={};
var db;
$(document).ready(function(){
	$("#addExpense").click(function(){
		GoldLucksDB.insertData("fromExpense");
		$("#datepicker").val("");
		$("#eAmount").val("");
		$("#eUsed").val("");
		$("#select1").find("option:eq(0)").prop("selected", true);
		catId=0;
		methodId=1;
		$("#eMemo").val("");
	});
	
	$("#addIncome").click(function(){
		GoldLucksDB.insertData("fromIncome");
	});
	
	var catId=0;
	$("#select1").change(function(){
		catId = $(this).val();
	});
	
	
	var methodId = 1;
	$("#radio1, #radio2").click(function(){
		methodId = this.id;
		if(methodId === "radio2")
			methodId = 2;
		else methodId = 1;
	});

    /**
     * It sets define variables for database.
     */
	//database version setting
	var version = 1.0;
	//database name setting
	var dbName = "GoldLucksDB";
	//database display name setting
	var dbDisplayName = "GoldLucksDisplay";
	//database size setting
	var dbSize = 2 * 1024 * 1024;
	
	GoldLucksDB.openDatabase = function(){
		if(window.openDatabase){
			db = openDatabase(dbName, version, dbDisplayName, dbSize);
			GoldLucksDB.createTable(db);
	        
		}else {
	        alert("Web SQL Database not supported");
		}
	};
	
	/**
	 * Store share book info into book table from 'refresh.js'
	 */
	GoldLucksDB.shareBookInfo = function shareBookInfo(infoObj){
		console.log("db.js");
		var bookName, masterId;
		for(var property in infoObj){
			console.log(property);
			if(property === "bookName")
				bookName = infoObj[property];
			else
				masterId = infoObj[property];
		}
		console.log("bookName: "+bookName);
		console.log("masterId: "+masterId);
//		var bookInfoJson = JSON.stringify(infoObj);
//		console.log(bookInfoJson);
//		db.transaction(function(tx){
//			tx.executeSql(
//				"INSERT INTO book(bookName, masterId) VALUES (?,?);",
//				[bookName, masterId],
//				function onSuccess() {//run if SQL succeeds
//					console.log("success");
//				}, 
//				function onError(e) { //run if SQL fails
//					alert("Error:" + e.message);
//				}	
//			);	
//		});
	};
	
	/**
	 * Gets amounts per category
	 */
	var expenseArray = [];
	GoldLucksDB.getExpenses = function getExpenses(callBack){
	    /**
	     * It sets variables for database query.
	     */
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		if(month<10) month = "0"+month;
		var day = today.getDate();
		if(day<10) day = "0"+day;
		var firstDay=year+"-"+month+"-"+"01";
		var todayString = year+"-"+month+"-"+day;
			
		db.transaction(function(t){
			t.executeSql("SELECT SUM(amount) AS sumAmount, category FROM money WHERE income=? AND (date >= ? AND date <= ?) GROUP BY category",[0,firstDay, todayString],
				function(tran, r) {
					for (var i = 0; i < r.rows.length; i++){
						var row = r.rows.item(i);
						var sumAmount = row.sumAmount;
						var category = row["category"];
						
						//js obj
						var expensePerCat = {
							"cat" : category,
							"amount" : sumAmount
						};
						expenseArray.push(expensePerCat);							
					} 
					callBack(expenseArray);
					expenseArray=[];
				}, function(t, e) {
					alert("Error:" + e.message);
				}
			);
		});
	};
	
	/**
	 * Gets total expense & income from the money table
	 */
	GoldLucksDB.getTotalExpenseAndIncome = function getTotalExpense(){
		db.transaction(function(t){
			var dateee = new Date();
			var year = dateee.getFullYear();
			var month = dateee.getMonth()+1;
			if(month<10) month = "0"+month;
			var day = dateee.getDate();
			if(day<10) day = "0"+day;
			var firstDay=year+"-"+month+"-"+"01";
			var dateString = year+"-"+month+"-"+day;
			
			t.executeSql("SELECT SUM(amount) AS sumAmount FROM money WHERE (date >= ? AND date <= ?) GROUP BY income",[firstDay, dateString],
				function(tran, r) {
					var totalExpense, totalIncome, total;
					for (var i = 0; i < r.rows.length; i++) {
						var row = r.rows.item(i);
						if(i === 0) //expense
							totalExpense = row.sumAmount;
						else //income
							totalIncome = row.sumAmount;
					}
					total = totalExpense + totalIncome;
				}, function(t, e) {
					alert("Error:" + e.message);
					
				}
			);
		});
	};
	
	//reads and displays values from the 'places' table
	GoldLucksDB.dataView = function dataView() {
		db.transaction(function(t) {
//			t.executeSql("SELECT * FROM money AND date('now') GROUP BY category", [], 
			var dateee = new Date();
			var year = dateee.getFullYear();
			var month = dateee.getMonth()+1;
			if(month<10) month = "0"+month;
			var day = dateee.getDate();
			if(day<10) day = "0"+day;
			var firstDay=year+"-"+month+"-"+"01";
			var dateString = year+"-"+month+"-"+day;				
			
			t.executeSql("SELECT SUM(amount) AS sumAmount, category FROM money WHERE income=? AND (date >= ? AND date <= ?) GROUP BY category",[0,firstDay, dateString],
				function(tran, r) {
					for (var i = 0; i < r.rows.length; i++) {
						var row = r.rows.item(i);
						var newEntryRow = $("#sampleList").clone();
						newEntryRow.removeAttr("id");
						newEntryRow.removeAttr("style");
						newEntryRow.appendTo("ol");
						var amount = r.rows.item(i).sumAmount;
//						var amount = row["amount"];
//						var date = row["date"];
						var category = row["category"];
//						var income = row["income"];
//						newEntryRow.find(".showDate").text(date);
						newEntryRow.find(".showAmount").text(amount);
//						newEntryRow.find(".showUsed").text(row.used);
						newEntryRow.find(".showCat").text(category);
//						newEntryRow.find(".showMethod").text(row.method);
//						newEntryRow.find(".showIncome").text(income);
//						newEntryRow.find(".showMemo").text(row.memo);
						
						
					}
				}, function(t, e) {
					alert("Error:" + e.message);
				}
			);
		});
	};  
	
	GoldLucksDB.insertData = function insertData(fromWhere){
		if(fromWhere === "fromExpense"){
			var inputDate = $("#datepicker").val(),
				inputAmount = $("#eAmount").val(),
				inputused = $("#eUsed").val(),
				inputCategory = catId,
				inputMethod = methodId,
				inputMemo = $("#eMemo").val();
				console.log("before save in db catId is "+inputCategory);
			db.transaction(function(tx){
				tx.executeSql(
					"INSERT INTO money(date, amount, used, category, method, income, memo) VALUES (?,?,?,?,?,?,?);",
					[inputDate, inputAmount, inputused, inputCategory, inputMethod, 0, inputMemo],
					function onSuccess() {//run if SQL succeeds
						GoldLucksDB.getExpenses(analysis.catNum2Text);
					}, 
					function onError(e) { //run if SQL fails
						alert("Error:" + e.message);
					}	
				);	
			});
			

		}
		
		if(fromWhere === "fromIncome"){
			var inputDate = $("#datepicker2").val(),
			inputAmount = $("#iAmount").val(),
			inputused = $("#iUsed").val(),
			inputMemo = $("#iMemo").val();
			
			db.transaction(function(tx){
				tx.executeSql(
					"INSERT INTO money(date, amount, used, income, memo) VALUES (?,?,?,?,?);",
					[inputDate, inputAmount, inputused, 1, inputMemo],
					function onSuccess() {//run if SQL succeeds
						GoldLucksDB.dataView();
					}, 
					function onError(e) { //run if SQL fails
						alert("Error:" + e.message);
					}	
				);	
			});
		}
	};
	
	GoldLucksDB.createTable = function createTable(db) {

        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS book"+
            		"(bookId INTEGER PRIMARY KEY,"+
            		"bookName VARCHAR(20) NOT NULL,"+
            		"masterId VARCHAR(10) NOT NULL)");
        });
        
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS user"+
            		"(userId VARCHAR(10) PRIMARY KEY," +
            		"userPwd VARCHAR(10) )");
        });

        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS fixedExpenses"+
            		"(_id INTEGER PRIMARY KEY,"+
            		"amount FLOAT NOT NULL,"+
            		"used VARCHAR(20) NOT NULL,"+
            		"category INT(1) NOT NULL,"+
            		"alarmDay INT(11) NOT NULL,"+
            		"alarmHour INT(11) NOT NULL,"+
            		"alarmMinute INT(11) NOT NULL,"+
            		"memo VARCHAR(50) )" );
        });
        
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS money"+
            		"(_id INTEGER PRIMARY KEY,"+
            		"date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,"+
            		"amount FLOAT NOT NULL,"+
            		"used VARCHAR(30) NOT NULL,"+
            		"category INT(1),"+
            		"method INT(1),"+
            		"income INT(1) NOT NULL,"+
            		"memo VARCHAR(50),"+
            		"bookId INTEGER DEFAULT 0,"+
            		"FOREIGN KEY(bookId) REFERENCES book(bookId) )" );
        });
    };
	
    (GoldLucksDB.openDatabase());
    


});
