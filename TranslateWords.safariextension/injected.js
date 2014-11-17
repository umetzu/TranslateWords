var sel, selDiv, transDiv;

function handleContextMenu(msgEvent) {
	removeDivs();
   	sel = window.getSelection();
    safari.self.tab.setContextMenuEventUserInfo(msgEvent, (sel + '').replace(/^\s+|\s+$/g,""));
}

function handleMessage(msgEvent) {
    var messageName = msgEvent.name;
    var messageData = msgEvent.message;

	if (messageName === "translate"){
		showTrans(messageData);
	} else if (messageName === "showSelection") {
		showSelDiv();
	}
}

document.addEventListener("contextmenu", handleContextMenu, false);
safari.self.addEventListener("message", handleMessage, false);

function showSelDiv() {
	if(!sel) return;

	var selText = sel + '';
    var fontSize, fontWeight, fontStyle, fontFamily;

    var containerEl = sel.getRangeAt(0).commonAncestorContainer;
    if (containerEl.nodeType == 3) {
        containerEl = containerEl.parentNode;
    }
    fontSize = window.getComputedStyle(containerEl, null)["fontSize"];
    fontWeight = window.getComputedStyle(containerEl, null)["font-weight"];
    fontStyle = window.getComputedStyle(containerEl, null)["font-style"];
    fontFamily = window.getComputedStyle(containerEl, null)["font-family"];

    var range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);

    var markerEl = document.createElement("span");
    markerEl.id = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);
    markerEl.appendChild(document.createTextNode("\ufeff"));
    range.insertNode(markerEl);

    var obj = markerEl;
    var leftPos = -1;
    var topPos = 0;
    do {
        leftPos += obj.offsetLeft;
        topPos += obj.offsetTop;
    } while (obj = obj.offsetParent);
    markerEl.parentNode.removeChild(markerEl);

    selDiv = document.createElement("div");
    $(selDiv).addClass('selected-word')
    .html(selText)
    .css('left', leftPos + 'px')
    .css('top', topPos + 'px')
    .css('font-size', fontSize)
    .css('font-weight', fontWeight)
    .css('font-syle', fontStyle)
    .css('font-family', fontFamily)
    .appendTo(document.body)
    .hide()
    .fadeToggle(100);
}

function showTrans(translation) {
	if (!selDiv) return;
	transDiv = document.createElement('div');
    $(transDiv).addClass('bubble')
    .html(translation)
    .css('left', (selDiv.offsetLeft + (selDiv.offsetWidth / 2) - 54) + 'px')
    .css('top', (selDiv.offsetTop + selDiv.offsetHeight + 10) + 'px')
    .insertBefore(document.body)
    .blur(function(){
        removeDivs();
    })
    .hide()
    .slideToggle(200);
}

function removeDivs() {
	if (selDiv && transDiv && selDiv.parentNode && transDiv.parentNode){
		$(selDiv).remove();
		$(transDiv).remove();
	}
}

$(document).keydown(function(event){
 	removeDivs();
});

$(document).click(function(event){
 	removeDivs();
});

$(window).scroll(function() {
	removeDivs();
});