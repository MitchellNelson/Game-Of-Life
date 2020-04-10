var app;
function Init(){
	app = new Vue({
		el: "#app",
		data: {
			tableSize:      25,
			table:          [],
			timer:        null,
			playing:      false
		},
		watch: {
			tableSize: function(){initTableElements();}
		}
	});
	initTableElements();
	ResetTimer();
}

function initTableElements(){
	for (var i = 0; i < app.tableSize; i++){
		var newRow = [];
		for (var j = 0;	 j < app.tableSize; j++){
			newRow.push(false);
		}
		app.table.push(newRow);
	}
}
function ResetTimer(){
    app.timer = new interval(500, function(){
    	updateCells();
    });
}

function play(){
	app.playing = true;
	app.timer.run();
}
function stop(){
	app.playing = false;
	app.timer.stop();
}

function updateCells(){
	var cellsToFlip = [];
	for (var i = 0; i < app.tableSize; i++){
		for (var j = 0; j < app.tableSize; j++){
			var numN = numNeighbors(i, j);
			var cell = {'x': i, 'y': j};
			// Alive Cell
			if (app.table[i][j]){
				if (numN < 2 || numN > 3){
					cellsToFlip.push(cell);
				}
			}
			// Dead Cell
			else{
				if (numN == 3){
					cellsToFlip.push(cell);
				}
			}
		}
	}
	for (var i = 0; i < cellsToFlip.length; i++){
		flipCell(cellsToFlip[i].x, cellsToFlip[i].y);
	}
}

function flipCell(row, col){
	Vue.set(app.table[row],col,!app.table[row][col])
}

function numNeighbors(row, col){
	var ret = 0;
	var s = app.tableSize-1
	//Up
	if (row > 0 && app.table[row-1][col]){ret++;}
	//Up Right
	if (row > 0 && col < s && app.table[row-1][col+1]){ret++;}
	//Right
	if (col < s && app.table[row][col+1]){ret++;}
	//Down Right
	if (row < s && col < s && app.table[row+1][col+1]){ret++;}
	//Down
	if (row < s && app.table[row+1][col]){ret++;}
	//Down Left
	if (row < s && col > 0 && app.table[row+1][col-1]){ret++;}
	//Left
	if (col > 0 && app.table[row][col-1]){ret++;}
	//Left Up
	if (row > 0 && col > 0 && app.table[row-1][col-1]){ret++;}
	return ret;
}

function Clear(){
	for (var i = 0; i < app.tableSize; i++){
		for (var j = 0; j < app.tableSize; j++){
			if (app.table[i][j]){
				flipCell(i,j);
			}
		}
	}
}