function Analysis(goldlucksdb){
  this.catArr = [];
  this.chart = "";
  this.db = goldlucksdb;
}

(function strict(){
  Analysis.prototype={
    /**
     *  Object is consist of
     *  {"cat" : category number, "amount": amounts per category}
     *  Changes cat number to cat text
     */
    catNum2Text : function catNum2Text(catarray) {
      console.log(this);
      var array = this.db.expenseArray;
      var self = this;
        $.each(array, function (idx) {
            var catSync = array[idx].cat;
            array[idx].cat = self.catArr[catSync];
        });
        console.log(this);
        if (array.length === 0) this.chart = "";
        else
            this.chart = array;//JSON.stringify(array);
        console.log(this);
        this.makeChartJson();
        this.printCat();
    },

    printCat : function printCat(){
      var array = this.db.expenseArray;//JSON.parse(this.db.expenseArray);
      var cat,
          amount,
          sum;
      $('#analyList>li:gt(2)').remove();
      sum=0;
      for(var i in array){
        cat = array[i].cat;
        amount = array[i].amount;
        $('#analyList').append('<li>'+cat+'<p class="ui-li-aside">'+amount+'$</p>');
        $('#analyList').listview('refresh');
        sum += parseInt(amount);
      }
      $('#analyTotal').html(sum+'$');
    },

    makeChartJson : function makeChartJson() {
        // configure for module loader
        var self = this;
        require.config({
            paths: {
                echarts: './js'
            }
        });

        // use
        require(
            [
                'echarts', // require the specific chart type
                'echarts/chart/pie'
            ],
            function (ec) {
                var nameArr = ['nodata'];
                var dataArr = [{ 'value': 1, 'name': 'nodata' }];
                // Initialize after dom ready
                var myChart = ec.init(document.getElementById('chart'), 'helianthus');
                var option = {
                    title: {
                        /*
	                        text: 'Analysis',
	                        subtext: 'now successT_T',
	                        x:'center'*/
                    },
                    series: [{
                        //			 	                     name: 'ddd',
                        data: dataArr,
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '45%']
                    }],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        /*  orient : 'vertical',
	                      x : 'left', */
                        y: 'bottom',
                        data: nameArr
                        //  data: ['data1', 'data2', 'data3', 'data4', 'data5']
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {
                                show: false
                            },
                            dataView: {
                                show: false,
                                readOnly: true
                            },
                            magicType: {
                                show: false,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '50%',
                                        funnelAlign: 'left',
                                        max: 1548
                                    }
                                }
                            },
                            restore: {
                                show: false
                            },
                            saveAsImage: {
                                show: false
                            }
                        }
                    }


                };
                if (self.chart !== "") {
                    var item = self.chart//JSON.parse(this.chart);
                    for (var i = 0; i < item.length; i++) {
                        nameArr[i] = item[i].cat;

                        /*Change only first data in dataArr.
                         * After that, push into the dataArr*/
                        if (i === 0) {
                            for (var property in dataArr[i]) {
                                if (property === "value")
                                    dataArr[i][property] = item[i].amount;
                                else
                                    dataArr[i][property] = item[i].cat;
                            }
                        }
                        else {
                            var temp2 = {
                                'value': item[i].amount,
                                'name': item[i].cat
                            };

                            dataArr.push(temp2);
                        }
                    }
                }

                // Load data into the ECharts instance
                myChart.setOption(option);
            }
        );
    },

    getExpenses : function getExpenses(){
      this.db.getExpenses(this.catNum2Text);
    }


  }
}());
