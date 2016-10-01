// var catId=1;
// $("#cat1, #cat2, #cat3, #cat4, #cat5, #cat6").click(function(){
//   catId = this.id;
//   if (catId === "cat2")
//     catId = 2;
//   else if (catId === "cat3")
//     catId = 3;
//   else if (catId === "cat4")
//     catId = 4;
//   else if (catId === "cat5")
//     catId = 5;
//   else if (catId === "cat6")
//     catId = 6;
//   else
//     catId = 1;
// });
//
// var methodId = 1;
// $("#radio1, #radio2").click(function(){
//   methodId = this.id;
//   if(methodId === "radio2")
//     methodId = 2;
//   else methodId = 1;
// });

function GoldLucksDB(){

}

(function strict(){
  GoldLucksDB.prototype={

  init : function init(){
    this.db={};
    this.version = 1.0;
    this.dbName="GoldLucksDB";
    this.dbDisplayName="GoldLucksDisplay";
    this.dbSize = 2*1024*1024;
    this.moneys=[];
    this.openDatabase();
  },

  openDatabase : function(){
		if(window.openDatabase){
			this.db = openDatabase(this.dbName, this.version, this.dbDisplayName, this.dbSize);
			this.createTable(this.db);
		}else {
	        alert("Web SQL Database not supported");
		}
	},

  dataView : function dataView(){
    var db = this.db;
    db.transaction(function(t) {
			t.executeSql("SELECT * FROM money", [],
				function(tran, r) {
					for (var i = 0; i < r.rows.length; i++) {
						console.log('dataView:'+i);
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
          }
      }, function(t, e) {
        alert("Error:" + e.message);
        }
    );
  });
},

  insertData : function insertData(fromWhere,money){
    var db = this.db;
    if(fromWhere === "fromExpense"){
			// var inputDate = $("#datepicker").val(),
			// 	inputAmount = $("#eAmount").val(),
			// 	inputused = $("#eUsed").val(),
			// 	inputCategory = catId,
			// 	inputMethod = methodId,
			// 	inputMemo = $("#eMemo").val();

			db.transaction(function(tx){
				tx.executeSql(
					"INSERT INTO money(date, amount, used, category, method, income, memo) VALUES (?,?,?,?,?,?,?);",
					//[inputDate, inputAmount, inputused, inputCategory, inputMethod, 0, inputMemo],
          [money.date,money.amount,money.used,money.category,money.method,0,money.memo],
					function onSuccess() {//run if SQL succeeds
            return;
						//GoldLucksDB.dataView();
					},
					function onError(e) { //run if SQL fails
						alert("Error:" + e.message);
					}
				);
			});

			// $("#datepicker").val("");
			// $("#eAmount").val("");
			// $("#eUsed").val("");
			// catId=1;
			// methodId=1;
			// $("#eMemo").val("");
		}

		if(fromWhere === "fromIncome"){
			// var inputDate = $("#datepicker2").val(),
			// inputAmount = $("#iAmount").val(),
			// inputused = $("#iUsed").val(),
			// inputMemo = $("#iMemo").val();

			db.transaction(function(tx){
				tx.executeSql(
					"INSERT INTO money(date, amount, used, income, memo) VALUES (?,?,?,?,?);",
					[money.date, money.amount, money.used, 1, money.memo],
					function onSuccess() {//run if SQL succeeds
						this.dataView();
					},
					function onError(e) { //run if SQL fails
						alert("Error:" + e.message);
					}
				);
			});
		}
	},

  createTable : function createTable(db){
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
            		"memo VARCHAR(50) )" );
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
    },


    getMoney : function getMoney(firstDay,lastDay,printMoney,mainpage){
      var money={};
      var db = this.db;
      mainpage.moneys=[];
      db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM money WHERE (date>=? AND date<=?)",[firstDay,lastDay],
                function(tran,r){
                    for(var i=0;i<r.rows.length;i++){
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
                    }
										//console.log(r.rows.length);
                    for(var i=0;i<r.rows.length;i++){
                        var row = r.rows.item(i);
	                      var date = row.date,
	                              amount = row.amount,
	                              used = row.used,
	                              category = row.category,
	                              method = row.method,
	                              income = row.income,
	                              memo = row.memo;
                        money={
                            'date': date,
                            'amount': amount,
                            'used' : used,
                            'category' : category,
                            'method' : method,
                            'income' : income,
                            'memo' : memo
                        }
												//console.log(date);
                        mainpage.moneys.push(money);
                        console.log(typeof(mainpage.moneys)+mainpage.moneys.length);
                    }
                    console.log('getMoney() in database is done');
                    if(typeof(printMoney)==="function"){
                      console.log(mainpage);
                      printMoney.apply(mainpage,mainpage.moneys);
                    }
										//Mainpage.printMoney;
                },function(tx,e){
                    alert("Error:"+e.message);
                }
            );
        });
    }
}
}());
