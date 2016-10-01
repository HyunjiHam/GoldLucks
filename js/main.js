function Main(){
  this.moneys=[];
  this.money={};
  this.db = new GoldLucksDB();
  this.db.init();
}

Main.prototype={
  init: function Main_init(){
    var db = this.db;
        this.compute();
        $('#mainMonth').html(this.year + '-' + this.month);
        //this.getMoney();
        //db.getMoney(this.firstDay,this.lastDay,this.printMoney);
        db.getMoney(this.firstDay,this.lastDay,this.printMoney,this);
        //this.moneys = db.moneys;
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
  },

  printMoney: function Main_print_money(moneys){
        var mainList = $('#cd-timeline');
        mainList.empty();
        var moneyList = moneys;
        var money;
        var date;
        if(moneyList!==null){
          for (var j in moneyList){
            date = moneyList[j].date;
            console.log(date);
            alert(date);
          }
        }else{
            console.log('nothing');
            alert('nothing');
        }
        //alert('Hi');
        for (var i = 1; i < this.eDay+1; i++) {
          mainList.append('<div class="cd-timeline-block" id="block' + i + '"></div>');
          $('.cd-timeline-block#block' + i).append('<div class="cd-timeline-img" id="img' + i + '"></div>', '<div class="cd-timeline-content"id="content' + i + '"></div>');
          $('div[id="img' + i + '"]').append('<span class="cd-date">' + i + '</span>');
          $('.cd-timeline-content#content' + i).append('<ul data-role="listview" id="ul' + i + '"></ul>');
          $('ul[id="ul' + i + '"]').append('<li>Food<p class="ui-li-aside">(-1200)(won)</p></li>');
          $('ul[id="ul' + i + '"]').listview().listview('refresh');
        }
  },
  getData : function get_input(){

    var money={};
    money.date = $("#datepicker").val();
		money.amount = $("#eAmount").val();
		money.used = $("#eUsed").val();
		money.category = $("#select1>option:selected").val();
		money.method = $("input:radio[name='radio1']:checked").val();
		money.memo = $("#eMemo").val();
    return money;
  }
}



 $(document).ready(function(){
  $("#page1").on('pagebeforeshow',function(){
    $("#addExpense").click(function(){
      var money = {};
      money = mainpage.getData();
      mainpage.db.insertData("fromExpense",money);
      // GoldLucksDB.getMoney(Mainpage.firstDay,Mainpage.lastDay);
      // Mainpage.printMoney;
      mainpage.init();
      //mainpage.printMoney();
      //getMoney(firstDay,lastDay);
      //console.log(moneys.length);
    });

    $("#addIncome").click(function(){
      mainpage.db.insertData("fromIncome");
    });
  });
  var mainpage = new Main();
  mainpage.init();
  mainpage.printMoney();
});
