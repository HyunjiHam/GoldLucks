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
  	},

    insertData : function insertData(fromWhere,money){
      var db = this.db;
      var shareBN = "Secondbook";
      if(fromWhere === "fromExpense"){

    	  if(shareBN === "My Account Book"){
    		  console.log("shareBN: "+shareBN);
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
    	  else{	// When user writes sharing book account
    			db.transaction(function(tx){
    				console.log("shareBN: "+shareBN);
      				tx.executeSql(
      					"INSERT INTO money(date, bookName, amount, used, category, method, income, memo) VALUES (?,?,?,?,?,?,?,?);",
                [money.date,shareBN,money.amount,money.used,money.category,money.method,0,money.memo],
      					function onSuccess() {//run if SQL succeeds
      						console.log("통신되어라 얍얍");
      				    	 $.ajax({
      			    		   type : "POST",
      			    		   url : "http://localhost:3000/money/",
      			    		   crossDomain : true,
      			    		   data : {bookName: shareBN, amount: money.amount, used: money.used, category: money.category, method: money.method, income: 0, memo: money.memo} ,
      			    		   dataType : "json",
      			    		   success: function(result){
      			    			   console.log(result);
      			    		    },
      			    		   error : function (result) {
      			    		    alert('실패 - .', result);
      			    		   }
      			    	 });
      					},
      					function onError(e) { //run if SQL fails
      						alert("Error:" + e.message);
      					}
      				);
      			});
    	  }

  		}

  		if(fromWhere === "fromIncome"){
  			if(shareBN === "My Account Book"){
  			db.transaction(function(tx){
  				console.log("shareBN: "+shareBN);
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
      	  else{	// When user writes sharing account book
  			db.transaction(function(tx){
  				console.log("shareBN: "+shareBN);
    				tx.executeSql(
    					"INSERT INTO money(date, bookName, amount, used, category, method, income, memo) VALUES (?,?,?,?,?,?,?,?);",
              [money.date,shareBN,money.amount,money.used,money.category,money.method,0,money.memo],
    					function onSuccess() {//run if SQL succeeds
    						console.log("통신되어라 얍얍");
    				    	 $.ajax({
    			    		   type : "POST",
    			    		   url : "http://localhost:3000/money/",
    			    		   crossDomain : true,
    			    		   data : {bookName: shareBN, amount: money.amount, used: money.used, category: money.category, method: money.method, income: 1, memo: money.memo} ,
    			    		   dataType : "json",
    			    		   success: function(result){
    			    			   console.log(result);
    			    		    },
    			    		   error : function (data) {
    			    		    alert('실패 - .', result);
    			    		   }
    			    	 });
    					},
    					function onError(e) { //run if SQL fails
    						alert("Error:" + e.message);
    					}
    				);
    			});
  	  }
  		}
  	},

    insertBook: function insertBook(bName,writer){
      var db = this.db;
      db.transaction(function(tx){
        tx.executeSql(
          "INSERT INTO book(bookName, masterId) VALUES (?,?);",
          [bName,writer],
          function onSuccess() {//run if SQL succeeds
        	  console.log("book테이블에 저장함");
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
                  "masterId VARCHAR(10) NOT NULL)",[],
            		function onSuccess() {
            	  		db.transaction(function(tx){
            	  			tx.executeSql(
            	  					"INSERT INTO book(bookId, bookName,masterId) VALUES (?,?,?);",
            	  					[1,'My Account Book','Default']);
            	  		});
              		});
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
                          };
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
    			console.log("save to the book table in server!");
    			console.log(result);
    		},
    		error: function(xhr) {
    			console.log('실패 - ', xhr);
    		}
        });

    },
    
    sendShareBook : function sendShareBook(bookName,userId){
    	$.ajax({
    		url: "http://localhost:3000/user/"+userId+"/"+bookName,
    		crossDomain : true,
    		success: function(result){
    			console.log("save to user table");
    			console.log(result);
    		},
    		error: function(xhr) {
    			console.log('실패 - ', xhr);
    		}
        });
    },
    
	getMoneyFromServer : function getMoneyFromServer(bookName){
		var date, amount, used, category, method, income, memo;
		var db = this.db;
		$.ajax({
				url: "http://localhost:3000/money/"+bookName,
				crossDomain : true,
				success: function(resultObj){
            		console.log(resultObj);
            		$.each(resultObj, function(key, val){
            			date = val.date;
            			bookName = val.bookName; 
            			amount = val.amount;
            			used = val.used;
            			category = val.category;
            			method = val.method;
            			income = val.income;
            			memo = val.memo;
            		});
            		
            		db.transaction(function(tx){
            			tx.executeSql(
            					"INSERT INTO money(date, bookName, amount, used, category, method, income, memo) VALUES (?,?,?,?,?,?,?,?);",
            				[date, bookName, amount, used, category, method, income, memo],
            				function onSuccess() {//run if SQL succeeds
            					console.log("서버로부터 돈 받아서 테이블에 넣었당~~~~~~~");
            				}, 
            				function onError(e) { //run if SQL fails
            					alert("Error:" + e.message);
            				}	
            			);	
            		});
				},
			    error: function(xhr) {
			        console.log('실패 - ', xhr);
			     }
       	});

	},


	    

    shareBookInfo : function shareBookInfo(self,infoObj){
		console.log("db.js");
		var bookName, masterId;
		var db = this.db;
		$.each(infoObj, function(key, val){
			bookName = val.bookName;
			masterId = val.userId;
		});

		db.transaction(function(tx){
			tx.executeSql(
				"INSERT INTO book(bookName, masterId) VALUES (?,?);", [bookName, masterId],
				function onSuccess() {//run if SQL succeeds
					console.log("정보 받아와서 book테이블에 넣었당~~~");
					self.getMoneyFromServer(bookName);
				}, 
				function onError(e) { //run if SQL fails
					alert("Error:" + e.message);
				}	
			);	
		});
	},
    
	/**
	 * 이거 수정해야되욤~~~~ userId는 사용자 고유 아이디만 들어가
	 * @param db
	 */
//		refreshFromServer : function refreshFromServer(userid){
	refreshFromServer : function refreshFromServer(db){
		var self = db;
		var userId = "clara";
		$.ajax({
				url: "http://localhost:3000/refresh/"+userId,
				crossDomain : true,
				success: function(result){
            		console.log(result);
            		self.shareBookInfo(self,result);
				},
			    error: function(xhr) {
			        console.log('실패 - ', xhr);
			     }
       	});
	},
	
	setID : function setId(userId){
		var db = this.db;
		db.transaction(function(tx){
			tx.executeSql(
				"INSERT INTO user(userId) VALUES (?);",	[userId],
				function onSuccess() {//run if SQL succeeds
					console.log("userId 받아와서 user 테이블에 넣었당~~~");
				}, 
				function onError(e) { //run if SQL fails
					alert("Error:" + e.message);
				}	
			);	
		});
	},
	
	getID : function getID(mainpage){
		var db = this.db;
		db.transaction(function(tx){
			tx.executeSql(
				"SELECT userId FROM user;",	[],
				function(tran, r) {
				    for (var i = 0; i < r.rows.length; i++) {
				        var row = r.rows.item(i);
				        var userId = row["userId"];
				        console.log(userId);
				        
				    }
				    mainpage.userid=userId;
				    if(mainpage.userid===undefined){
				    	//mainpage.setId();
				    	alert('You need new ID');
				    }
				},function(tx,e){
                    alert("You need new ID");
                }
			);	
		});
	},
		
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


