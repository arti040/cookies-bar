/*
 * name: cookies-bar
 * description: Simple and non-annoying Cookie-bar for your webstite 
 * version: 1.4 (1.04.2015)
 * author: Piotr Potera
 * www: http://piotrpotera.com
 * github: https://github.com/arti040
 */

var cookiesBar = function(opts) {
 
  //Useful functions
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
  function showBar(el,interval,position) {
    var elHeight = el.offsetHeight;
    var pos = -elHeight;

    interval = setInterval(function(){
      pos = ++pos;
      if(position == 'bottom') {
        bar.style.bottom = pos+'px';
      }
      else {
        bar.style.top = pos+'px';
      }
      if(pos == 0) { clearInterval(interval); }

    }, settings.showSpeed);    
  } 
  function hideBar(el,interval,position) {
    var elHeight = el.offsetHeight;
    var pos = 0;
    interval = setInterval(function(){
      pos = --pos;
      if(position == 'bottom') {
        bar.style.bottom = pos+'px';
      }
      else {
        bar.style.top = pos+'px';
      }
      if(pos == -elHeight) { clearInterval(interval); }

    }, settings.hideSpeed);
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
      positionMode: 'absolute',
      position: 'top',
      reverseMode: false,
      delay: 0,
      zIndex: 10,
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
  		  bar.style.position = settings.positionMode; 
  		  bar.style.zIndex = settings.zIndex;
        
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
  			//Stop animation if user click "Accept" link
  			clearInterval(showInterval);
  			
				hideBar(bar,hideInterval,settings.position);		
		  }
  		if(settings.cookieEnabled){ createCookie(cookieAccepted,1,settings.expireDays); }
  		
  	},false);
    }
    
  	//Apply elements to DOM
  	if(settings.detailsLink) { mainText.appendChild(detailsLink); };
  	bar.appendChild(mainText);
  	if(settings.declineLink || settings.reverseMode) { bar.appendChild(declineLink); }
  	if(!settings.reverseMode) { bar.appendChild(acceptLink); }
  	document.body.appendChild(bar);
  	
  	//Set initial top/bottom position
  	var barHeight = bar.offsetHeight;	  
  	if(settings.position == 'bottom') { bar.style.bottom = -barHeight+'px'; }
  	else { bar.style.top = -barHeight+'px'; }	
	}
  else { 
    //User accepted cookie so nothing to do here
    return null;   
  }
    
  //AnonFunc for delay option  
  function run() {
    return showBar(bar,showInterval,settings.position);
  }  

  //Don't animate bar if screen size is small, i.e tablet/phone  	
	if(viewportWidth < 64) { 
    if(settings.position == 'bottom') {
    	bar.style.bottom = 0; 
    }
    else { bar.style.top = 0; }
  }
	else { setTimeout(run,settings.delay); }
  
  //Handle reverse mode - TODO
  if(settings.reverseMode) {
    
  }
};

