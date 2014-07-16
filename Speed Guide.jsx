#target photoshop
//SpeedGuide.jsx
//Created by Toshiyuki Takahashi - Graphic Arts Unit
//www.graphicartsunit.com

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
const SCRIPT_VERSION = "0.6.7";
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
	for (i=0; i<dlg.pGuide.children.length; i++){
		dlg.pGuide.children[i].alignment = "left";
	}
	//オプションパネル
	dlg.pOption = dlg.add("panel", undefined, "オプション");
	dlg.pOption.margins = [20, 20, 20, 20];
	//オプション1
	dlg.clearall = dlg.pOption.add("checkbox", undefined, "既存のガイドを全消去する", {value:settings.clearall});
	dlg.clearall.minimumSize = [550, 10];
	for (i=0; i<dlg.pOption.children.length; i++){
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
		thisObj.close();
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
	for (i=0; i<data.length; i++) {
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
	dlg.csvinfoH = dlg.pCSV.add("statictext",undefined, "水平：" + dlg.current[1]);
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
		w.close(1);
	};
 };
var startShowAllDialog = function(w){
	return w.show();
};

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

//==================================================
//初期処理
//==================================================
function sgStart(){

	var vgs, hgs, errorArray;

	//既存ガイドの消去
	if(settings.clearall) app.activeDocument.guides.removeAll();
	//ガイド追加を実行
	vgs = addGuides(getNumbers(settings.ver, Direction.VERTICAL));
	hgs = addGuides(getNumbers(settings.hor, Direction.HORIZONTAL));
	//エラーの個数を確認
	if(vgs && hgs) {
		errorArray = vgs.concat(hgs);
	} else if(vgs) {
		errorArray = vgs;
	} else if(hgs) {
		errorArray = hgs;
	}
	//アラート表示
	if(errorArray && errorArray.length > 0) {
		alert("無効な値があったため " + errorArray.length + " 本のガイドが作成できませんでした\n無効：" + errorArray);
	}
}

//==================================================
//ガイドを追加する処理
//==================================================
function addGuides(guideData){

	var errorArray=[];

	//引数をチェック
	if(!guideData || guideData.length < 1) return false;
	//ガイド追加処理
	for (i=0; i<guideData.length; i++){
		//値が有効かどうか
		if(!guideData[i].val || isNaN(Number(guideData[i].val)) || !guideData[i].direction || guideData[i].unitvalue.type == "?") {
			//エラーを追加
			errorArray.push("\"" + guideData[i].origin + "\"");
		} else {
			//ガイドを引く
			app.activeDocument.guides.add(guideData[i].direction, guideData[i].unitvalue);
		}
	}
	return errorArray;
}

//==================================================
//データの整形
//==================================================
function getNumbers(str, drc) {

	var splitArray, re, guideData=[];

	//引数をチェック
	if(str.length < 1) return false;
	//全角を半角に変換
	str = str.replace(/　/g," ");
	str = str.replace(/[！-～]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
	});
	//配列を分割してハッシュに
	splitArray = str.split(" ");
	for(i=0; i<splitArray.length; i++){
		if(splitArray[i].length < 1) {
			splitArray.splice(i, 1);
			i--;
		} else {
			re = /^(.*[^a-z%])([a-z%]*)$/gi.exec(splitArray[i]);
			guideData[i] = {origin:splitArray[i], val:null, units:null, unitvalue:null, invert:false, direction:drc};
			if(re && re.length>2) {
				if(re[2].length<1) re[2] = new UnitValue(castValue(1)).type;
				if(new UnitValue(re[1], re[2]).type != "?") {
					guideData[i] = {origin:splitArray[i], val:re[1], units:re[2], unitvalue:null, invert:false, direction:drc};
				}
			}
		}
	}
	//値に処理を施して使えるデータにする
	for(i=0; i<guideData.length; i++) {
		if(guideData[i].val) {
			//数値じゃない場合の処理
			if(isNaN(guideData[i].val)){
				//逆起点を処理（:が付加された数値）
				if(guideData[i].val.match(/^:/)){
					guideData[i].invert = true;
					guideData[i].val = guideData[i].val.replace(/^:/, getDocSize(guideData[i].direction, guideData[i].units) + "-[");
					guideData[i].val = guideData[i].val.replace(/$/, "]");
				}
				//四則演算可能な値を絞り込み
				if(guideData[i].val.match(/^[\(\{\[\-\+0-9][\(\{\[\-\+\*\/\)\}\]\.0-9]*[\)\}\]0-9]$/)){
					try {
						guideData[i].val = eval(guideData[i].val);
					} catch(e) {
						//alert("演算失敗");
					}
				} else {
					//alert("演算不可");
				}
			}
			//数値の場合の処理
			if(!isNaN(guideData[i].val)){
				if(guideData[i].units == "%") {
					if(guideData[i].val != 0) {
					 	guideData[i].val = guideData[i].val/100;
					}
				}
				guideData[i].unitvalue = new UnitValue(guideData[i].val, guideData[i].units);
			}
		} else {
			//alert("Null");
		}
	}
	return guideData;
}

//==================================================
//ドキュメントサイズを返す
//==================================================
function getDocSize(drc, unit) {

	var docSize, sru, raito = 1;

	//単位のチェック（%のときは100で返す）
	if(!unit){
		unit = new UnitValue(castValue(1)).type;
	} else if(unit == "%") {
		return 100;
	}
	//向きのチェック
	if(drc != Direction.VERTICAL && drc != Direction.HORIZONTAL){
		return false;
	}
	//現在の定規単位を保存
	sru = app.preferences.rulerUnits;
	//定規単位が%のときはPixelに変更
	if(app.preferences.rulerUnits == Units.PERCENT) app.preferences.rulerUnits = Units.PIXELS;
	//ドキュメントサイズを取得する
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
	//定規単位を戻す
	app.preferences.rulerUnits = sru;
	//値の変換
	if(unit != docUnits) {
		if(app.preferences.rulerUnits == Units.PIXELS || app.preferences.rulerUnits == Units.PERCENT) raito = Math.round(app.activeDocument.resolution/72*100)/100;
	// if(docUnits == "px") {
			docSize = docSize.as(unit)/raito;		
	// } else {
	// 	docSize = docSize.as(unit)*raito;		
	// }
	}
	if(unit == "px") {
		docSize = Math.round(docSize);
	} else {
		docSize = Math.round(docSize*100)/100;
	}

	return docSize;
}

//==================================================
//CSVのデータを追加
//==================================================
function addcsv() {

	var csv, data, filename, fileObj;

	//ファイル選択ダイアログ
	filename = File.openDialog("「speedguide.csv」を選択してください");
	//ファイル名チェック
	if (filename && !String(filename).match(/.+speedguide\.csv$/i)) {
		alert("ファイル名が異なります\n「speedguide.csv」を選択してください");
		return false;
	}
	//CSVからデータを取り出す
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
//現在の全ガイドを返す（少数2位で四捨五入）
//==================================================
function getAllGuide() {
	var guides = app.activeDocument.guides;
	var vGuides=[], hGuides=[], spstr = " ";
	for(i=0; i<guides.length; i++){
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
//オブジェクトの要素数を返す
//==================================================
function getObjectKeys(obj) {
	var n = 0;
	for (var key in obj) {
		++n;
	}
	return n;
}

//==================================================
//オブジェクトのプロパティ一覧を返す
//==================================================
function printProperties(obj) {
	var properties = '';
	for (var prop in obj){
		properties += prop + "=" + obj[prop] + "\n";
	}
	alert(properties);
}
