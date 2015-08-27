/**
 * Alle kall til Connect "CORE" endepunkter (userinfo og groups) er definert her.
 * 
 * Autentisering ble gjort av /js/auth/connect.js og vi kan bruke variabel 
 * CONNECT derfra til å gjøre kall mot Connect endepunkter og APIer. Siden 
 * funksjonene i dette eksempelet gir et asynkront (ajax) svar (XHR) er 
 * kanskje beste måte å fange svarene på slik (med JQuery): 
 * 
 * $.when(CONNECT.userinfo()).done(function(userObj){
 * 		// userObj er data returnert fra Connect
 * });
 *
 * @author Simon Skrødal
 * @since August 2015
 * 
 */

// Slå på JQuery for JSO (forenkler AJAX kall)
JSO.enablejQuery($);


var CONNECT = (function () {

	
	// ------------------- USERINFO -------------------
	
	function getUserInfoXHR() {
		return CONNECT_AUTH.jso().ajax({
			url: CONNECT_AUTH.config().fc_endpoints.userinfo,
			dataType: 'json'
		}).pipe(function (data) {
			console.log("Rådata fra endepunkt /userinfo: ");
			console.log(data);
			return data.user;	// I denne demoen bryr vi oss bare om 'user'-objektet, så vi piper det i XHR-svaret tilbake.
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alert(
				"Connect /userinfo", 
				"<p>En feil oppstod i samtale med Connect's endepunkt <code>/userinfo</code>.</p>" + 
				"<p>Kanskje en reload i nettleseren løser problemet?</p>"
			);
		});
	}
	
	// ------------------- ./USERINFO -------------------


	// ------------------- GRUPPER -------------------
	function getUserGroupsXHR() {
		return CONNECT_AUTH.jso().ajax({
			url: CONNECT_AUTH.config().fc_endpoints.groups + 'me/groups',
			dataType: 'json'
		}).pipe(function (data) {
			return data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alert(
				"Connect /groups/me/groups", 
				"<p>En feil oppstod i samtale med Connect's endepunkt <code>/groups/me/groups</code>.</p>" + 
				"<p class='text-muted'>(Har klienten bedt om tilgang til scope <code>groups</code> i Connect Dashboard?)</p>"
				);
		});	
	}
	
	function getGroupQuery(query) {
		return CONNECT_AUTH.jso().ajax({
			url: CONNECT_AUTH.config().fc_endpoints.groups + query,
			dataType: 'json'
		}).pipe(function (data) {
			return data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alert(
				"Connect /groups/" + query, 
				"<p>En feil oppstod i samtale med Connect's endepunkt <code>/groups/"+query+"</code>.</p>" + 
				"<p class='text-muted'>(Har klienten bedt om tilgang til scope <code>groups</code> i Connect Dashboard?)</p>"
				);
		});	
	}
	
	
	
	// ------------------- ./ GRUPPER -------------------


	// Tilgjengelige kall
	// Eks: CONNECT.userinfo() for å kalle /userinfo endepunkt
	return {
		//
		userinfo: function() {
			return getUserInfoXHR();
		}, 
		// Snarvei for grupper tilgørende pålogget bruker
		groups: function(){
			return getUserGroupsXHR();
		}, 
		// Se http://feideconnect.no/docs/groups/ for alle ruter 
		groupQuery: function(query) {
			return getGroupQuery(query);
		}
	};

})();
