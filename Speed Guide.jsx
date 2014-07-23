#target photoshop
/*
SpeedGuide.jsx
Copyright (c) 2014 Toshiyuki Takahashi
Released under the MIT license
http://opensource.org/licenses/mit-license.php
www.graphicartsunit.com
*/
//==================================================
//初期値
//==================================================
var settings = {
	ver : "",
	hor : "",
	clearall : false,
	quickcopy : true
};

//定数とグローバル変数
const SCRIPT_TITLE = "SpeedGuide";
const SCRIPT_VERSION = "0.8.5";
var dialogs = {main:null, csv:null, showall:null};

//==================================================
//メインダイアログ
//==================================================
var createMainDialog = function(){

	//ダイアログを作成
	var dlg = new Window("dialog", SCRIPT_TITLE + " - ver." + SCRIPT_VERSION);
	dlg.maximumSize = [650, 600];
	dlg.margins = [20, 20, 20, 20];
	//ガイドパネル
	dlg.pGuide = dlg.add("panel", undefined, "ガイド");
	dlg.pGuide.margins = [20, 20, 20, 20];
	//垂直
	dlg.verlabel = dlg.pGuide.add("statictext", undefined, "垂直：");
	dlg.ver = dlg.pGuide.add("edittext", undefined, settings.ver);
	dlg.ver.minimumSize = [550, 10];
	//水平
	dlg.horlabel = dlg.pGuide.add("statictext", undefined, "水平："); 
	dlg.hor = dlg.pGuide.add("edittext", undefined, settings.hor);
	dlg.hor.minimumSize = [550, 10];
	for (var i=0; i<dlg.pGuide.children.length; i++){
		dlg.pGuide.children[i].alignment = "left";
	}
	//オプションパネル
	dlg.pOption = dlg.add("panel", undefined, "オプション");
	dlg.pOption.margins = [20, 20, 20, 20];
	//オプション1
	dlg.clearall = dlg.pOption.add("checkbox", undefined, "既存のガイドを全消去する", {value:settings.clearall});
	dlg.clearall.minimumSize = [550, 10];
	for (var i=0; i<dlg.pOption.children.length; i++){
		dlg.pOption.children[i].alignment = "left";
	}
	//ボタングループ
	dlg.gBottom = dlg.add("group", undefined);
	dlg.gBottom.orientation = "row";
	//メモグループ
	dlg.gMemo = dlg.gBottom.add("group", undefined);
	dlg.gMemo.alignment = "left";
	dlg.gMemo.minimumSize = [320, 10];
	//ボタン
	dlg.gButton = dlg.gBottom.add("group", undefined);
	dlg.gButton.alignment = "right";
	dlg.gButton.orientation = "row";
	dlg.csv = dlg.gButton.add("button", undefined, "CSV...", {name: "csv"});
	dlg.cancel = dlg.gButton.add("button", undefined, "キャンセル", {name: "cancel"});
	dlg.ok = dlg.gButton.add("button", undefined, "OK", { name:"ok"});
	//メモ
	dlg.memo = dlg.gMemo.add("statictext", undefined, "現在の定規の単位：" + new UnitValue(castValue(1)).type); 

	return dlg;  

};
var initMainDialog = function(w){  
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
		try {
			app.activeDocument.suspendHistory(SCRIPT_TITLE, 'sgStart()');
		} catch (e) {
			alert("エラーが発生しました\n" + e);
			executeAction( charIDToTypeID('undo'), undefined, DialogModes.NO );
		}
	}
 };
var startMainDialog = function(w){
	return w.show();
};

