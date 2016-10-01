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
      }
  }
}());
