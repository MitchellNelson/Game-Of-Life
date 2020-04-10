var app;
function Init(){
	app = new Vue({
		el: "#app",
		data: {
			tableSize:      25,
			table:          [],
			timer:          null,
			playing:        false,
			formations:     null,
			formation:      null
		},
		watch: {
			tableSize: function(){initTableElements();},
			formation: function(){setFormation();}
		}
	});
	
	ResetTimer();

	// Get JSON File Via HTTP request
	var p1 = request('JSON/formations.json');
	p1.then(results=>{
		app.formations = results[0]['formations'];
		app.formation = app.formations[0];
		initTableElements();
	});
}

function initTableElements(){
	for (var i = 0; i < app.tableSize; i++){
		var newRow = [];
		for (var j = 0;	 j < app.tableSize; j++){
			newRow.push(false);
		}
		app.table.push(newRow);
	}
	setFormation();
}
function setFormation(){
	Clear();
	if(app.formation != undefined){
		for(point in app.formation['points']){
			flipCell(app.formation['points'][point].x, app.formation['points'][point].y);
		}
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
	ResetTimer();
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
	if (app.table[wrapVal(row-1)][col]){ret++;}
	//Up Right
	if (app.table[wrapVal(row-1)][wrapVal(col+1)]){ret++;}
	//Right
	if (app.table[row][wrapVal(col+1)]){ret++;}
	//Down Right
	if (app.table[wrapVal(row+1)][wrapVal(col+1)]){ret++;}
	//Down
	if (app.table[wrapVal(row+1)][col]){ret++;}
	//Down Left
	if (app.table[wrapVal(row+1)][wrapVal(col-1)]){ret++;}
	//Left
	if (app.table[row][wrapVal(col-1)]){ret++;}
	//Left Up
	if (app.table[wrapVal(row-1)][wrapVal(col-1)]){ret++;}
	return ret;
}
function wrapVal(index){
	if (index == -1){return app.tableSize-1;}
	if (index == app.tableSize){return 0;}
	return index;
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
var request = function(filename){
	var p = new Promise((resolve,reject)=>{
		var req = new XMLHttpRequest();
		req.onreadystatechange = function(){
			if (req.readyState == 4 && req.status == 200){
				//sucessfully recieved data!
				var data =JSON.parse(req.response);
				//console.log(data);
	   			resolve(data);
			}
			else if(req.readyState == 4){
				reject("Error: " + req.status);
			}
		};
		req.open("GET", filename,true);
		req.send();
	});
	return p;
}