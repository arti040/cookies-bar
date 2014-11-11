/*
 *
 * name: cookies-bar
 * description: Simple and non-annoying Cookie-bar for your webstite 
 * version: 1.2 (11.11.2014)
 * author: Piotr Potera
 * www: http://piotrpotera.com
 * github: https://github.com/arti040
 *
 */

var cookiesBar = function(opts) {
 
  //Usefull methods
  function getStyle(el,styleProp) {
    var x;
    if(el == 'body') { x = document.body; }
    else { x = document.getElementById(el); }
  	
  	var y;
  	if (x.currentStyle) {
  		y = x.currentStyle[styleProp];		
    }
  	else if (window.getComputedStyle) {
  		y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
  	}
  	return y;
  }
  function createCookie(name,value,days) {
      if(days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
      }
      else var expires = "";
      document.cookie = name+"="+value+expires+"; path=/";
  }
  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
  }
  function eraseCookie(name) {
    createCookie(name,"",-1);
  }
  function extend() {
    var objects,name,
    copy,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length;
    
    //do nothing if only one argument is passed;
    if(length === i) { 
      console.log("Only one argument passed. Returning..."); 
      return false;
    }
    
    //main loop
    for(;i<length;++i) {
      //Deal with non null/undefined values
      if(((objects = arguments[i]) != null)){
        for(name in objects) {
          copy = objects[name];
          
          //Prevent never-ending loop
          if(target === copy) { continue; }
          
          // Don't bring in undefined values
          if(copy !== undefined) {
            target[name] = copy;
          }
        }        
      }
    } 
    
    return target;
  }
  function fadeOut(el) {
    el = document.getElementById(el);
    elOpacity = el.style.opacity;
    var fadeInterval = setInterval(function() { 
		el.style.opacity = --elOpacity;
		if(--elOpacity == 0) {
			clearInterval(fadeInterval);
			bar.style.display = 'none';
		}
	}, 1000);
  }
  
  //First - check if user already accepted cookies policy
  var cookieAccepted = readCookie(cookieAccepted);
  
  if(!cookieAccepted) {  
    
    //Some vars
    var showInterval,hideInterval,settings = {};
    
    //Check screen size. We don't want to play animation on small screens.
    var bodyFontSize = getStyle('body','font-size');
    var viewportWidth = Math.floor((window.innerWidth/parseFloat(bodyFontSize))*10)/10;
    
    //Some defaults first
    var defaults = {      
      mainText: "We use cookies to track usage and preferences.", 
      agreeLinkLabel: "I understand",
      declineLinkLabel: "Decline",
      detailsLinkLabel: "Cookies Policy »", 
      declineURL: "",
      detailsURL: "",
      detailsLink: false,
      declineLink: false,
      expireDays: 365,
      cookieEnabled: false,
      showSpeed: 25,
      hideSpeed: 5,
      position: 'absolute',
      reverseMode: false
    }
    //Let's update settings.with user settings
    settings = extend({},defaults,opts);

    //Validation
    if((settings.detailsLink === true) && (settings.detailsURL.toString().length == 0)) {
      settings.mainText = "Error: settings.detailsURL is empty. Check it!";
      settings.detailsLink = false;
    }
    if((settings.declineLink === true) && (settings.declineURL.toString().length == 0)) {
      settings.mainText = "Error: settings.declineURL is empty. Check it!";
      settings.detailsLink = false;
    }
    
    //Let's create few DOM elements
  	var bar = document.createElement('div');
  		  bar.setAttribute('id','cookies-bar');
  		  bar.style.position = settings.position; 
        
    if(settings.detailsLink) {
  	  var detailsLink = document.createElement('a');
    		detailsLink.setAttribute('href',settings.detailsURL);
    		detailsLink.innerHTML = settings.detailsLinkLabel;
  	}
  	if(!settings.reverseMode) {
    	var acceptLink = document.createElement('a');
  	    acceptLink.setAttribute('id','accept-link');
    		acceptLink.setAttribute('href','#');
    		acceptLink.innerHTML = settings.agreeLinkLabel;
    }
    
    if(settings.declineLink || settings.reverseMode) {
      var declineLink = document.createElement('a');
    	    declineLink.setAttribute('id','decline-link');
      		declineLink.setAttribute('href',settings.declineURL);
      		declineLink.innerHTML = settings.declineLinkLabel;
    } 		
  
    var mainText = document.createElement('p');
  	    mainText.innerHTML = settings.mainText;
  	
  	//Events	
  	//Set proper event name for IEs older than 9
  	var prefix = window.addEventListener ? "" : "on";
  	var eventName = window.addEventListener ? "addEventListener" : "attachEvent";
    
    //Hide cookies-bar and save a cookie when user clicks on "Accept"/"Agree" link
  	if(!settings.reverseMode) {
  	acceptLink[eventName](prefix + 'click', function(e) {
  		e.preventDefault ? e.preventDefault() : e.returnValue = false; 
  		
  		//Don't animate bar if screen size is small, i.e tablet/phone
  		if(viewportWidth < 64) { bar.style.display = 'none'; }
  		
  		else {
    		var barTop = parseInt(getStyle('cookies-bar','top'));
  			var barHeight = parseInt(getStyle('cookies-bar','height'));
  			
  			//Stop animation if user click "Accept" link
  			clearInterval(showInterval);
						
    		hideInterval = setInterval(function() { 
    			barTop = --barTop;
    			bar.style.top = barTop+'px';
    			if(barTop == barHeight) {
    				clearInterval(hideInterval);
    				bar.style.display = 'none';
    			}
  			}, settings.hideSpeed);
		  }
  		if(settings.cookieEnabled){ createCookie(cookieAccepted,1,settings.expireDays); }
  		
  	},false);
    }
    
  	//Apply elements to DOM
  	if(settings.detailsLink) { mainText.appendChild(detailsLink) };
  	bar.appendChild(mainText);
  	if(settings.declineLink || settings.reverseMode) { bar.appendChild(declineLink) };
  	if(!settings.reverseMode) { bar.appendChild(acceptLink); }
  	document.body.appendChild(bar);	  	
	}
  else { 
    //User accepted cookie so nothing to do here
    return null;   
  }
  
  //console.log(settings);
  
  //Don't animate bar if screen size is small, i.e tablet/phone  	
	if(viewportWidth < 64) { bar.style.top = 0; }
	else {
  	//Hack for Firefox
  	bar.style.display = 'block';
    var barHeight = bar.offsetHeight;
    
    bar.style.top = -barHeight + 'px';

  	var barTop = parseInt(getStyle('cookies-bar','top'));
		showInterval = setInterval(function(){	
			barTop = ++barTop;				
			bar.style.top = barTop+'px';
			if(parseInt(bar.style.top) == 0) {
				clearInterval(showInterval);
			}
		},settings.showSpeed);	
  }
  
  //Handle reverse mode - TODO
  if(settings.reverseMode) {
    //setTimeout(fadeOut('cookies-bar'),6000);
  }
};

