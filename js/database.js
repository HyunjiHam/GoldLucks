function GoldLucksDB(){
}

(function strict(){
  GoldLucksDB.prototype={

    init : function init(){
      this.expenseArray = [];
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

      this.db.transaction(function(tx){
        tx.executeSql(
          "INSERT INTO book(bookName,masterId) VALUES (?,?);",
          ['My Account Book','Default'],
          function onSuccess() {
            return;
          },
          function onError(e) {
            alert("Error:" + e.message);
          }
        );
      });
  	},

    insertData : function insertData(fromWhere,money){
      var db = this.db;
      if(fromWhere === "fromExpense"){

  			db.transaction(function(tx){
  				tx.executeSql(
  					"INSERT INTO money(date, amount, used, category, method, income, memo) VALUES (?,?,?,?,?,?,?);",
            [money.date,money.amount,money.used,money.category,money.method,0,money.memo],
  					function onSuccess() {//run if SQL succeeds
              return;
  					},
  					function onError(e) { //run if SQL fails
  						alert("Error:" + e.message);
  					}
  				);
  			});
  		}

  		if(fromWhere === "fromIncome"){
  			db.transaction(function(tx){
  				tx.executeSql(
  					"INSERT INTO money(date, amount, used, income, memo) VALUES (?,?,?,?,?);",
  					[money.date, money.amount, money.used, 1, money.memo],
  					function onSuccess() {//run if SQL succeeds
  						return;
  					},
  					function onError(e) { //run if SQL fails
  						alert("Error:" + e.message);
  					}
  				);
  			});
  		}
  	},

    insertBook: function insertBook(bName,writer){
      var db = this.db;
      db.transaction(function(tx){
        tx.executeSql(
          "INSERT INTO book(bookName, masterId) VALUES (?,?);",
          [bName,writer],
          function onSuccess() {//run if SQL succeeds
            return;
          },
          function onError(e) { //run if SQL fails
            alert("Error:" + e.message);
          }
        );
      });
    },

    createTable : function createTable(db){
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
              		"(_id INTEGER PRIMARY KEY,"+
              		"bookName VARCHAR(20) NOT NULL DEFAULT 'My Account Book',"+
              		"date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,"+
              		"amount FLOAT NOT NULL,"+
              		"used VARCHAR(30) NOT NULL,"+
              		"category INT(1),"+
              		"method INT(1),"+
              		"income INT(1) NOT NULL,"+
              		"memo VARCHAR(50) )" );
          });
    },

    getExpenses : function getExpenses(catNum2Text,analysis){
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
        var db = this.db;


        db.transaction(function(t){
            t.executeSql("SELECT SUM(amount) AS sumAmount, category FROM money WHERE income=? AND (date >= ? AND date <= ?) GROUP BY category",[0,firstDay, todayString],
				function(tran, r) {
          analysis.db.expenseArray=[];
				    for (var i = 0; i < r.rows.length; i++){
				        var row = r.rows.item(i);
				        var sumAmount = row.sumAmount;
				        var category = row["category"];

				        //js obj
				        var expensePerCat = {
				            "cat" : category,
				            "amount" : sumAmount
				        };
				        analysis.db.expenseArray.push(expensePerCat);
				    }
            console.log(analysis.db.expenseArray);
				    catNum2Text.apply(analysis,analysis.db.expenseArray);
				}, function(t, e) {
				    alert("Error:" + e.message);
				}
			);
        });
    },

    getTotalExpense : function getTotalExpense(){
      var db = this.db;
        db.transaction(function(t){
            var dateee = new Date();
            var year = dateee.getFullYear();
            var month = dateee.getMonth()+1;
            if(month<10) month = "0"+month;
            var day = dateee.getDate();
            if(day<10) day = "0"+day;
            var firstDay=year+"-"+month+"-"+"01";
            var dateString = year+"-"+month+"-"+day;

            t.executeSql("SELECT amount FROM money WHERE income=? AND (date >= ? AND date <= ?)",[0,firstDay, dateString],
				function(tran, r) {
				    for (var i = 0; i < r.rows.length; i++) {
				        var row = r.rows.item(i);
				        var amount = row["amount"];
				    }
				}, function(t, e) {
				    alert("Error:" + e.message);

				}
			);
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
                          mainpage.moneys.push(money);
                          console.log(typeof(mainpage.moneys)+mainpage.moneys.length);
                      }
                      console.log('getMoney() in database is done');
                      if(typeof(printMoney)==="function"){
                        console.log(mainpage);
                        printMoney.apply(mainpage,mainpage.moneys);
                      }
                  },function(tx,e){
                      alert("Error:"+e.message);
                  }
              );
          });
      },

    shareBook : function shareBook(bookName,groupName,userId){
    	$.ajax({
    		url: "http://localhost:3000/book/"+userId+"/"+bookName+"/"+groupName,
    		crossDomain : true,
    		success: function(result){
    			console.log(result);
    		},
    		error: function(xhr) {
    			console.log('실패 - ', xhr);
    		}
        });
      },
      
      
     sendMoney : function sendMoney(){
    	 $.ajax({
    		   type : "POST",
    		   url : "http://localhost:3000/money/",
    		   crossDomain : true,
    		   data : {bookName: bookName, amount: amount, used: used, category: category, method: method, income: income, memo: memo} ,
    		   dataType : "json",
    		   success: function(data){    
    			   console.log(result);
    		    },
    		   error : function (data) {
    		    alert('실패 - .', xhr);
    		   }  
    		  });
     }
      

      getBook : function getBook(mainpage,printList){
        db=this.db;
        db.transaction(function(t){
          t.executeSql("SELECT bookName, masterId FROM book",[],
            function(tran, r) {
              var bookList = [];
              var book = {};
              for (var i = 0; i < r.rows.length; i++) {
                var row = r.rows.item(i);
                var bookName = row.bookName;
                if(bookName==="My Account Book"){
                  var masterid = row.masterId;
                }
                book = {
                  'bookName' : bookName,
                  'masterid' : masterid
                }
                bookList.push(book);
              }
              printList(mainpage,bookList);
            }, function(t, e) {
                alert("Error:" + e.message);
              }
            );
        });
      }



  }
}());
