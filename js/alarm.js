$(document).ready(function () {
            
            var expenses = window.localStorage.getItem('expenses');
            expenses = expenses ? JSON.parse(expenses) : [];
            
            function padZero(number) {
                number = number.toString();
                if (number.length === 1) {
                    return '0' + number;
                }
                return number;
            }

            $('#fixedadd').on('pagebeforeshow', function beforeShow() {
                var date = new Date();
                $('#fixedDate').val(date.getFullYear() + '-' + padZero(date.getMonth()+1) + '-' + padZero(date.getDate()));
                $('#fixedTime').val(+padZero(date.getHours()) + ':' + padZero(date.getMinutes()));
            });
            
            
            $('#fixed').on('pageshow',function (){
                displayList(expenses);
                $('#alarmList').listview('refresh');
            });

            function datapickerValue2Date(value){
                var date = new Date(),
                    time = value.split(':');
                date.setHours(parseInt(time[0],10));
                date.setMinutes(parseInt(time[1],10));
                date.setSeconds(0);
                return date;
            }

            function addAlarm(expense) {
                var alarm = {},
                    date = '';
                //appControl={};
                try {
                    date = datapickerValue2Date(expense.time);
                    alarm = new tizen.AlarmAbsolute(date);
                    tizen.alarm.add(alarm, tizen.application.getCurrentApplication().appInfo.id);
                } catch (e) {
                    console.error(e);
                } finally {
                    return alarm.id;
                }
            }

            function updateStorage(){
                try{
                    window.localStorage.setItem(
                        'expenses',
                        JSON.stringify(expenses)
                        );
                    alert('saved');
                }catch(e){
                    if(e.code ===22){
                        alert('there is no enough memory to save data');
                    }else{
                    	alert('error code is not 22');
                    }
                }
            }
            
            function saveAlarm(expense) {
                var alarmId = addAlarm(expense);
                
                if (alarmId) {
                    expense.id = alarmId;
                    expenses.push(expense);
                    updateStorage();
                }
            }
            
            function displayList(expenses) {
                var len = 0,
                    expense = null,
                    alarmList = document.getElementById('alarmList');
                len = expenses.length - 1;
                alert(len);
                while (len >= 0) {
                    alert('execute');
                    expense = $.extend({}, expenses[len]);
                    //alarmList.append('<li><a>' + expense.usage + ':' + expense.amount + 'won when:' + expense.date + 'alarm:  ' + expense.time+'</a></li>');
                    ('#alarmList').append('<li>Hello</li>');
                    
                    len -= 1;
                }
            }


            $('#fixed-add-btn').click(function () {
                var expense = {};
                expense.date = $('#fixedDate').val();
                expense.amount = $('#fixedAmount').val();
                expense.usage = $('#fixedUsage').val().trim();
                expense.time = $('#fixedTime').val();
                saveAlarm(expense);
                $.mobile.changePage('#fixed');
            });

        });