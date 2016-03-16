/**
 * Konfigurer JSO modul for bruk med denne klienten og start autentiseringsflyt. 
 *
 * Med referanser til DASHBOARD menes https://dashboard.dataporten.no.
 * 
 * 1. Gi denne fila navnet dataporten_auth.js (fjern '-SAMPLE')
 * 2. Registrer en ny klient i DASHBOARD
 * 3. Fyll inn linjene 19-21 med info fra DASHBOARD
 * 
 * @author Simon Skrødal
 * @since August 2015
 */
 
 var CONNECT_AUTH = (function () {
	 
	 var CONFIG = 
	 {
		 fc_auth : {
			providerID		: 	"FC-dataporten-simple-demo",	// Valgfritt
			client_id		:	"MÅ FYLLES INN",	// Klient-spesifikk, satt i DASHBOARD
			redirect_uri	: 	"MÅ FYLLES INN",	// Klient-spesifikk, settes i DASHBOARD
			authorization	: 	"https://auth.dataporten.no/oauth/authorization"		// Alltid samme
		 },
		 fc_endpoints :	{
			// For tilgang må klienten ha bedt om dette scopet i Dashboard
			groups: 	"https://groups-api.dataporten.no/groups/",		
			// Base-URL for bildefil 		
			photo: 		"https://auth.dataporten.no/user/media/",					
			// BrukerID, navn og profilbilde. For mer info (eks. epost, Feide-ting) må scopes etterspørres i Dashboard.
			userinfo: 	"https://auth.dataporten.no/userinfo"
		 }, 
		 api_endpoints : {
			// Andre 3.parts-APIer klienten har tilgang til via Dataporten (DASHBOARD) 
			simons_vitser : 'https://simons-vitser.gk.dataporten.no/api/connect-simons-vitser/'
		 }, 
		 links : {
			 client_source	: 'https://github.com/skrodal/connect-simple-demo',
			 api_source 	: 'https://github.com/skrodal/connect-simons-vitser/'
		 }
	 };
	 

	// Sett opp JSO med konfig for denne klienten (DASHBOARD)
	var jso = new JSO({
		providerID		: 	CONFIG.fc_auth.providerID,
		client_id		: 	CONFIG.fc_auth.client_id,
		redirect_uri	: 	CONFIG.fc_auth.redirect_uri,
		authorization	: 	CONFIG.fc_auth.authorization,
		debug			: 	true
	});
	
	// Autentisering. Fanger respons-parametre -- denne bør kalles så tidlig som mulig, før applikasjonen lastes. 
	jso.callback();

	// 
	return {
		jso: function() {
			return jso;				// Eksponer jso'en til resten av klienten
		}, 
		token: function(){
			return jso.getToken(function (token) {
				return token;
			});
		},
		// Dreper sesjonen, inkludert Feide-sesj.
		logout: function(){
			jso.wipeTokens();				
			window.location.replace("https://auth.dataporten.no/logout");
		}, 
		// Slett sesjon - krever ny runde med godkjenning (men slipper Feide-auth på nytt)
		wipeTokens: function(){
			jso.wipeTokens();
		}, 
		config : function (){
			return CONFIG;
		}
	};

})();
