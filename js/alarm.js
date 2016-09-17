window.onload=function(){
			//initDB();
            var expenses = window.localStorage.getItem('expenses');
            expenses = expenses ? JSON.parse(expenses) : [];
            //alert('document ready' + expenses.length);
            displayList(expenses);

            function padZero(number) {
                number = number.toString();
                if (number.length === 1) {
                    return '0' + number;
                }
                return number;
            }

            $('#fixedadd').on('pagebeforeshow', function beforeShow() {
                var date = new Date(),
                    test = null;
                alert('fixedadd page before show');
                $('#select1>option:first').val();
                
                $('#fixedTime').val(padZero(date.getHours()) + ':' + padZero(date.getMinutes()));

                $('#fixedAmount').val('');
                $('#fixedUsage').val('');
                //$('#fixedCategory input[type="radio"]:checked').val();
                test = $('#fixedCategory input[type="radio"]:checked').val();
                alert('test' + test);
                //$('#fixedCategory input[type="radio"]').reset();
                //$('#fixedCategory input[type="radio"]:checked').prop('checked', false);
                //alert('2ndtest' + test);
                //$('#fixedCategory input[type="radio"]:first').prop('checked','checked');
                $('#fixedMethod>input:first').attr('checked', true);
                $('#fixedMemo').val('');
                $('#fixedBefore input:first').attr('checked', true);
                $.mobile.changePage('#fixedadd');
            });

            //아예 실행 안됨
            $('#fixed').on('pagebeforechange', function () {
                alert('fixed page before show');
                //displayList(expenses);
            });

            function datapickerValue2Date(value) {
                var date = new Date(),
                    time = value.split(':'),
                    day = $('#select1>option:selected').val();
                //이달 그날이 이미 지나지 않았다면 이달부터 아니면 다음달부터..
                date.setDate(parseInt(day), 10);
                date.setHours(parseInt(time[0], 10));
                date.setMinutes(parseInt(time[1], 10));
                date.setSeconds(0);
                alert(date);
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

            function updateStorage() {
                try {
                    window.localStorage.setItem(
                        'expenses',
                        JSON.stringify(expenses)
                        );
                    alert('saved');
                } catch (e) {
                    if (e.code === 22) {
                        alert('there is no enough memory to save data');
                    } else {
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
                    alarmList = document.getElementById('alarmList'),
                    list = '';
                len = expenses.length;
                //alert(len+'displayList');
                for (var i = 0; i < len;i++) {
                    expense = $.extend({}, expenses[i]);
                    list += '<li><a href="#fixedadd"> usage:'+expense.usage+' amount:' + expense.amount + ' time:' + expense.time + '</a></li>';
                }
                alarmList.innerHTML = list;
                $('#alarmList').listview('refresh');
            }


            $('#fixed-add-btn').click(function () {
                var expense = {};
                expense.date = $('#select1').val();
                expense.amount = $('#fixedAmount').val();
                expense.usage = $('#fixedUsage').val().trim();
                expense.time = $('#fixedTime').val();
                saveAlarm(expense);
                insertData("fromFixed");
                $.mobile.changePage('#fixed');
            });

            $('#fixed').on('pagebeforeshow', function beforeShow() {
                alert('pagebeforeshow');
                displayList(expenses);
            });
            

            /*$('#fixed-add-btn').click(function () {
                for (var i = 0; i < 10; i++) {
                    $('#alarmList').append('<li>Hello</li>');
                    $('#alarmList').listview('refresh');
                }
            });*/
};
