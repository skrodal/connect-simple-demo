/**
 * Alle kall til 3.parts-API 'Simon's Vitser, via Connect Gatekeeper er definert her.
 * 
 * Tilgang til dette APIet må allerede være etablert i Connect Dashboard for at dette skal virke.
 * 
 * Se kommentarer connect.js for mer info om hvordan vi gjør AJAX-kall med JSO. 
 *
 * @author Simon Skrødal
 * @since August 2015
 * 
 */

// Slå på JQuery for JSO (forenkler AJAX kall)
JSO.enablejQuery($);


var JOKES = (function () {

	
	// ------------------- USERINFO -------------------
	
	function getRandomJokeXHR() {
		return CONNECT_AUTH.jso().ajax({
			url: CONNECT_AUTH.config().api_endpoints.simons_vitser,
			dataType: 'json'
		}).pipe(function (data) {
			console.log("Rådata fra Simon's Vitser API: ");
			console.log(data);
			return data.vits;	// Vi er interesserte i vitsen, så vi piper den i XHR-svaret tilbake.
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alert(
				"Simon's Vitser", 
				"<p>En feil oppstod i samtale med API <code>Simon's Vitser</code>.</p>" + 
				"<p>Kanskje en reload i nettleseren løser problemet?</p>"
			);
		});
	}
	
	// ------------------- ./ GRUPPER -------------------




	// Tilgjengelige kall
	// Eks: JOKES.random() for å kalle 'Simons Vitser' API
	return {
		random : function(){
			return getRandomJokeXHR();
		}
	}

})();
