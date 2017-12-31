//client.js

var cards = [3001,3002];
var deck = [3001,3002];
for(var i = 0; i <10; i++){
	deck.push(3001);
	deck.push(3002);
}

// ob : 0 is me, 1 is opponent

var handMax = 6;
var myHand = 0;
var opHand = 0;
var screem = $("#screem");


cardback = new Object();
cardback.img = "../img/card1.jpg";
cardback.onclick = function(){
	console.log("this is card back");
}

cardblank = new Object();
cardblank.img = "../img/card.jpg";



card3001 = new Object();
card3001.img = "../card3001/3001.png";
card3001.onclick = function(){
	sinChange(1, -5);
};
card3001.onmouseover = function(){
	console.log(screem[0]);
	screem[0].children[0].src = card3001.img;

}

card3002 = new Object();
card3002.img = "../card3002/3002.jpg";
card3002.onclick = function(){
	sinChange(0, 8);
};
card3002.onmouseover = function(){
	console.log(screem[0]);
	screem[0].children[0].src = card3002.img;

}

function shiftCard(card, obj){
	//console.log(obj);
	card.children[0].src = obj.img;
	card.onmouseover = obj.onmouseover;
	//console.log("beffff")

	card.playcard = obj.onclick;

	card.onclick = function(){
		if(card.playcard != undefined){
			card.playcard();
			shiftCard(card, cardblank);
		}
		
	}
	//console.log("affff");
	
}

function playcard(card,target){
	card.onclick;
	// one time
	shiftCard(card, cardblank);

}

function sinChange(ob, value){
	console.log(ob + " life changed "+ value);
}

function dealDamage(){
	var opponent = $(".card");
	console.log(opponent);
	//shiftCard(opponent[0], cardback);
}

function drawCard(ob, value){
	var handNum;
	var start;
	var hand = $(".card");
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
			var cur = eval("card" + deck[0]);
			console.log(cur);
			shiftCard(hand[start+i],cur);
			deck.splice(0,1);
		}
	}
	else{
		for(var i = 0; i < value; i++){
			var cur = eval("cardback");
			shiftCard(hand[start+i],cur);
		}
	}


}

drawCard(0,4);
drawCard(1,2);
