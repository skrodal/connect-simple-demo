/**
 * Alle kall til Connect og 3.-parts APIer er definert her.
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
			//oauth: { scopes: { request: ["userinfo userinfo-feide userinfo-mail userinfo-photo"] } },
			dataType: 'json'
		}).pipe(function (data) {
			return data.user;
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
			url: CONNECT_AUTH.config().fc_endpoints.groups,
			//oauth: { scopes: { request: ["groups"] } },
			dataType: 'json'
		}).pipe(function (data) {
			return data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alert(
				"Connect /groups/me/groups", 
				"<p>En feil oppstod i samtale med Connect's endepunkt <code>/groups/me/groups</code>.</p>" + 
				"<p>Kan du gjette hva problemet er? ;)</p>" +
				"<p class='text-muted'>(Svar: Klienten har ikke bedt om tilgang til scope <code>groups</code> i Connect Dashboard)</p>"
				);
		});	
	}
	
	// ------------------- ./ GRUPPER -------------------



	// Tilgjengelige kall
	// Eks: CONNECT.userinfo() for å kalle /userinfo endepunkt
	return {
		userinfo: function() {
			return getUserInfoXHR();
		}, 
		groups: function(){
			return getUserGroupsXHR();
		}
	}

})();
