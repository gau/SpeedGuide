#target photoshop
/*==================================
//SpeedGuide.jsx
//Created by Toshiyuki Takahashi - Graphic Arts Unit
//www.graphicartsunit.com
==================================*/

//==================================================
//初期値
//==================================================
var settings = {
	ver : '',
	hor : '',
	clearall : false,
	quickcopy : true
};

const SCRIPT_TITLE = "SpeedGuide";
const SCRIPT_VERSION = "0.5";
var dialogs = {main:null, csv:null, showall:null};

//==================================================
//メインダイアログ
//==================================================
createMainDialog = function(){

	var dlg = new Window("dialog", SCRIPT_TITLE + " - ver." + SCRIPT_VERSION);
	dlg.exFlag = false;
	dlg.maximumSize = [650, 600];
	dlg.margins = [20, 20, 20, 20];

	//ガイド
	dlg.pGuide = dlg.add("panel", undefined, "ガイド");
	dlg.pGuide.margins = [20, 20, 20, 20];

	dlg.verlabel = dlg.pGuide.add("statictext", undefined, "垂直：");
	dlg.ver = dlg.pGuide.add("edittext", undefined, settings.ver);
	dlg.ver.minimumSize = [550, 10];

	dlg.horlabel = dlg.pGuide.add("statictext", undefined, "水平："); 
	dlg.hor = dlg.pGuide.add("edittext", undefined, settings.hor);
	dlg.hor.minimumSize = [550, 10];
	for (i=0; i<dlg.pGuide.children.length; i++){
		dlg.pGuide.children[i].alignment = "left";
	}

	//オプション
	dlg.pOption = dlg.add("panel", undefined, "オプション");
	dlg.pOption.margins = [20, 20, 20, 20];

	dlg.clearall = dlg.pOption.add("checkbox", undefined, "既存のガイドを全消去する", {value:settings.clearall});
	dlg.clearall.minimumSize = [550, 10];
	for (i=0; i<dlg.pOption.children.length; i++){
		dlg.pOption.children[i].alignment = "left";
	}

	//メモ表示
	dlg.gBottom = dlg.add("group", undefined);
	dlg.gBottom.orientation = "row";

	//ボタン
	dlg.gMemo = dlg.gBottom.add("group", undefined);
	dlg.gMemo.alignment = "left";
	dlg.gMemo.minimumSize = [320, 10];

	dlg.gButton = dlg.gBottom.add("group", undefined);
	dlg.gButton.alignment = "right";
	dlg.gButton.orientation = "row";
	dlg.memo = dlg.gMemo.add("statictext", undefined, "現在の定規の単位：" + new UnitValue(castValue(1)).type); 
	dlg.csv = dlg.gButton.add("button", undefined, "CSV...", {name: "csv"});

	dlg.cancel = dlg.gButton.add("button", undefined, "キャンセル", {name: "cancel"});

	dlg.ok = dlg.gButton.add("button", undefined, "OK", { name:"ok"});

	return dlg;  

}
initMainDialog = function(w){  
	w.onShow=function(){
		this.ver.active = true;
	}
	w.verlabel.onClick=function(){
		var thisObj = this.parent.parent;
		if(settings.quickcopy) thisObj.ver.text = thisObj.hor.text;
	}
	w.horlabel.onClick=function(){
		var thisObj = this.parent.parent;
		if(settings.quickcopy) thisObj.hor.text = thisObj.ver.text;
	}
	w.memo.onClick=function(){
		dialogs.showall = createShowAllDialog();
		initShowAllDialog(dialogs.showall);
		startShowAllDialog(dialogs.showall);
	}
	w.csv.onClick=function(){
		addcsv();
	}
	w.cancel.onClick=function(){
		var thisObj = this.parent.parent.parent;
		thisObj.close();
	}
	w.ok.onClick=function(){
		var thisObj = this.parent.parent.parent;
		settings.ver = thisObj.ver.text;
		settings.hor = thisObj.hor.text;
		settings.clearall = thisObj.clearall.value;
		thisObj.close();
		try {
			app.activeDocument.suspendHistory(SCRIPT_TITLE, 'init()');
		} catch (e) {
			alert("エラーが発生しました\n" + e);
			executeAction( charIDToTypeID('undo'), undefined, DialogModes.NO );
		}
	}
 };
startMainDialog = function(w){
	return w.show();
};

