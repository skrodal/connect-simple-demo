/**
 * Konfigurer JSO modul for bruk med denne klienten og start autentiseringsflyt. 
 *
 * Med referanser til DASHBOARD menes https://dashboard.feideconnect.no.
 */
 
 var CONNECT_AUTH = (function () {
	 
	 var CONFIG = 
	 {
		 fc_auth 		:	{
			providerID		: 	"CONNECT",													// Valgfritt
			client_id		:	"f299e692-473a-4ac1-91c3-7e7872d1548d",						// Klient-spesifikk, satt i DASHBOARD
			redirect_uri	: 	"https://127.0.0.1/sites/FEIDE-CONNECT/simple-demo/",		// Klient-spesifikk, settes i DASHBOARD
			authorization	: 	"https://auth.feideconnect.no/oauth/authorization",			// Alltid samme
		 },
		 fc_endpoints	:	{
			// For tilgang må klienten ha bedt om dette scopet i Dashboard
			groups: 	"https://groups-api.feideconnect.no/groups/me/groups",		
			// Base-URL for bildefil 		
			photo: 		"https://auth.feideconnect.no/user/media/",					
			// BrukerID, navn og profilbilde. For mer info (eks. epost, Feide-ting) må scopes etterspørres i Dashboard.
			userinfo: 	"https://auth.feideconnect.no/userinfo",
		 }, 
		 api_endpoints	:	{
			// Andre 3.parts-APIer klienten har tilgang til via Connect (DASHBOARD) 
			simons_vitser : ''
		 }
	 };
	 

	// Sett opp JSO med konfig for denne klienten (DASHBOARD)
	var jso = new JSO({
		providerID		: 	CONFIG.fc_auth.providerID,
		client_id		: 	CONFIG.fc_auth.client_id,
		redirect_uri	: 	CONFIG.fc_auth.redirect_uri,
		authorization	: 	CONFIG.fc_auth.authorization,
		debug			: 	true
		//scopes: { 
		//	require: 	["userinfo"]
		//},
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
			window.location.replace("https://auth.feideconnect.no/logout");
		}, 
		// Slett sesjon - krever ny runde med godkjenning (men slipper Feide-auth på nytt)
		wipeTokens: function(){
			jso.wipeTokens();
		}, 
		config : function (){
			return CONFIG;
		}
	}

})();



	
	
/*
	scopes: {
		request: ["groups", "userinfo", "userinfo-feide", "userinfo-mail", "userinfo-photo", "gk_mediasiteapi", "gk_mediasiteapi_admin", "gk_ecampus-kind", "gk_ecampus-kind_admin"],
		require: ["groups", "userinfo", "userinfo-feide", "userinfo-mail", "userinfo-photo", "gk_mediasiteapi", "gk_mediasiteapi_admin", "gk_ecampus-kind", "gk_ecampus-kind_admin"]
	},

*/