//==================================================
//CSVダイアログ
//==================================================
var createCSVDialog = function(data){

	//ダイアログを作成
	var dlg = new Window("dialog", "CSVから値を読み込む");
	dlg.maximumSize = [650, 600];
	dlg.margins = [20, 20, 20, 20];
	//ダイアログで使用する変数を定義
	dlg.listItems = [];
	dlg.current = data[0];
	//CSVパネル
	dlg.pCSV = dlg.add("panel", undefined, "CSV");
	dlg.pCSV.margins = [20, 20, 20, 20];
	//ドロップダウンリスト用の配列作成
	for (var i=0; i<data.length; i++) {
		dlg.listItems[i] = data[i][0];
	}
	//ドロップダウンリスト
	dlg.itemlist = dlg.pCSV.add("dropdownlist", undefined, dlg.listItems);
	dlg.itemlist.selection = 0;
	dlg.itemlist.size = [400, 25];
	dlg.itemlist.onChange=function(){
		dlg.current=data[this.selection.index];
		dlg.csvinfoV.text = "垂直：" + dlg.current[1];
		dlg.csvinfoH.text = "水平：" + dlg.current[2];
	}
	//データのプレビュー
	dlg.csvinfoV = dlg.pCSV.add("statictext",undefined, "垂直：" + dlg.current[1]);
	dlg.csvinfoV.preferredSize = [400, dlg.csvinfoV.preferredSize[1]];
	dlg.csvinfoH = dlg.pCSV.add("statictext",undefined, "水平：" + dlg.current[2]);
	dlg.csvinfoH.preferredSize = [400, dlg.csvinfoH.preferredSize[1]];
	//ボタン
	dlg.gButton = dlg.add("group", undefined);
	dlg.gButton.alignment = "right";
	dlg.gButton.orientation = "row";
	dlg.cancel = dlg.gButton.add("button", undefined, "キャンセル", {name: "cancel"});
	dlg.ok = dlg.gButton.add("button", undefined, "値をセット", { name:"ok"});

	return dlg;  

};
var initCSVDialog = function(w){  
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
var startCSVDialog = function(w){
	return w.show();
};

//==================================================
//現在のガイド表示ダイアログ
//==================================================
var createShowAllDialog = function(){

	//ガイドのデータを取得
	var data = getAllGuide();
	//ダイアログ作成
	var dlg = new Window('dialog', "現在の画像の全ガイド");
	//データ表示テキスト
	dlg.guideStr = dlg.add('edittext', undefined, data[0], {multiline:true});
	dlg.guideStr.preferredSize[0] = 500;
	dlg.guideStr.maximumSize = [600, 500];
	//注釈テキスト
	dlg.noteStr = dlg.add('statictext', undefined, "垂直方向 " + data[1] + "本／水平方向 " + data[2] + "本のガイドが見つかりました", {multiline:true});
	dlg.noteStr.justify = "center";
	dlg.noteStr.preferredSize[0] = 500;
	//ボタン
	dlg.okBtn = dlg.add('button', undefined, 'OK', { name:'ok' });  

	return dlg;  
};
var initShowAllDialog = function(w){  
	w.okBtn.onClick = function(){
		w.close();
	};
 };
var startShowAllDialog = function(w){
	return w.show();
};

//==================================================
//ガイドのプロトタイプ
//==================================================
function Guide(obj) {
	var prop = {
		origin:null,
		val:null,
		units:null,
		invert:false,
		center:false,
		repeat:1,
		span:0,
		spanUnits:null,
		direction:null,
		success:false
	};
	for (var key in prop){
		this[key] = prop[key];
	}
	this.setPropaties(obj);
}
Guide.prototype.setPropaties = function(obj) {
	for (var prop in obj){
		this[prop] = obj[prop];
	}
};
Guide.prototype.init = function() {
	if(this.val != null) {
		//値の検証
		if(isNaN(this.val)){
			//四則演算を処理
			this.val = calcValue(this.val);
		}
		//スパン値の検証
		if(isNaN(this.span)){
			this.span = calcValue(this.span);
		}
		//数値の場合の処理
		if(!isNaN(this.val) && !isNaN(this.span) && !isNaN(this.repeat)){
			// 単位をピクセルに統一
			var vu = this.convertVal(this.val, this.units, "px", true);
			this.val = vu[0];
			this.units = vu[1];
			var vu = this.convertVal(this.span, this.spanUnits, "px", false);
			this.span = vu[0];
			this.spanUnits = vu[1];
		}
	} else {
		//alert("Null");
	}
	this.checkError();
};
Guide.prototype.convertVal = function(cnval, cnunits, targetunits, isOffset) {

	//単位を統一して解像度比率を適用
	cnval = Number(cnval);
	if(cnunits == "%") {
		cnval = getDocSize(this.direction, targetunits) * cnval / 100;
		cnunits = targetunits;
	}
	if(cnunits != targetunits) {
		if(targetunits != "%") {
			//ここで変換
			cnval = new UnitValue(cnval, cnunits).as(targetunits);
			if(targetunits == "px") {
				cnval *= app.activeDocument.resolution / 72;
			} else {
				cnval /= app.activeDocument.resolution / 72;
			}
		} else {
			cnval = cnval / getDocSize(this.direction, cnunits) * 100;
		}
		cnunits = targetunits;
	}
	//起算位置をシフト
	if(isOffset) {
		if(this.center) cnval = cnval + getDocSize(this.direction, cnunits)/2;
		if(this.invert) cnval = getDocSize(this.direction, cnunits) - cnval;
	}
	if(!isNaN(cnval.value)) cnval = cnval.value;

	return [cnval, cnunits];
};
Guide.prototype.checkError = function() {
	//値が有効かどうか
	if(this.val != null && !isNaN(this.val)) {
		this.success = true;
	} else {
		this.success = false;
	}
	return this.success;
};
Guide.prototype.addGuide = function() {
	//ガイドを引く
	try {
		var dirc;
		var desc = [new ActionDescriptor(), new ActionDescriptor()];
		desc[0].putUnitDouble( charIDToTypeID( "Pstn" ), charIDToTypeID( "#Pxl" ), Number(this.val));
		if(this.direction == Direction.VERTICAL){
			dirc = charIDToTypeID( "Vrtc" );
		} else if(this.direction == Direction.HORIZONTAL) {
			dirc = charIDToTypeID( "Hrzn" );
		} else {
			this.success = false;
		}
		desc[0].putEnumerated( charIDToTypeID( "Ornt" ), charIDToTypeID( "Ornt" ), dirc);
		desc[1].putObject( charIDToTypeID( "Nw  " ), charIDToTypeID( "Gd  " ), desc[0]);
		executeAction( charIDToTypeID( "Mk  " ), desc[1], DialogModes.NO );
		this.success = true;
	} catch(e) {
		this.success = false;
	}
};

//==================================================
//初期処理
//==================================================
function sgStart(){

	var guides, vgs, hgs, res, errors=[];

	// 既存ガイドの消去
	if(settings.clearall) app.activeDocument.guides.removeAll();
	// ガイド追加を実行
	vgs = getGuides(settings.ver, Direction.VERTICAL);
	hgs = getGuides(settings.hor, Direction.HORIZONTAL);
	guides = Array.prototype.concat.apply(vgs,hgs);
	for (var i in guides){
		if (!guides[i].success) errors.push("“" + guides[i].origin + "”");
	}
	// アラート表示
	if(errors.length > 0) {
		alert("無効な値が " + errors.length + " 点あります\n" + errors);
	} else {
		for (var i in guides){
			guides[i].addGuide();
		}
		dialogs.main.close();
	}

}

//==================================================
//データの整形
//==================================================
function getGuides(str, drc) {

	var guideData=[], repArray=[], docSize;

	// 引数をチェック
	if(str.length < 1) return false;
	// 全角を半角に変換
	str = str.replace(/　/g," ");
	str = str.replace(/[！-～]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
	var sptArray = str.split(" ");
	// 配列を分割してハッシュに
	for (var i=0; i<sptArray.length; i++) {
		if(sptArray[i].length > 0) {
			var guide = new Guide({origin:sptArray[i], direction:drc});
			//繰り返し数取得
			var regArray = /(.+)(@)([0-9]+)$/gi.exec(sptArray[i]);
			if(regArray){
				guide.repeat = Number(regArray[3]);
				sptArray[i] = regArray[1];
			}
			delete regArray;
			// オフセット取得
			var regArray = /(.+)(>)([^a-z%@]+)([a-z%]*)$/gi.exec(sptArray[i]);
			if(regArray){
				if(regArray[4].length<1) regArray[4] = new UnitValue(castValue(1)).type;
				sptArray[i] = regArray[1];
				guide.span = regArray[3];
				guide.spanUnits = regArray[4];
			}
			// ガイドデータ取得
			delete regArray;
			regArray = /^(.*[^a-z%])([a-z%]*)$/gi.exec(sptArray[i]);
			if(regArray && regArray.length>2) {
				if(regArray[2].length<1) regArray[2] = new UnitValue(castValue(1)).type;
				if(new UnitValue(regArray[1], regArray[2]).type != "?") {
					guide.val = regArray[1];
					guide.units = regArray[2];
				}
			}
			// 起点を取得（:や$が付加された数値）
			if(guide.val && guide.val.match(/^:|\$/)){
				if(guide.val.match(/:/)){
					guide.invert = true;
					guide.val = guide.val.replace(/:/, "");
				}
				if(guide.val.match(/\$/)) {
					guide.center = true;
					guide.val = guide.val.replace(/\$/, "");
				}
			}
			// 間隔指定がない繰り返し
			if(guide.repeat > 1 && guide.span == 0) {
				guide.span = guide.val;
				guide.spanUnits = guide.units;
			}

			if(!guide.val || guide.val.length < 1) guide.val = null;
			guide.init();
			// 繰り返し処理
			if(guide.repeat > 1 && guide.span != 0) {
				var c = guide.repeat;
				guide.repeat = 1;
				for(var j=1; j<c; j++) {
					var rGuide = new Guide(guide);
					(rGuide.invert)? rGuide.val -= guide.span*j : rGuide.val += guide.span*j ;
					repArray.push(rGuide);
				}
			}
			guideData.push(guide);
		}
	}
	if(repArray.length > 0) guideData = guideData.concat(repArray);
	return guideData;
}

//==================================================
//四則演算の結果を返す（演算不可の場合はそのままの値を返す）
//==================================================
function calcValue(val) {

	var reslt;

	if(val.match(/^[\(\{\[\-\+0-9][\(\{\[\-\+\*\/\)\}\]\.0-9]*[\)\}\]0-9]$/)){
		try {
			reslt = eval(val);
		} catch(e) {
			// alert("演算失敗");
			reslt = val;
		}
	} else {
		// alert("演算不可");
		reslt = val;
	}

	return reslt;
}

//==================================================
//ドキュメントサイズを返す
//==================================================
function getDocSize(drc, unit) {

	var docSize, originalRulerUnits, orignalResolution;

	// 単位のチェック
	if(!unit || unit.length < 1){
		unit = new UnitValue(castValue(1)).type;
	}
	if(unit == "%") {
		return new UnitValue(100, "%");
	}
	// 向きのチェック
	if(drc != Direction.VERTICAL && drc != Direction.HORIZONTAL){
		return false;
	}
	// 現在の定規単位を保存
	originalRulerUnits = app.preferences.rulerUnits;
	// 定規単位が%のときはPixelに変更
	if(app.preferences.rulerUnits == Units.PERCENT) app.preferences.rulerUnits = Units.PIXELS;
	// ドキュメントサイズを取得する
	var docUnits = new UnitValue(castValue(1)).type;
	switch(drc) {
		case Direction.VERTICAL:
			docSize = new UnitValue(app.activeDocument.width, docUnits);
			break;
		case Direction.HORIZONTAL:
			docSize = new UnitValue(app.activeDocument.height, docUnits);
			break;
		default:
			break;
	}
	// 定規単位を戻す
	app.preferences.rulerUnits = originalRulerUnits;

	if(unit != docUnits) {
		if(docUnits == "px") {
			docSize /= app.activeDocument.resolution / 72;
		} else {
			docSize *= app.activeDocument.resolution / 72;
		}
	}

	return new UnitValue(docSize.as(unit), unit);
}

//==================================================
//CSVのデータを追加
//==================================================
function addcsv() {

	var csv, data, filename, fileObj;

	// ファイル選択ダイアログ
	filename = File.openDialog("「speedguide.csv」を選択してください");
	//ファイル名チェック
	if (filename && !String(filename).match(/.+speedguide\.csv$/i)) {
		alert("ファイル名が異なります\n「speedguide.csv」を選択してください");
		return false;
	}
	// CSVからデータを取り出す
	fileObj = new File(filename);
	if (fileObj.open("r")) {
		csv = fileObj.read();
		fileObj.close();
		data = parseCSV(csv);
		dialogs.csv = createCSVDialog(data);
		initCSVDialog(dialogs.csv);
		startCSVDialog(dialogs.csv);
	} else {
		if(filename) alert("ファイルが開けませんでした");
		return false;
	}
}

//==================================================
//CSVをパース
//==================================================
function parseCSV(file){

	var data=[], lines, noname=0;

	lines = file.split(/\r\n|\r|\n/);
	for(var i=0; i<lines.length; i++){
		if(lines[i].length > 0) {
			var tmp = lines[i].split(',');
			if(tmp[0].length < 1 || !tmp[0]) tmp[0] = "（名前なし設定 " + ++noname + "）";
			if(tmp[1].length < 1 || !tmp[1]) tmp[1] = "";
			if(tmp[2].length < 1 || !tmp[2]) tmp[2] = "";
			data.push(tmp);
		} else {
			lines.splice(i, 1);
	 		i--;
		}
	}
	return data;
}

//==================================================
//現在の全ガイドを返す（少数2位で四捨五入）
//==================================================
function getAllGuide() {
	var guides = app.activeDocument.guides;
	var vGuides=[], hGuides=[], spstr = " ";
	for(var i=0; i<guides.length; i++){
		switch(guides[i].direction) {
			case Direction.VERTICAL :
				vGuides.push(String(Math.round(guides[i].coordinate*100)/100)+guides[i].coordinate.type.replace(/ /g,""));
				break;
			case Direction.HORIZONTAL :
				hGuides.push(String(Math.round(guides[i].coordinate*100)/100)+guides[i].coordinate.type.replace(/ /g,""));
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
//実行開始
//==================================================
if(documents.length > 0) {
	dialogs.main = createMainDialog();
	initMainDialog(dialogs.main);
	startMainDialog(dialogs.main);
} else {
	alert("ドキュメントがありません\nスクリプトを終了します");
}