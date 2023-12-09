function isMobile(){
    const  mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile'];	
     for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i]) > 0) return true;
     return false;
 }
 
 if(isMobile()){
     window.location.replace('mobile.html')
 }else{
    window.location.replace('main.html')
 }

 export {}