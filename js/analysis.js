var analysis = {};
$(document).ready(function() {
    //(GoldLucksDB.getExpenses(analysis.catNum2Text)());
    /**
     * Stores category texts into array
     */
    var catArr = [];
    $("#select1").find("option").each(function() {
        catArr.push($(this).text());
    });
    
    /**
     *  Object is consist of
     *  {"cat" : category number, "amount": amounts per category}
     *  Changes cat number to cat text
     */
    var chart = "";
    analysis.catNum2Text = function catNum2Text(array) {
        $.each(array, function(idx) {
        	var catSync=array[idx].cat;
        	array[idx].cat = catArr[catSync];            
        });
        if(array.length === 0) chart="";
        else
        	chart = JSON.stringify(array);
        analysis.makeChartJson();
    };

    analysis.makeChartJson = function makeChartJson() {
        // configure for module loader
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
            function(ec) {

                var nameArr = ['nodata'];
                var dataArr = [{'value': 1,'name': 'nodata'}];

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


                if (chart !== "") {
                    var item = JSON.parse(chart);
                    for (var i = 0; i < item.length; i++) {
                        nameArr[i] = item[i].cat;

                        /*Change only first data in dataArr.
                         * After that, push into the dataArr*/
                        if(i === 0){
                        	for(var property in dataArr[i]){
                        		if(property === "value")
                        			dataArr[i][property] = item[i].amount;
                        		else
                        			dataArr[i][property] = item[i].cat;
                        	}
                        }	
                        else{
                        	var temp2 = {
                        		'value' : item[i].amount,
                        		'name' : item[i].cat
                        	};
                        
                        	dataArr.push(temp2);
                        }
                    }
                }

                // Load data into the ECharts instance
                myChart.setOption(option);
            }          
        );

    };
    (GoldLucksDB.getExpenses(analysis.catNum2Text));
    //(analysis.makeChartJson());
});