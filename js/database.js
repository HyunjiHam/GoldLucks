var db;
$(document).ready(function(){
	$("#addExpense").click(function(){
		insertData("fromExpense");
	});
	
	$("#addIncome").click(function(){
		insertData("fromIncome");
	});
	
	var catId=1;
	$("#cat1, #cat2, #cat3, #cat4, #cat5, #cat6").click(function(){
		catId = event.target.id;
		switch (catId) {
		case "cat1":
			catId=1;
			break;
		case "cat2":
			catId=2;
			break;
		case "cat3":
			catId=3;
			break;
		case "cat4":
			catId=4;
			break;
		case "cat5":
			catId=5;
			break;
		case "cat6":
			catId=6;
			break;	
		default:
			break;
		}
	});
	
	var methodId = 1;
	$("#radio1, #radio2").click(function(){
		methodId = event.target.id;
		if(methodId === "radio2")
			methodId = 2;
		else methodId = 1;
	});

	//database version setting
	var version = 1.0;
	//database name setting
	var dbName = "GoldLucksDB";
	//database display name setting
	var dbDisplayName = "GoldLucksDisplay";
	//database size setting
	var dbSize = 2 * 1024 * 1024;
	
	if(window.openDatabase){
		db = openDatabase(dbName, version, dbDisplayName, dbSize);
		createTable(db);
        
	}else {
        alert("Web SQL Database not supported");
    }

	
	//reads and displays values from the 'places' table
	function dataView() {
		db.transaction(function(t) {
			t.executeSql("SELECT * FROM money", [], 
				function(tran, r) {
					for (var i = 0; i < r.rows.length; i++) {
//						var id = r.rows.item(i).id;
//						var date = r.rows.item(i).date;
//						var amount = r.rows.item(i).amount;
//						var used = r.rows.item(i).used;
//						var category = r.rows.item(i).category;
//						var method = r.rows.item(i).method;
//						var memo = r.rows.item(i).memo;
						var row = r.rows.item(i);
						var newEntryRow = $("#sampleList").clone();
						newEntryRow.removeAttr("id");
						newEntryRow.removeAttr("style");
						newEntryRow.appendTo("ol");
						newEntryRow.find(".showDate").text(row.date);
						newEntryRow.find(".showAmount").text(row.amount);
						newEntryRow.find(".showUsed").text(row.used);
						newEntryRow.find(".showCat").text(row.category);
						newEntryRow.find(".showMethod").text(row.method);
						newEntryRow.find(".showIncome").text(row.income);
						newEntryRow.find(".showMemo").text(row.memo);
						
						//data list rendering
//						html.innerHTML += " " + id + " " + date + " " + amount + " " + used + " " + memo + "<br/>";


//						if(toWhere === "page1"){ //page1
//							var innerHtml = $("#testcase").html();
//							$("#testcase").html(innerHtml + id + " " + date + " " + amount + " " + used + " " + memo+"<br/>");

//						}
					}
				}, function(t, e) {
					alert("Error:" + e.message);
				}
			);
		});
	}  
	
	function insertData(fromWhere){
		if(fromWhere === "fromExpense"){
			var inputDate = $("#datepicker").val(),
				inputAmount = $("#eAmount").val(),
				inputused = $("#eUsed").val(),
				inputCategory = catId,
				inputMethod = methodId;
				inputMemo = $("#eMemo").val();
			
			db.transaction(function(tx){
				tx.executeSql(
					"INSERT INTO money(date, amount, used, category, method, income, memo) VALUES (?,?,?,?,?,?,?);",
					[inputDate, inputAmount, inputused, inputCategory, inputMethod, 0, inputMemo],
					function onSuccess() {//run if SQL succeeds
						dataView();
					}, 
					function onError(e) { //run if SQL fails
						alert("Error:" + e.message);
					}	
				);	
			});
			
			$("#datepicker").val("");
			$("#eAmount").val("");
			$("#eUsed").val("");
			catId=1;
			methodId=1;
			$("#eMemo").val("");
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
						dataView();
					}, 
					function onError(e) { //run if SQL fails
						alert("Error:" + e.message);
					}	
				);	
			});
		}
	}
	
    function createTable(db) {

        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS book"+
            		"(bookName VARCHAR(20) PRIMARY KEY,"+
            		"masterId VARCHAR(10) NOT NULL)");
        });
        
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS user"+
            		"(userId VARCHAR(10) PRIMARY KEY," +
            		"userPwd VARCHAR(10) )");
        });

        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS fixedExpenses"+
            		"(id INT(11) PRIMARY KEY,"+
            		"amount FLOAT NOT NULL,"+
            		"used VARCHAR(20) NOT NULL,"+
            		"category INT(1) NOT NULL,"+
            		"alarmDay INT(11) NOT NULL,"+
            		"alarmHour INT(11) NOT NULL,"+
            		"alarmMinute INT(11) NOT NULL,"+
            		"bookName VARCHAR(20), NOT NULL," +
            		"FOREIGN KEY(bookName) REFERENCES book(bookName) )");
        });
        
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS money"+
            		"(id INT PRIMARY KEY,"+
            		"date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,"+
            		"amount FLOAT NOT NULL,"+
            		"used VARCHAR(30) NOT NULL,"+
            		"category INT(1),"+
            		"method INT(1),"+
            		"income INT(1) NOT NULL,"+
            		"memo VARCHAR(50) )" );
        });
    }
	

});