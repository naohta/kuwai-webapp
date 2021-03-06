/**
 * NASlide.js by Naohiro OHTA, All Rights Reserved.
 */

var NASlide = function(){

	// --------------------------------------------
	// Private members
	// --------------------------------------------
    
	// --------------------------------------------
	// Public members
	// --------------------------------------------
	return{
        slide: function(id0,id1,complete){
            if(complete == null)
                var complete = function(){NAKey.setTabstops($("#"+id1));}
            
            if(id0 == "WAIT")
              $("#"+id0).hide();
            else
              $("#"+id0).hide("slide",{direction:"right"},"fast",complete);
            
            if(id1 == "WAIT")
              $("#"+id1).show();
            else
              $("#"+id1).show("slide",{direction:"left"},"normal",complete);
          }
    };
}();

