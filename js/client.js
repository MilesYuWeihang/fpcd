//client.js

var char = "card1001";

var cards = [3001,3002];
var deck = [3001,3002];
for(var i = 0; i <10; i++){
	deck.push(3001);
	deck.push(3002);
}
var originDeck = deck;
var cardTypes = cards.length;

// ob : 0 is me, 1 is opponent
var hundred = 100;
var handMax = 6;
var myHand = 0;
var opHand = 0;
var screem = $("#screem")[0];
screem.position = 333;
var hand = $(".card");
for(var i = 0; i < 6; i++){
	hand[i].position = hundred+i+1;
	hand[6+i].position = i+1;
}

var mySanDom = $("#myself")[0];
var opSanDom = $("#opponent")[0];
var mysan = $("#mysan")[0];
var opsan = $("#opsan")[0];

var turnInfo = $(".turn")[0];
turnInfo.ondblclick= function(){
	this.innerHTML = "opponent's Turn";
	enable(0);
	packSend("start",null,null,null,null);
	packSend("draw", null, 0, null, 1);
}

var curDOM;
var greenWin = $(".hid")[0];
var redCross = $(".hid")[1];
var targetShow = false;

// load all positions in board
var board = [];
for(var i = 0; i<12; i++){
	var card = hand[i]
	board.push({"pos":card.position,"card":card});
}
mySanDom.position = 11;
opSanDom.position = 111;
board.push({"pos":mySanDom.position,"card":mySanDom});
board.push({"pos":opSanDom.position,"card":opSanDom});


enable(1);

// 1 i win;
// 2 op win;
// 3 tie;
// 0 continue;
function gameover(){
	if(opponent.san <= 0 && myself.san >0){
		return 1;
	}
	if(opponent.san <= 0 && myself.san <= 0){
		return 3;
	}
	if(opponent.san >= 0 && myself.san <= 0){
		return 2;
	}
	else{
		return 4;
	}
}

function checkWin(){
	var ret = gameover();
	
	if(ret == 4){
		return;
	}
	else{
		endGame(ret);
		if(ret === 1){
			ret = 2;
		}
		if(ret === 2){
			ret = 1;
		}
		packSend("end","gameover",ret,null,null);	
	}
}

function endGame(ret){
	var info;
	if(ret == 1){
		info = "You Win";
	}
	if(ret == 2){
		info = "You Lose";
	}
	if(ret == 3){
		info = "Tie";
	}
	turnInfo.innerHTML = "GameOver" + info;
	enable(1);
	clearGame();
}



function enable(ab){
	for(var i = 0; i < board.length; i++){
		board[i].card.enable = ab;
		//console.log(board[i]);
	}
}

function selectDom(dom){
	console.log(dom.position);
	curDOM = dom;
}

for(var i = 0; i < board.length; i++){
	var dom = board[i].card;
	//console.log(dom);
	dom.addEventListener("click", function(){
		selectDom(this);
	});
}




// opponents hand card only
cardback = new Object();
cardback.img = "../img/card1.jpg";
cardback.name = "cardback";
cardback.owner = 1;
cardback.onclick = function(){
	console.log("this is card back");
}

cardblank = new Object();
cardblank.owner = 1;
cardblank.name = undefined
cardblank.img = "../img/card.jpg";

console.log('current');

for(var i = 0; i < cards.length; i++){
	var name = 'card' + cards[i];
	document.write("<script id = " + name + " src='../" + name + "/" + name + ".js'></script>");
	//console.log(name);
}
document.write("<script id = " + char + " src='../" + char + "/" + char + ".js'></script>");


//console.log(mySanDom);

var myself = {
	san: 40,
	flip: 0
};

var opponent = {
	san: 40,
	flip: 0
};

function findCard(pos){
	for(var i = 0; i < board.length; i++){
		if(board[i].pos === pos){
			return board[i].card;
		}
	}
}

function packSend(type, info, target, attribute, value){
	var packet = JSON.stringify({
		"type": type,
		"info": info,
		"target": target,
		"attribute": attribute,
		"value":value
	})
	ws.send(packet);
}

function positionShift(pos){
	console.log("posi "+pos);
	pos = parseInt(pos);
	if(pos < 100){
		pos += 100;
	}
	else{
		pos -= 100;
	}
	return pos;
}

