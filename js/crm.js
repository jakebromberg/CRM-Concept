function getSalesEmailSnippet(msgnumber,partid,mailbox) {
	var query = 'cgi-bin/getEmailSnippet.php?partid={0}'.format(msgnumber);
		
	$.get(query, function(data) {
		$( ".email-view" ).html(data);
	});
}
	
function resizePanels() {
	var panelHeight = $("html").height() - (parseInt($("body").css("margin-top").replace("px", "")) + parseInt($("body").css("margin-bottom").replace("px", "")) + $(".mast").outerHeight() + $(".anchor").outerHeight());
	$("#customer-list").css("height", panelHeight);
	$(".right-panel").css("height", panelHeight);
}

$(function() {
	$( "html" ).ready(function() {
		resizePanels();
		//$( "#search-field" ).focus();
	});

	$( window ).resize(function() {
		resizePanels()
	});
	
	$( "#search-form" ).submit(function() {
		var searchType = $("#search-form option:selected").val();
		var query = $( "#search-field" ).val();
		var url = 'cgi-bin/getCustomer.rst?form:searchtype={0}&form:query={1}'.format(searchType,query);
		
		$.get(url, function(data) { 
				$('#customer-list').html(data);
		});
		
		return false;
	});
	
	$( "body" ).delegate(".customer", "click", function(){
		if ($( ".right-panel" ).css("background-image") != "none")
			$( ".right-panel" ).css("background-image","none");
		
		$( "#customer-list .selected" ).toggleClass("selected");
		$(this).toggleClass("selected");
		
		$.get('./html/right-panel-default.html', function(data) {
			$('.right-panel').html("");
			$('.right-panel').append(data);
		});
		
		var guid = generatePseudoGUID();
		$( ".right-panel" ).attr("id", guid);
		
		var queries = {
			"sales" : 'http://localhost/~jake/CRM/cgi-bin/getSales.php',
			"downloads" : 'cgi-bin/getDownloads.php?email=' + $( this ).children( ".customer-email" ).text(),
			"sales-emails" : 'cgi-bin/getSalesEmails.php?email=' + $( this ).children( ".customer-email" ).text(),
			"support-emails" : 'cgi-bin/getSupportEmails.php?email=' + $( this ).children( ".customer-email" ).text(),
		};
		
		for(var query in queries) {
			console.log(query);$.get(queries[query], function(data, textStatus, jqXHR) {
				var targetedElement = "#" + guid + " " + "#" + jqXHR.getResponseHeader("divId");
				var targetedElementMeter = targetedElement + " .meter";
				var targetedElementContent = targetedElement + " .entity-view-content";
				
				$( targetedElementMeter ).toggle("blind", 500, function(){
					$(this).remove();
				});
				
				$( targetedElementContent ).toggle();
				
				if (data == "") {
					$( targetedElementContent ).html("No " + $( targetedElement + " h2" ).html());
					$( targetedElementContent ).toggleClass("message");
				} else {
					$( targetedElementContent ).html(data);
				}

				$( targetedElementContent ).toggle("blind", 500);
			});

		}
	});
	
	$( ".right-panel" ).delegate(".sales-emails tr", "click", function(){
		$( ".sales-emails .selected" ).toggleClass("selected");
		$( this ).toggleClass("selected");
	});
	
	$( "#search-field, .customer-notes textarea" ).focusout(function() {
		$('#search-field').animate({boxShadow: '0 0 0px #6CC'});
		$(this).css("borderColor","");
	});
	
	$( "#search-field" ).focus(
		function() {
			$(this).animate({borderColor: "#35a5e5"}, 500);
		},
		function() {
			$(this).animate({boxShadow: '0 0 5px rgba(81, 203, 238, 1)'});
		}
	);
	
	$( ".right-panel" ).delegate(".customer-notes textarea", "focus", 
		function() {
			$(this).animate({boxShadow: '0 0 5px rgba(81, 203, 238, 1)'});
		},
		function() {
			$(this).animate({borderColor: "#35a5e5"}, 500);
		}
	);
	
	$( ".right-panel" ).delegate(".customer-notes textarea", "focusout", 
		function() {
			$(this).animate({boxShadow: '0 0 0px #6CC'});
		},
		function() {
			$(this).css("borderColor","");
		}
	);
	
	$( ".right-panel" ).delegate(".entity-view h2", "click", function() {
		var element = $(this);
		
		if(element.hasClass("minimized")) {
			element.next().toggle( "blind", { }, 500)
			element.toggleClass("minimized");

		} else {
			element.next().toggle( "blind", { }, 500, function(){
				element.toggleClass("minimized");
			});
		}
		
		return false;
	});
	
	$( ".customer-notes textarea" ).keyup( function(){
		$(".actions button").removeAttr("disabled");
	});
});