//==================================================
//CSVダイアログ
//==================================================
createCSVDialog = function(data){

	var dlg = new Window("dialog", "CSVから値を読み込む");
	dlg.maximumSize = [650, 600];
	dlg.margins = [20, 20, 20, 20];

	dlg.exFlag = false;
	dlg.listItems = [];
	dlg.current = data[0];

	//CSV
	dlg.pCSV = dlg.add("panel", undefined, "CSV");
	dlg.pCSV.margins = [20, 20, 20, 20];

	for (i=0; i<data.length; i++) {
		dlg.listItems[i] = data[i][0];
	}

	dlg.itemlist = dlg.pCSV.add("dropdownlist", undefined, dlg.listItems);
	dlg.itemlist.selection = 0;
	dlg.itemlist.size = [400, 25];
	dlg.itemlist.onChange=function(){
		dlg.current=data[this.selection.index];
		dlg.csvinfoV.text = "水平：" + dlg.current[1];
		dlg.csvinfoH.text = "垂直：" + dlg.current[2];
	}

	dlg.csvinfoV = dlg.pCSV.add("statictext",undefined, "水平：" + dlg.current[1]);
	dlg.csvinfoV.preferredSize = [400, dlg.csvinfoV.preferredSize[1]];
	dlg.csvinfoH = dlg.pCSV.add("statictext",undefined, "垂直：" + dlg.current[1]);
	dlg.csvinfoH.preferredSize = [400, dlg.csvinfoH.preferredSize[1]];

	dlg.gButton = dlg.add("group", undefined);
	dlg.gButton.alignment = "right";
	dlg.gButton.orientation = "row";
	dlg.cancel = dlg.gButton.add("button", undefined, "キャンセル", {name: "cancel"});
	dlg.ok = dlg.gButton.add("button", undefined, "値をセット", { name:"ok"});

	return dlg;  

}
initCSVDialog = function(w){  
	w.cancel.onClick=function(){
		var thisObj = this.parent.parent;
		thisObj.close();
	}
	w.ok.onClick=function(){
		var thisObj = this.parent.parent;
		settings.ver = thisObj.current[1];
		settings.hor = thisObj.current[2];
		dialogs.main.ver.text = thisObj.current[1];
		dialogs.main.hor.text = thisObj.current[2];
		thisObj.close();
	}
 };
startCSVDialog = function(w){
	return w.show();
};

//==================================================
//現在のガイド表示ダイアログ
//==================================================
createShowAllDialog = function(){
	var data = getAllGuide();
	var dlg = new Window('dialog', "現在の画像のダイアログ");
	dlg.csvStr = dlg.add( 'edittext', undefined, data[0], {multiline:true});
	dlg.csvStr.preferredSize[0] = 500;
	dlg.csvStr.maximumSize = [600, 500];
	dlg.noteStr = dlg.add( 'statictext', undefined, "垂直方向 " + data[1] + "本／水平方向 " + data[2] + "本のガイドが見つかりました", {multiline:true});
	dlg.noteStr.justify = "center";
	dlg.noteStr.preferredSize[0] = 500;
	dlg.okBtn = dlg.add( 'button', undefined, 'OK', { name:'ok' });  
	return dlg;  
};
initShowAllDialog = function(w){  
	w.okBtn.onClick = function(){
		w.close(1);
	};
 };
startShowAllDialog = function(w){
	return w.show();
};

if(documents.length > 0) {
	dialogs.main = createMainDialog();
	initMainDialog(dialogs.main);
	startMainDialog(dialogs.main);
} else {
	alert("ドキュメントがありません\nスクリプトを終了します");
}

//==================================================
//初期処理
//==================================================
function init(){
	var vgs = getNumbers(settings.ver, Direction.VERTICAL), hgs = getNumbers(settings.hor, Direction.HORIZONTAL);
	if(settings.clearall) app.activeDocument.guides.removeAll();
	addGuides(vgs);
	addGuides(hgs);
}

//==================================================
//ガイドを追加する処理
//==================================================
function addGuides(guideData){

	var errorArray=[], raito;

	if(!guideData || guideData.length < 1) return false;
	for (i=0; i<guideData.length; i++){

		//値が有効かどうか
		if(!guideData[i] || guideData[i].units == "?") {
			errorArray.push("\"" + guideData[i].origin + "\"");
		} else {
			//ガイドを引く
			(guideData[i].units == "px")? raito = 1 : raito = app.activeDocument.resolution/72 ;
			app.activeDocument.guides.add(guideData[i].direction, guideData[i].unitvalue.as("px")*raito+"px");
		}
	}
	if(errorArray.length > 0) {
		alert("無効な値があったため " + errorArray.length + " 本のガイドが作成できませんでした\n無効：" + errorArray);
	}
}

