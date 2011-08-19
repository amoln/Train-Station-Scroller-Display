// The animation works well and fast on the webkit browsers.
// On Firefox it is slow though and so you may try to tweak the code to make it fast or change the duration of animation per character and per message to give
// some breather time for firefox and such browsers.

var messages = new Array();

var App = {
  totalChars: 70, // This generates the number of boxes to hold the characters.
  positionsForChars: null,
  charSet: " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:,.@'!",
  heightToScrollPerCharacter: 29, 
  // <heightToScrollPerCharacter> is the most important number to derive based on the font size you want.
  // For this demo, the font-size is 16px, and has margins on all sides.
  // If you change the font-size, calculate the total height to be scrolled up or down to move to the next character and update that here.

  start: function() {
    try {
      this.buildCharacters();
      this.initPositionsForChars();
      this.loadMessages();
      setTimeout(function(){App.showMessages(0);},2000);
    }catch(Err){alert(Err)}
  },
  
  //This will create the boxes to hold characters in the HTML.
  buildCharacters: function() {
    var parent = $("#message-container");
    for(var i=0;i<79;i++) {
      parent.append("<div id=\"parent"+i+"\" class=\"character-container\">");
      var innerParent = parent.find("#parent"+i);
      for (var j=0;j<App.charSet.length;j++) {
        var characterToAdd = App.charSet[j];
        if (j==0) {characterToAdd = "&nbsp;"}
        innerParent.append("<div id=\""+i+""+j+"\" class=\"character\" >"+characterToAdd+"</div>")
      }
    }
  },
  
  initPositionsForChars: function() {
    App.positionsForChars = new Array(App.totalChars);
    for (var i=0;i<App.totalChars;i++) {
      App.positionsForChars[i] = 0;
    }
  }, 

  //This creates the array of messages to be shown. Override to show your own.
  loadMessages: function() {
    messages[messages.length] = "Hello World !";
    messages[messages.length] = "This is an example of a type of Train Station Scroller Display.";
    messages[messages.length] = "Hope you liked it...";
    messages[messages.length] = "That is it for now, GoodBye !";
  },
  
  //Pick messages one at a time and loop thru them.
  showMessages: function(ctr) {
    if (ctr<messages.length) {
      var x = Math.ceil(Math.random()*7)
      if (x>4) { // This is just to reset the positions after a while due to javascript weirdness sometimes. Change this code if it happens too often.
        App.resetMessage();
      }
    } else {
      ctr = 0;
    }
    App.showMessage(ctr)
    setTimeout(function(){App.showMessages(++ctr)},10000)
  },
  //Reset everything after a while randomly.
  resetMessage: function() {
    for(var x=0;x<App.totalChars;x++) {
      $("#parent"+x).scrollTop(0);
      App.positionsForChars[x]=0;
    }
  },
  
  showMessage: function(idx) {
    if (idx >= messages.length) {idx=0;}
    var str = messages[idx];
    var message = App.adjustMessage(str)
    App.animateMessage(message)
  },

  //If the message has to be displayed in the center of the scroller, this will add the necessary padding in front and back.
  adjustMessage: function(str) {
    str = str.substring(str.indexOf(":")+1)
    if (str.length > App.totalChars) {
      str = str.substring(0,App.totalChars);
    } else {
      diff = App.totalChars - str.length;
      if (diff > 5) {
        var paddingStr = "";
        for (var x = 0;x<diff/2;x++) {
          paddingStr += " ";
        }
        str = paddingStr + " " + str + paddingStr;
      }
    }
    return str;
  },
  
  animateMessage: function(str) {
    for(var i=0;i<str.length;i++) {
      App.animateCharacter(App.charSet.indexOf(str.charAt(i).toUpperCase()),i)
    }
  },
  
  animateCharacter: function(futurePosForThisChar, idx) {
    var currentPosForThisChar = App.positionsForChars[idx];
    if (currentPosForThisChar<futurePosForThisChar) {
      App.hideCharacterUp(idx,currentPosForThisChar,futurePosForThisChar)
      App.positionsForChars[idx] = futurePosForThisChar;
    } else if (currentPosForThisChar>futurePosForThisChar) {
      App.hideCharacterDown(idx,currentPosForThisChar,futurePosForThisChar)
      App.positionsForChars[idx] = futurePosForThisChar;
    }
  },
  
  hideCharacterUp: function(idx,currentPos, futurePos) {
    if (currentPos<futurePos) {
      App.animateScrollUp($("#parent"+idx),1,App.heightToScrollPerCharacter)
      setTimeout(function(){App.hideCharacterUp(idx,++currentPos,futurePos)},100)
    }
  },
  
  animateScrollUp: function(elm,ctr,end) {
    elm.scrollTop(elm.scrollTop()+1)
    if (ctr<end) {
      setTimeout(function(){App.animateScrollUp(elm,++ctr,end)},10)
    }
  },
  animateScrollDown: function(elm,ctr,end) {
    elm.scrollTop(elm.scrollTop()-1)
    if (ctr<end) {
      setTimeout(function(){App.animateScrollDown(elm,++ctr,end)},10)
    }
  },
  
  hideCharacterDown: function(idx,currentPos, futurePos) {
    if (currentPos>futurePos) {
      App.animateScrollDown($("#parent"+idx),1,App.heightToScrollPerCharacter)
      setTimeout(function(){App.hideCharacterDown(idx,--currentPos,futurePos)},100)
    } else {
      $("#"+idx+futurePos).show()
    }
  }
}