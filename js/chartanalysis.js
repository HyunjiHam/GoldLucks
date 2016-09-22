/*
 * 1. money 테이블에서 오늘 날짜까지 income 0인 애들만 모아 카테고리별 정렬(디비에서 해옴)
 * 2. 디비에서 받아온 배열을 동적으로 json 생
 * 3. 내가 원하는건 배열에 카테고리-총액 으로 붙어있는걸 카테고리 숫자 대신 글을 연결짓는
 * 
 */

var analysis = {};
$(document).ready(function(){
	//(GoldLucksDB.getExpenses(analysis.catNum2Text)());
	/**
	 * Stores category texts into array 
	 */
	var catArr = [];
	$("#select1").find("option").each(function(){
		catArr.push($(this).text());
	});
	
	/**
	 *  Object is consist of
	 *  {"cat" : category number, "amount": amounts per category}
	 *  Changes cat number to cat text
	 */
	analysis.catNum2Text = function catNum2Text(array){
		$.each(array,function(idx, val){
			array[idx].cat = catArr[idx];
		});
		var chart = JSON.stringify(array);
		alert(chart);
	};
});