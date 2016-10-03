
function Alarm(){

}

Alarm.prototype={
  init: function init(){
    //initDB();
    this.expenses = window.localStorage.getItem('expenses');
    this.expenses = this.expenses ? JSON.parse(this.expenses) : [];
    this.displayList(this.expenses);
  },

  padZero: function padZero(number) {
      number = number.toString();
      if (number.length === 1) {
          return '0' + number;
      }
      return number;
  },

  datapickerValue2Date : function datapickerValue2Date(value) {
      var date = new Date(),
          time = value.split(':'),
          day = $('#select2>option:selected').val();
      //이달 그날이 이미 지나지 않았다면 이달부터 아니면 다음달부터..
      date.setDate(parseInt(day), 10);
      date.setHours(parseInt(time[0], 10));
      date.setMinutes(parseInt(time[1], 10));
      date.setSeconds(0);
      alert(date);
      return date;
  },

  addAlarm: function addAlarm(expense) {
      var alarm = {},
          date = '';
      //appControl={};
      try {
          date = this.datapickerValue2Date(expense.time);
          alarm = new tizen.AlarmAbsolute(date);
          tizen.alarm.add(alarm, tizen.application.getCurrentApplication().appInfo.id);
      } catch (e) {
          console.error(e);
      } finally {
          return alarm.id;
      }
  },

  updateStorage: function updateStorage() {
      try {
          window.localStorage.setItem(
              'expenses',
              JSON.stringify(this.expenses)
              );
          alert('saved');
      } catch (e) {
          if (e.code === 22) {
              alert('there is no enough memory to save data');
          } else {
              alert('error code is not 22');
          }
      }
  },

  saveAlarm: function saveAlarm(expense) {
      var alarmId = this.addAlarm(expense);

      if (alarmId) {
          expense.id = alarmId;
          this.expenses.push(expense);
          this.updateStorage();
      }
  },

  displayList: function displayList(expenses) {
      var len = 0,
          expense = null,
          alarmList = document.getElementById('alarmList'),
          list = '';
      len = this.expenses.length;
      if(len===0){
        list = '<li><a href="#fixedadd"><h1>Please  insert  your  monthly fixed  expense!</h1></a></li>';
      }else{
        for (var i = 0; i < len;i++) {
            expense = $.extend({}, this.expenses[i]);
            list += '<li><a href="#fixedadd">Used:'+expense.usage+' &nbsp;&nbsp;&nbsp;Amount:' + expense.amount + '</a></li>';
        }
      }
      alarmList.innerHTML = list;
      $('#alarmList').listview().listview('refresh');
  }
}


window.onload=function(){

  var alarm = new Alarm();
  alarm.init();

  $('#fixedadd').on('pagebeforeshow', function beforeShow() {
      var date = new Date(),
          test = null;
      $('#select2>option:first').val();

      $('#fixedTime').val(alarm.padZero(date.getHours()) + ':' + alarm.padZero(date.getMinutes()));

      $('#fixedAmount').val('');
      $('#fixedUsage').val('');
      test = $('#fixedCategory input[type="radio"]:checked').val();
      alert('test' + test);
      $('#fixedMethod>input:first').attr('checked', true);
      $('#fixedMemo').val('');
      $('#fixedBefore input:first').attr('checked', true);
      $.mobile.changePage('#fixedadd');
  });

  $('#fixed-add-btn').click(function () {
      var expense = {};
      expense.date = $('#select2').val();
      expense.amount = $('#fixedAmount').val();
      expense.usage = $('#fixedUsage').val().trim();
      expense.time = $('#fixedTime').val();
      alarm.saveAlarm(expense);
      $.mobile.changePage('#fixed');
  });

  $('#fixed').on('pagebeforeshow', function beforeShow() {
      alarm.init();
  });

};
