 //웹용일땐 true 아닐땐 false
 var webMode = true;
        
 if (typeof module === 'object') {
     window.module = module;
     webMode = false;
     module = undefined;
 
 }