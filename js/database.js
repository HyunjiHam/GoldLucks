var db;
//database version setting
var version = 1.0;
//database name setting
var dbName = "GoldLucksDB";
//database display name setting
var dbDisplayName = "GoldLucksDisplay";
//database size setting
var dbSize = 2 * 1024 * 1024;


(function initDB(){
	if(window.openDatabase){
		db = openDatabase(dbName, version, dbDisplayName, dbSize);
		createTable(db);
        
	}else {
        alert("Web SQL Database not supported");
    }
}());
	


	$("#addExpense").click(function(){
		insertData("fromExpense");
	});
	
	$("#addIncome").click(function(){
		insertData("fromIncome");
	});
	
//	$("#fixed-add-btn").click(function(){
//		insertData("fromFixed");
//	});
	
	var catId=1;
	$("#cat1, #cat2, #cat3, #cat4, #cat5, #cat6").click(function(){
		catId = this.id;
		if (catId === "cat2")
			catId = 2;
		else if (catId === "cat3")
			catId = 3;
		else if (catId === "cat4")
			catId = 4;
		else if (catId === "cat5")
			catId = 5;
		else if (catId === "cat6")
			catId = 6;
		else
			catId = 1;
	});
	
	var methodId = 1;
	$("#radio1, #radio2").click(function(){
		methodId = this.id;
		if(methodId === "radio2")
			methodId = 2;
		else methodId = 1;
	});

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
				inputMethod = methodId,
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
		
		else if(fromWhere === "fromIncome"){
			var inputDate = $("#datepicker2").val(),
			inputAmount = $("#iAmount").val(),
			inputused = $("#iUsed").val(),
			inputMemo = $("#iMemo").val();
			
			db.transaction(function(tx){
				tx.executeSql(
					"INSERT INTO money(date, amount, used, income, memo) VALUES (?,?,?,?,?);",
					[inputDate, inputAmount, inputused, 1, inputMemo],
					function onSuccess() {//run if SQL succeeds
					//	dataView();
					}, 
					function onError(e) { //run if SQL fails
						alert("Error:" + e.message);
					}	
				);	
			});
			
			$("#datepicker2").val("");
			$("#iAmount").val("");
			$("#iUsed").val("");
			$("#iMemo").val("");
		}
		
		else if(fromWhere === "fromFixed"){
			var inputAmount = $("#fixedAmount").val(),
			inputused = $("#fixedUsage").val(),
			inputCategory = catId,
			inputMethod = methodId,
			inputMemo = $("#fixedMemo").val();

			date = datapickerValue2Date(expense.time);
			inputHour=date.getHours();
			inputMinute=date.getMinutes();
		
			db.transaction(function(tx){
			tx.executeSql(
				"INSERT INTO fixedExpenses(amount, used, category, method, alarmHour, alarmMinute, memo) VALUES (?,?,?,?,?,?,?);",
				[inputAmount, inputused, inputCategory, inputMethod, inputHour, inputMinute, inputMemo],
					function onSuccess() {//run if SQL succeeds
						//dataView();
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
//            		"alarmDay INT(11) NOT NULL,"+
            		"alarmHour INT(11) NOT NULL,"+
            		"alarmMinute INT(11) NOT NULL,"+
            		"memo VARCHAR(50) )" );
//            		"bookName VARCHAR(20), NOT NULL," +
//            		"FOREIGN KEY(bookName) REFERENCES book(bookName) )");
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
	
