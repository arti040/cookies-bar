/*
 *
 * name: cookies-bar
 * description: Simple and non-annoying Cookie-bar for your webstite 
 * version: 1.1 (08.11.2014)
 * author: Piotr Potera
 * www: http://piotrpotera.com
 * github: https://github.com/arti040
 *
 */

(function cookiesBar() {
  //First - check if user already accepted cookies policy
  var cookieAccepted = readCookie(cookieAccepted);

  if(!cookieAccepted) {  
    
    //Some vars
    var showInterval,hideInterval;
    
    //Check screen size. We don't want to play animation on small screens.
    var bodyFontSize = getStyle('body','font-size');
    var viewportWidth = Math.floor((window.innerWidth/parseFloat(bodyFontSize))*10)/10;
    
    //Some defaults first
    var opts = {      
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
      hideSpeed: 5
    }
    
    //Validation
    if((opts.detailsLink === true) && (opts.detailsURL.toString().length == 0)) {
      opts.mainText = "Error: opts.detailsURL is empty. Check it!";
      opts.detailsLink = false;
    }
    if((opts.declineLink === true) && (opts.declineURL.toString().length == 0)) {
      opts.mainText = "Error: opts.declineURL is empty. Check it!";
      opts.detailsLink = false;
    }
    
    //Let's create few DOM elements
  	var bar = document.createElement('div');
  		  bar.setAttribute('id','cookie-bar'); 
        
    if(opts.detailsLink) {
  	var detailsLink = document.createElement('a');
    		detailsLink.setAttribute('href',opts.detailsURL);
    		detailsLink.innerHTML = opts.detailsLinkLabel;
  	}
  	var acceptLink = document.createElement('a');
  	    acceptLink.setAttribute('id','accept-link');
    		acceptLink.setAttribute('href','#');
    		acceptLink.innerHTML = opts.agreeLinkLabel;
    
    if(opts.declineLink) {
      var declineLink = document.createElement('a');
    	    declineLink.setAttribute('id','decline-link');
      		declineLink.setAttribute('href',opts.declineURL);
      		declineLink.innerHTML = opts.declineLinkLabel;
    } 		
  
    var mainText = document.createElement('p');
  	    mainText.innerHTML = opts.mainText;
  	
  	//Events	
  	//Set proper event name for IEs older than 9
  	var prefix = window.addEventListener ? "" : "on";
  	var eventName = window.addEventListener ? "addEventListener" : "attachEvent";
    
    //Hide cookies-bar and save a cookie when user clicks on "Accept"/"Agree" link
  	acceptLink[eventName](prefix + 'click', function(e) {
  		e.preventDefault();
  		
  		//Don't animate bar if screen size is small, i.e tablet/phone
  		if(viewportWidth < 64) { bar.style.display = 'none'; }
  		
  		else {
    		var barTop = parseInt(getStyle('cookie-bar','top'));
  			var barHeight = parseInt(getStyle('cookie-bar','height'));
  			
  			//Stop animation if user click "Accept" link
  			clearInterval(showInterval);
						
    		hideInterval = setInterval(function() { 
    			barTop = --barTop;
    			bar.style.top = barTop+'px';
    			if(barTop == barHeight) {
    				clearInterval(hideInterval);
    				bar.style.display = 'none';
    			}
  			}, opts.hideSpeed);
		  }
  		
  		if(opts.cookieEnabled){ createCookie(cookieAccepted,1,opts.expireDays); }
  		
  	},false);
  	 	
  	//Apply elements to DOM
  	if(opts.detailsLink) { mainText.appendChild(detailsLink) };
  	bar.appendChild(mainText);
  	if(opts.declineLink) { bar.appendChild(declineLink) };
  	bar.appendChild(acceptLink);
  	document.body.appendChild(bar);	
  	
  	var barHeight = parseInt(getStyle('cookie-bar','height'));
    bar.style.top = -barHeight + 'px';
	}
  else { 
    //User accepted cookie so nothing to do here
    return null;   
  }
  
  //Run!
	window.onload = function() {  
  	//Don't animate bar if screen size is small, i.e tablet/phone  	
  	if(viewportWidth < 64) { 
    	bar.style.top = 0;
    }
  	else {
    	var barTop = parseInt(getStyle('cookie-bar','top'));
  		showInterval = setInterval(function(){	
  				barTop = ++barTop;				
  				bar.style.top = barTop+'px';
  				if(parseInt(bar.style.top) == 0) {
    				clearInterval(showInterval);
  				}
  		},opts.showSpeed);	
    }
	}
})();

/* helpers */
function getStyle(el,styleProp) {
  if(el == 'body') { var x = document.body; }
  else { var x = document.getElementById(el); }
	
	var y;
	if (x.currentStyle) {
  	//hack - IE returns "auto" if element's dimensions were not overtly defined by CSS
		if(styleProp == 'height' && x.currentStyle[styleProp] == 'auto'){
  		y = x.offsetHeight;
		}
		else {
  		y = x.currentStyle[styleProp];
		}
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