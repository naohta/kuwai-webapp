/**
 * NAAjax2.js by Naohiro OHTA, All Rights Reserved.
 */

var NAAjax2 = function(){

	// --------------------------------------------
	// Private members
	// --------------------------------------------
	var KUWAI_CANDIDATES = ["http://kuwai.elasticbeanstalk.com/", "http://localhost:4567/", "http://kuwai.herokuapp.com/"];
    var KUWAI_Index = 0;
	var KUWAI = KUWAI_CANDIDATES[KUWAI_Index];
	var who = [];
	var http_client_uuid = "not yet initialized";
	$(function(){http_client_uuid=uuid.v4();});
	
	// --------------------------------------------
	// Public members
	// --------------------------------------------
	return{
		ajaxHistory_Req: function(ajax_id, asking){}, // Override me
		ajaxHistory_OK: function(ajax_id){}, // Override me
		ajaxHistory_NoUse: function(ajax_id){}, // Override me
		AJAX_ID: -1,
		AJAX_REQUEST_TIME: [],
		
		set_who: function(email, pw, success_funciton, error_function, ajax_error_function){
			who = [
			    email,
			    CryptoJS.SHA256(email+"kkuwaii"+pw).toString(CryptoJS.enc.HEX),
			    http_client_uuid
			];
			this.ajax(["auth"], 
			    function(result){
    			    if(result == "Authed"){
            			if(success_funciton != null) success_funciton(who[0]);
    			    }else{
            			if(error_function != null) error_function(who[0]);
    			    }
    			}, 
    			ajax_error_function
    		);
		},
		
		ajax: function(method_array, success_funciton, error_function){
			callback_name="pad";
			this.AJAX_ID++; var ajax_id = this.AJAX_ID; this.AJAX_REQUEST_TIME[ajax_id] = new Date();
			this.ajaxHistory_Req(ajax_id, method_array);
			console.log("/--- Ajax Request");console.log(method_array);console.log(who);console.log("---/");
            
            var asking = {"method":method_array, "who":who};
            var asking_json = JSON.stringify(asking);
            var url = KUWAI + "api/" + asking_json.length + "/" + asking_json;
            
			var that = this; $.ajax({
				type:"post",
				url:url,
				dataType:"jsonp",
				success:function(result){
					console.log("/--- Ajax Success");console.log(result);console.log("---/");
					success_funciton(result, ajax_id);
					that.ajaxHistory_OK(ajax_id);
				},
				error:function(error){
					console.log("/--- Ajax Error");console.log(error);console.log("---/");
					error_function(error, ajax_id);
				}
			});
		},
		
        load_page: function(page_name, id){
            if(id==null || id=="") id="content";
            var ELEMENT = $("#"+id);
            NASlide.slide(id, "WAIT");
            $.ajax({
              type:"GET",
              url: "page/" + page_name,
              dataType:"html",
              success:function(result){
                ELEMENT.html(result);
                NASlide.slide("WAIT",id);
              },
              error:function(result){
                console.log("Error: NALoadPage.js - load_page()");
                console.log(result);
                ELEMENT.html("<h3>ページを読みこんでいる際にエラーが起きました。<br>お手数ですが、もう一度操作を試していただけますか？</h3>");
                NASlide.slide("WAIT",id);
              }
            });
        },
        
        list_pages: function(success_function){
            $.ajax({
              type:"GET",
              url: "list_pages",
              dataType:"json",
              success:function(result){
                console.log(result);
                success_function(result);
              },
              error:function(result){
                console.log("Error: NALoadPage.js - list_pages()");
                console.log(result);
                // TODO MUST RETRY, and show error.
              }
            });
        },
        
        kuwai: function(){
            console.log("kuwai_candidates are," + KUWAI_CANDIDATES);
            console.log("Now kuwai is," + KUWAI);
        },
        
        kuwai_switch: function(){
            if(KUWAI_Index >= KUWAI_CANDIDATES.length -1) 
                KUWAI_Index = 0;
            else
                KUWAI_Index++;
            KUWAI = KUWAI_CANDIDATES[KUWAI_Index];
            this.kuwai();
        },
        
        kuwai_set: function(s){
            KUWAI_CANDIDATES.push(s);
        }
	}
}();

NAAjax2.kuwai();

