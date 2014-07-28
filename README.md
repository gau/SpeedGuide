# Speed Guide ReadMe #

ガイドを素早く作成するためのPhotoshop用スクリプト（jsx）です。複数のガイドをスペース区切りで一度に作成できます。不規則なガイドをたくさん作成するときに便利です。

[図入りの解説](http://graphicartsunit.tumblr.com/post/92236824249/photoshop-speed-guide)

-----

### 更新履歴 ###

* 0.8.5：ピクセル単位使用時に誤差が出るのを修正／CSVファイルを更新
* 0.8.4：繰り返し間隔に「%」を使った場合の挙動を改善
* 0.8.3：無効値の警告を実行前に変更／実行後にガイドが表示状態になるように変更
* 0.8.2：定規単位が「%」のときに一部のガイドの位置が変わるバグを修正
* 0.8.1：ライセンス表記追加
* 0.8.0：繰り返し作成に対応
* 0.7.1：中央起点の記号を「$」に変更
* 0.7.0：中央起点に対応／単位変換時の処理を改良
* 0.6.7：単位変換時のバグを修正
* 0.6.6：エラー処理のバグを修正
* 0.6.5：演算処理の方法を変更
* 0.6.1：無効値が正しく処理されないバグ修正／エラー表示のバグを修正
* 0.6.0：無効値の処理を改善／エラーの表示方法を改善
* 0.5.0：新規作成

-----

### 対応バージョン ###

* Photoshop CS6／CC／CC2014

-----

### インストール方法 ###

1. 以下の場所に、「Speed Guide.jsx」をコピーします。Windows版ではお使いのPhotoshopのモードによって保存する場所が異なりますのでご注意ください。
 * 【Mac】/Applications/Adobe Photoshop [CS6/CC]/Presets/Scripts/
 * 【Windows 64bit版】C:\Program Files\Adobe\Adobe Photoshop {CS6|CC|CC2014} (64 Bit)\Presets\Scripts\
 * 【Windows 32bit版】C:\Program Files (x86)\Adobe\Adobe Photoshop {CS6|CC}\Presets\Scripts\
2. Photoshopを再起動します。
3. “ファイル”メニュー→“スクリプト”に“Speed Guide”と表示されていればインストール成功です。

-----

### 基本の使い方 ###

1. ガイドを入れたい画像を開き、“ファイル”メニュー→“スクリプト”→“Speed Guide”を選択します。
2. ［水平：］と［垂直：］のフィールドに、作成したいガイドの位置を半角数字で入力します。
3. 複数のガイドを作成するときは、スペース区切りで数値を入力します。
4. ［OK］をクリックします。

入力例）［3 5 10］［5 10 15 20］...など

-----

### 便利な使い方1：単位の指定 ###

数字＋半角英字で単位の指定が可能です。使える単位は「pixel（px）、mm、cm、inch（in）、point（pt）、pica（pc）、%、m、km、feet（ft）、yard（yd）、mile（mi）」です。数値のみを入力したときは、環境設定の定規の単位が使用されます。

入力例）［3mm］［5in］［50%］...など

-----

### 便利な使い方2：四則演算 ###

フィールド内での四則演算が可能です。ただし、演算の中に複数の単位を混在させることはできません。必ず、演算式のみ、または演算式＋単位の形で記述します。使用可能な演算子は「+」「-」「*」「/」の4種類です。[]{}()の3種類の括弧を使った演算もOKです。

入力例）［10-2mm］［(20+5)*2in］［12/3-20］...など

-----

### 便利な使い方3：逆を起点にする ###

通常はカンバスの左上が起点となりますが、数値や演算式の前に、コロン（:）を付加することで、右下を起点としてガイドを作成できます。次項の中央起点の記号（$）と組み合わせることもできます。順番はどちらが先でも構いません。なお、ガイドは定規の原点を基準に起算するので、定規の原点を移動しているときはガイドの位置がずれてしまいます。事前に定規の原点をリセット（定規の交点をダブルクリック）してからの実行をお勧めします。

例）左右に3mmずつの位置にガイドを作成する→［垂直］に［3mm :3mm］と入力

-----

### 便利な使い方4：中央を起点にする ###

数値や演算式の前に、ドルマーク（$）を付加することで、カンバスの中央を起点としてガイドを作成できます。前項の逆起点の記号（:）と組み合わせることもできます。順番はどちらが先でも構いません。なお、ガイドは定規の原点を基準に起算するので、定規の原点を移動しているときはガイドの位置がずれてしまいます。事前に定規の原点をリセット（定規の交点をダブルクリック）してからの実行をお勧めします。

例）中央から左右にに10mmずつの位置にガイドを作成する→［垂直］に［$10mm $:10mm］と入力

-----

### 便利な使い方5：繰り返し作成する ###

位置指定の数値のあとに、アットマーク（@）と数字を付加することで、数値のガイドを指定回数繰り返しできます。数値で指定した位置を起点として、同じ幅で指定回数繰り返します。逆起点のコロンや中央起点のドルマークと併用も可能です。

例）左端から100pixelの位置を起点として、100pixel間隔で右向きに5本のガイドを作成する→［垂直］に［100px@5］と入力

-----

### 便利な使い方6：繰り返しの起点位置を指定する ###

アットマーク（@）を使った繰り返し指定の前に、大なり不等号（>）と数値（単位）を付加することで、繰り返しの間隔を指定できます。最初の数値で指定した位置を起点として、異なる幅で指定回数繰り返し可能です。間隔の数値は、最初の数値と同様に四則演算や単位の指定は可能ですが、コロンやドルマークを使った起点位置の変更はできません。

例）右から20pixelの位置を起点として、左向きに80pixel間隔で10本のガイドを作成する→［垂直］に［:20px>80px@10］と入力

-----

### 便利な使い方7：既存のガイドを全消去 ###

［オプション］の［既存のガイドを全消去する］のチェックをオンにして実行すると、現在配置されているすべてのガイドを削除してから、新しいガイドを作成します。ガイドを一新したいときに便利です。

-----

### 便利な使い方8：値のコピー ###

 ［垂直］フィールドに入力したのと同じ値を［水平］フィールドにも入力したい場合、［垂直］を入力したあとで、フィールドラベルの［水平：］の文字をクリックすると、内容が［水平］フィールドにコピーされます。もちろん、［水平］→［垂直］のコピーもできます。

この機能を使いたくないときは、「Speed Guide.jsx」をエディタで開き、16行目あたりにある「quickcopy : true」を「quickcopy : false」に変更してください。

-----

### 便利な使い方9：CSVから読み込む ###

よく使う設定をCSVファイルとして書いておけば、それを呼び出して使うことができます。ダイアログの［CSV...］をクリックしてファイルを選択し、ドロップダウンリストから希望の設定を選択して［値をセット］をクリックすれば、自動的に［垂直］［水平］のフィールドに値がセットされます。

* ファイル名は、必ず「speedguide.csv」にしておきます。
* CSVは「設定名,垂直方向のガイド,水平方向のガイド」という形のカンマ区切りです。改行ごとで別設定になります。
* CSVの文字コードはUTF-8推奨です。
* ファイル内容についてのエラー処理は特に入れていませんので、各自ご注意ください。

詳しい仕様は、jsxと一緒にダウンロードできる「speedguide.csv」を参照してください。

-----

### 便利な使い方10：現在のガイド位置を取得する ###

ダイアログの左下にある、［現在の定規の単位：xx］の文字をクリックすると、現在の画像に配置されたガイドの位置を「設定名,垂直方向のガイド,水平方向のガイド」の形式で表示します。これをコピーして「speedguide.csv」に追記しておけば、ガイドの流用ができます。

単位はすべて環境設定の定規の単位になり、値は少数第2位で四捨五入されます。

-----

### チートシート的なやつ ###

* n=数値のみ、数値＋単位
* s=数値のみ、数値＋単位
* c=数値のみ（整数）
* 入力する文字はすべて半角です

| 表記 | 書き方 | 説明 | 備考 |
|:-----------|:------------|:------------|:------------|
| n | 単体 | nの位置に作成 | nは四則演算可 |
| n n n ... | スペース区切り | それぞれのnの位置に作成 | nは四則演算可 |
| n+n’ | +-*/を使った四則演算式 | 演算結果の位置に作成 | スペース区切り可 |
| :n | 先頭に「:」を付加 | 逆（右、下）起点としてnの位置に作成 | nは四則演算可／スペース区切り可 |
| $n | 先頭に「$」を付加 | 中央起点としてnの位置に作成 | nは四則演算可／スペース区切り可 |
| n@c | 数値のあとに「@c」を付加 | nの位置を起点にnの間隔でc回繰り返す | nは四則演算可／cは数字のみ |
| n>s@c | 数値のあとに「>s」、「@c」を付加 | nの位置を起点にsの間隔でc回繰り返す | n,sは四則演算可／cは数字（整数）のみ |

-----

### その他 ###

* 数値と単位の間にはスペースを入れないでください。スペースが入ると、別の値として処理されます。
* 全角で入力した場合も半角に自動で変換されますが、できるだけ半角で入力されることをお勧めします。
* 認識できない書式で入力された場合、事前に警告を表示します。
* 定規の原点を移動しているときは、原点を基準に起算するので、ガイドの位置がずれてしまいます。カンバスの左上を基準にするときは、必ず定規の原点をリセット（定規の交点をダブルクリック）してから実行してください。
* 単位を変換する際、軽微な誤差が発生します。

-----

### 免責事項 ###

* このスクリプトを使って起こったいかなる現象についても制作者は責任を負えません。すべて自己責任にてお使いください。
* 一応CS6、CC、CC2014で動作の確認はしましたが、OSのバージョンやその他の状況によって実行できないことがあるかもしれません。もし動かなかったらごめんなさい。

-----

### ライセンス ###

* Speed Guide.jsx
* Copyright (c) 2014 Toshiyuki Takahashi
* Released under the MIT license
* [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)

* Created by Toshiyuki Takahashi (Graphic Arts Unit)
* [Graphic Arts Unit](http://www.graphicartsunit.com/)
* [Twitter](https://twitter.com/gautt)