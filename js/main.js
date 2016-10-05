function Main(){
  this.moneys=[];
  this.money={};
  this.db = new GoldLucksDB();
  this.db.init();
  this.analysis = new Analysis(this.db);
  this.userid;
  this.currentBook="My Account Book";
}

Main.prototype={
  init: function Main_init(){
    var db = this.db;
        this.compute();
        $('#mainMonth').html(this.year + '-' + this.month);
        db.getMoney(this.firstDay,this.lastDay,this.printMoney,this);
 //       db.getID();
  },

  compute : function Main_compute_date(){
        this.date = new Date(),
        this.year = this.date.getFullYear(),
        this.month = this.date.getMonth() + 1,
        this.eDay = (new Date(this.year, this.month, 0)).getDate();
        if(this.month<10)
          this.month='0'+this.month;
        this.firstDay = this.year+"-"+this.month+"-"+"01",
        this.lastDay = this.year+"-"+this.month+"-"+this.eDay;
        this.today = new Date();
  },

  printMoney: function Main_print_money(moneys){
        var mainList = $('#cd-timeline');
        mainList.empty();
        var time,
            money,
            check;
        if(moneys!==undefined){
          for (var i = this.eDay; i >= 0; i--) {
            check=0;
            for(var j in this.moneys){
              money = this.moneys[j];
              time=money.date.split('-');
              if(parseInt(time[2])===i){
                //this is the first time to insert money to i-th day
                if(check===0){
                  mainList.append('<div class="cd-timeline-block" id="block' + i + '"></div>');
                  $('.cd-timeline-block#block' + i).append('<div class="cd-timeline-img" id="img' + i + '"></div>', '<div class="cd-timeline-content"id="content' + i + '"></div>');
                  $('div[id="img' + i + '"]').append('<span class="cd-date">' + i + '</span>');
                  $('.cd-timeline-content#content' + i).append('<ul data-role="listview" id="ul' + i + '"></ul>');
                  check=1;
                }
                if(check===1){
                  if(money.income===0){//in case of expense
                    $('ul[id="ul' + i + '"]').append('<li>'+money.used+'<p class="ui-li-aside">'+money.amount+'(won)</p></li>');
                    $('ul[id="ul' + i + '"]').listview().listview('refresh');
                    console.log("find expense money in moneyList");
                  }
                  if(money.income===1){//in case of income
                    $('ul[id="ul' + i + '"]').append('<li>'+money.used+'<p class="ui-li-aside">'+money.amount+'(won)</p></li>');
                    $('ul[id="ul' + i + '"]').listview().listview('refresh');
                    console.log("find income money in moneyList");
                  }
                }
              }
            }
          }
        }else{
          var today = this.today.getDate();
          mainList.append('<div class="cd-timeline-block" id="block' + today + '"></div>');
          $('.cd-timeline-block#block' + today).append('<div class="cd-timeline-img" id="img' + today + '"></div>', '<div class="cd-timeline-content"id="content' + today + '"></div>');
          $('div[id="img' + today + '"]').append('<span class="cd-date">' + today + '</span>');
          $('.cd-timeline-content#content' + today).append('<ul data-role="listview" id="ul' + today + '"></ul>');
          $('ul[id="ul' + today + '"]').append("<li><h1>Please insert today's money list!</h1><p class='ui-li-aside'></p></li>");
          $('ul[id="ul' + today + '"]').listview().listview('refresh');
          console.log('nothing in money DB yet');
        }
  },

  getData : function get_input(fromWhere){
    var money={};
    if(fromWhere==="fromExpense"){
      money.date = $("#datepicker").val();
  		money.amount = $("#eAmount").val();
  		money.used = $("#eUsed").val();
  		money.category = $("#select1>option:selected").val();
  		money.method = $("input:radio[name='radio1']:checked").val();
  		money.memo = $("#eMemo").val();
    }
    if(fromWhere==="fromIncome"){
      money.date = $("#datepicker2").val();
      money.amount = $("#iAmount").val();
      money.used = $("#iUsed").val();
      money.memo = $("#iMemo").val();
    }
    return money;
  },

  setId : function setId(userid){
    if(this.userid===undefined){
      this.userid=userid;
    }else{
      alert('You already have your own ID :'+this.userid);
    }
  },

  getId : function getId(){
	  var db = this.db;
	  console.log(db);
	  db.getID(this);
//    if(this.userid!==undefined){
//      return this.userid;
//    }else{
//      alert('You need new ID');
//    }
  },
}



 $(document).ready(function(){

  $("#addExpense").click(function(){
    var money = {};
    money = mainpage.getData("fromExpense");
    mainpage.db.insertData("fromExpense",money);
    mainpage.init();
  });

  $("#addIncome").click(function(){
    var money = {};
    money = mainpage.getData("fromIncome");
    mainpage.db.insertData("fromIncome",money);
    mainpage.init();
  });


  $("#analysis").on('pagebeforeshow',function(){
    var catArr=[];
    $("#select1").find("option").each(function() {
        catArr.push($(this).text());
    });
    //mainpage.analysis.init();
    mainpage.analysis.catArr = catArr;
    mainpage.db.getExpenses(mainpage.analysis.catNum2Text,mainpage.analysis);
  });

  $('#sharebtn').click(function(){
    var userid = mainpage.getId();
    var bookName = $('#sbook').val();
    var groupName = $('#sGroup').val();
    var shareWith = $('#with1').val();
    if(userid!==undefined){
      mainpage.db.insertBook(bookName,userid);
      mainpage.db.shareBook(bookName,groupName,userid);
      mainpage.db.sendShareBook(bookName,userid);
      $.mobile.changePage('#share');
    }else{
      $.mobile.changePage('#setting');
    }
  });

  $('#signbtn').click(function(){
    var userid = $('#un').val();
    if(userid!==undefined){
      mainpage.setId(userid);
      alert('Your id is "'+userid+'"');
    }
    mainpage.db.setID(userid);
  });


  var mainpage = new Main();
  mainpage.init();
  


  	$('#refreshbtn').click(function(){
  		mainpage.db.refreshFromServer(mainpage.db);
  	});
  
});
