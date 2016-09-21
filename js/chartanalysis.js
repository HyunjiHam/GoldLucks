/*
 * 1. money 테이블에서 오늘 날짜까지 income 0인 애들만 모아 카테고리별 정렬(디비에서 해옴)
 * 2. 디비에서 받아온 배열을 동적으로 json 생
 * 3. 
 * 
 */

var analysis = {};
$(document).ready(function(){
	//(GoldLucksDB.getExpenses(analysis.sumArray2Json)());
	
	analysis.sumArray2Json = function sumArray2Json(array){
//		alert("tada!");
		var chart = JSON.stringify(array);
		alert(chart);
	}
});