//==================================================
//データの整形
//==================================================
function getNumbers(str, drc){
	var splitArray, re, guideData=[], raito;

	//全角を半角に変換してスペースで分割
	if(str == "") return 0;
	str = str.replace(/　/g," ");
	str = str.replace(/[！-～]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
	splitArray = str.split(" ");

	//相対書式のための分割（未実装）
	// var addArray = [], tempArray = [], baseNum;
	// for(i=0; i<splitArray.length; i++){
	// 	if(splitArray[i].match(/>/g)) {
	// 		tempArray = splitArray[i].split(">");
	// 		for(j=1; j<tempArray.length; j++){
	// 			tempArray[j] = ">" + tempArray[j];
	// 		}
	// 		addArray = addArray.concat(tempArray);
	// 		splitArray.splice(i, 1);
	// 		i--;
	// 	}
	// }
	// splitArray = splitArray.concat(addArray);

	//値を分割してハッシュに
	for(i=0; i<splitArray.length; i++){
		if(splitArray[i].length < 1) {
			splitArray.splice(i, 1);
			i--;
		} else {
			re = /^(.*[^a-z%])([a-z%]*)$/gi.exec(splitArray[i]);
			if(re || re.length < 3) {
				if(re[2].length < 1) re[2] = new UnitValue(castValue(1)).type;
				guideData[i] = {origin:splitArray[i], val:re[1], units:re[2], unitvalue:null, direction:drc};
			} else {
				guideData[i] = {origin:splitArray[i], val:null, units:null, unitvalue:null, direction:drc};
			}
		}
	}

	//値に対する諸々の処理を施して使えるデータにする
	for(i=0; i<guideData.length; i++){

		//数値じゃない場合の処理
		if(isNaN(guideData[i].val)){

			try {
				//四則演算
				guideData[i].val = eval(guideData[i].val);
			} catch(e) {
				try {
					//逆起点（:が付加された数値）
					re = eval(/^:(.+)$/gi.exec(guideData[i].val)[1]);
					if(guideData[i].units == "%") {
						guideData[i].val = 100 - Number(re);
					} else {
						(guideData[i].units == "px")? raito = 1 : raito = app.activeDocument.resolution/72 ;
						guideData[i].val = new UnitValue(getDocSize(drc, Units.PIXELS),"px") - new UnitValue(Number(re)*raito,guideData[i].units).as("px");
						guideData[i].val = new UnitValue(guideData[i].val/raito,"px").as("mm");
					}
				} catch(e) {
				}
			}

		}

		//数値のときの処理
		if(!isNaN(guideData[i].val)){
			if(guideData[i].units == "%") {
				guideData[i].units = "px";
				guideData[i].unitvalue = new UnitValue(getDocSize(drc, Units.PIXELS) * (guideData[i].val/100));
			} else {
				guideData[i].unitvalue = new UnitValue(guideData[i].val, guideData[i].units);
			}
		}

	}
	return guideData;
}

//==================================================
//ドキュメントサイズを返す
//==================================================
function getDocSize(drc, unit) {

	var docSize, sru;

	sru = app.preferences.rulerUnits;
	if(unit) app.preferences.rulerUnits = unit;
	switch(drc) {
		case Direction.VERTICAL:
			docSize = app.activeDocument.width;
			break;
		case Direction.HORIZONTAL:
			docSize = app.activeDocument.height;
			break;
		default:
			break;
	}
	app.preferences.rulerUnits = sru;
	return docSize;
}

//==================================================
//CSVのデータを追加
//==================================================
function addcsv() {

	var csv, data, filename, fileObj, listItems=[];

	filename = File.openDialog("「speedguide.csv」を選択してください");

	if (filename && !String(filename).match(/.+speedguide\.csv$/i)) {
		alert("ファイル名が異なります\n「speedguide.csv」を選択してください");
		return false;
	}

	fileObj = new File(filename);
	if (fileObj.open("r")) {
		csv = fileObj.read();
		fileObj.close();

		data = parseCSV(csv);

		dialogs.csv = createCSVDialog(data);
		initCSVDialog(dialogs.csv);
		startCSVDialog(dialogs.csv);

	} else {
		if(filename) {
			alert("ファイルが開けませんでした");
		} else {
		}
		return false;
	}
}

//==================================================
//CSVをパース
//==================================================
function parseCSV(file){

	var data=[], lines;

	lines = file.split('\n');
	for(i=0; i<lines.length; i++){
		if(lines[i].length > 0) {
			data.push(lines[i].split(','));
		} else {
			lines.splice(i, 1);
	 		i--;
		}
	}
	return data;
}

//==================================================
//現在の全ガイドを返す
//==================================================
function getAllGuide() {
	var guides = app.activeDocument.guides;
	var vGuides=[], hGuides=[], spstr = " ";
	for(i=0; i<guides.length; i++){
		switch(guides[i].direction) {
			case Direction.VERTICAL :
				vGuides.push(String(guides[i].coordinate).replace(/ /g,""));
				break;
			case Direction.HORIZONTAL :
				hGuides.push(String(guides[i].coordinate).replace(/ /g,""));
				break;
			default:
				break;
		}
	}
	return [app.activeDocument.name + "のガイド," + vGuides.join(spstr) + "," + hGuides.join(spstr),vGuides.length,hGuides.length];
}

//==================================================
//単位のない数値をキャストする
//==================================================
function castValue(n) {
	return n + app.activeDocument.width - app.activeDocument.width;
}

//==================================================
//オブジェクトの要素数を返す
//==================================================
function getObjectKeys(obj) {
	var n = 0;
	for (var key in obj) {
		++n;
	}
	return n;
}