function shiftHand(pos,obj){
	if(obj === 0){
		if(pos < 6){
			for(var i = pos+6; i<=5+6; i++){
				if(hand[i].name === undefined && hand[i].name === cardblank.name){
					shiftCard(hand[i],cardblank);
					shiftCard(hand[i-1],cardblank);
					break;
				}
				else{
					console.log(hand[i-1]);
					console.log(hand[i]);
					shiftCard(hand[i-1],hand[i]);
					
				}
			}
		}
		shiftCard(hand[11],cardblank);
		console.log('client send shifthandinggggggggg ' + pos);
		packSend("shiftHand",null,pos,null,1);
		console.log('client send shifthand');
	}
	//opponents only shift once per pack.
	else{
		console.log('pos ' + pos);
		shiftCard(hand[pos-1],cardback);
		shiftCard(hand[opHand],cardblank);
	}

}

function shiftCard(card, obj){
	//console.log(obj);
	card.img = obj.img;
	card.children[0].src = obj.img;
	card.onmouseover = obj.onmouseover;
	card.onmouseout = obj.onmouseout;
	card.owner = obj.owner;
	card.name = obj.name;
	//card.enable = obj.enable;
	//console.log("beffff")

	card.playcard = obj.playcard;

	card.ondblclick = function(){
		console.log(card.enable);
		if(card.playcard != undefined && card.enable === 0){
			if(card.playcard()){
				//myHand -= 1;
				console.log("pos "+card.position);

			}
		}
	}

}
	//console.log("affff");
	


	function removeCard(card){
		if(card.owner === 0){
			shiftCard(card, cardblank);
			var pos = positionShift(card.position);
			console.log(pos);
			myHand -= 1;
			packSend("drop",null,pos,null,1)
			shiftHand(card.position,0);
			checkWin();
		}
	}

	function playcard(card,target){
		card.onclick;
	// one time
	shiftCard(card, cardblank);
}

function sanChange(ob, value){
	console.log(ob + " life changed "+ value);
	if(ob == 0){
		myself.san += value;
		mysan.innerHTML = myself.san;
	}
	else{
		opponent.san += value;
		opsan.innerHTML = opponent.san;
	}
}

function dealDamage(){
	var opponent = $(".card");
	console.log(opponent);
	//shiftCard(opponent[0], cardback);
}

function drawCard(ob, value){
	var handNum;
	var start;
	if (ob === 0){
		handNum = myHand;
		start = handNum + 6;
	}
	else{
		handNum = opHand;
		start = handNum + 0;
	}
	if(value + handNum > handMax){
		value = handMax - handNum;
	}
	if(ob === 0){
		for(var i = 0; i < value; i++){
			var tmp = "card" + deck[0];
			var cur = eval(tmp);

			console.log(cur);
			cur.owner = 0;
			shiftCard(hand[start+i],cur);	
			deck.splice(0,1);
			
		}
		myHand += value;
		packSend("draw", null, 1, null, value);

	}
	else{
		for(var i = 0; i < value; i++){
			var cur = eval("cardback");
			cur.owner = 1;
			shiftCard(hand[start+i],cur);
		}
		opHand += value;
	}


}

function clearGame(){
	for(var i = 0; i< board.length; i++){
		shiftCard(board[i].card,cardblank);
	}
}



ws.onmessage = function (e) {
	var data = JSON.parse(e.data);
	console.log("card type info: %s  %s", data.type, data.info);
	if(data.type === "assignID"){
		myid = data.info;
		console.log("my id is " + myid);
	}
	if(data.type === "end"){
		console.log("gameover");
		endGame(data.target);

	}
	if(data.type === "draw"){
		console.log("drawing");
		drawCard(data.target ,data.value);
	}
	if(data.type === "drop"){
		console.log("card drop");
		console.log("data "+data);
		var pos = data.target;
		var card = findCard(pos);
		console.log("pos "+pos);
		opHand -= 1;
		shiftCard(card,cardblank);
	}
	if(data.type === "start"){
		console.log("your turn start");
		enable(0);
		turnInfo.innerHTML = "Your Turn";
		var cardchar = eval(char);
		shiftCard(mySanDom,cardchar);

	}
	if(data.type === "shiftHand"){
		console.log("hand shifting");
		shiftHand(data.target,1);
	}
	if(data.type === "action"){
		if(data.attribute === "san"){
			sanChange(data.target,data.value);
		}
	}
}


function showTarget(card, icon){
	card = card.children[0].getBoundingClientRect()

	icon.style.height = card.height;
	icon.style.width = card.width;
	icon.style.left = card.left
	icon.style.top = card.top + document.body.scrollTop;
	icon.style.display = "inline";
}

window.onload = function(){
	// drawCard(0,4);
	// drawCard(1,2);
}