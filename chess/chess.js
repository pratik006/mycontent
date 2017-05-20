var authToken;
var ctx = {
	"baseUrl": "http://localhost:8080",
	"chessMsgUri": function() {return this.baseUrl + "/rest/secured/chess"},
	"authtoken": "",
	"toDate": function(val) {
		return new Date(val).toString();
	}
};

$(document).ready(function() {
	$(".login").click(function() {
		var user = new Object();
		user.userName = $("#username").val();
		user.password = $("#password").val();
		$.post({
		  url: ctx.baseUrl + "/rest/login",
		  headers: {"Content-Type": "application/json"},
		  data: JSON.stringify(user),
		  /*dataType: "application/json",*/
		  success: function(response, textStatus, request) {
		  	ctx.authtoken = request.getResponseHeader('x-authtoken');
		  	$.ajax({
	         url: ctx.baseUrl + "/rest/secured/chess",
	         type: "GET",
	         beforeSend: function(xhr) {
	         	xhr.setRequestHeader('Accept', "application/json");
	         	xhr.setRequestHeader('Content-Type', "application/json");
	         	xhr.setRequestHeader('Authorization', "Bearer " + ctx.authtoken);
	         },
	         success: function(messageResponse) {
	         	$(".login-module").hide();
	         	var rows = new Array();
	         	messageResponse.messages.forEach(function(item, index) {
	         		rows.push("<div class=\"row\">"+
					 "<div class=\"col-lg-2\">"+item.msg+"</div>"+
					 "<div class=\"col-lg-2 pull-right\">"+ctx.toDate(item.time)+"</div>"+
					 "<div class=\"col-lg-8 col-md-6\"></div>"+
					"</div>");
	         	});
	         	$(".table").removeClass("hidden");
	         	$(".table").append(rows);
	         }
	      	});
		  }
		});
	});
});