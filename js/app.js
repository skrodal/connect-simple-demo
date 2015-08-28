/**
 * Denne fila tar seg av oppdatering av brukergrensesnitt, 
 * knappetrykk, kall til funksjoner defindert i connect.js, etc. 
 *
 * @author Simon Skrødal
 * @since August 2015
 * 
 */

	// Når hele dokumentet er lastet
	$( document ).ready(function() {
		//  ...HVIS vi har en Connect token
		if(CONNECT_AUTH.token()){
			// Vis modal med velkomstinfo. Kommenter ut om den blir for irriterende.
			showWelcomeMessage();
			// Oppdater grensesnitt med info vi har for hånden
			updateUI();
			// Vis sideinnhold
			$('#mainContent').removeClass('hidden');
		}
	});
	
	function showWelcomeMessage(){
		$('#modal-welcome').modal();
	}
	
	/**
	 * Når bruker er autentisert kan vi oppdatere UIet littegrann.
	 */
	function updateUI(){
		// Synliggjør config variabler fra /js/auth/connect_auth.js
		$('.fc-auth-uri').text(CONNECT_AUTH.config().fc_auth.authorization);
		$('.fc-userinfo-uri').text(CONNECT_AUTH.config().fc_endpoints.userinfo);
		$('.fc-groups-uri').text(CONNECT_AUTH.config().fc_endpoints.groups);
		$('.fc-client-info').text(
			'// Min unike kode:\n' +
			'client_id    : "'+ CONNECT_AUTH.config().fc_auth.client_id +'",\n' +
			'// Hvor jeg bor:\n' +
			'redirect_uri : "'+ CONNECT_AUTH.config().fc_auth.redirect_uri + '"'
		);
		// Kildekode for denne klienten på GitHub
		$('a.client-github-source').attr('href', CONNECT_AUTH.config().links.client_source);
		$('.client-github-source:not(a)').text(CONNECT_AUTH.config().links.client_source);
		
		// Kildekode for vitse-API på GitHub
		$('a.api-github-source').attr('href', CONNECT_AUTH.config().links.api_source);
		$('.api-github-source:not(a)').text(CONNECT_AUTH.config().links.api_source);
	}
	


	// Klikk på denne knappen åpner velkomstdialog og starter serien med vinduer 
	// som henter data fra ulike endepunkt/APIer:
	$('body').on('click', '.btnCallTokenInfo', function() {
		showTutorialWelcomeMessage();
	});
	
	// Flyten er som følger:
	// 
	// 1. Vis vindu med token data
	// 2. Vis vindu med /userinfo data
	// 3. Vis vindu med /groups/me/groups data
	//
	
	// ---------------------- 1. TOKEN -----------------------------------------------------------------
	
	function showTutorialWelcomeMessage(){
		var token = JSON.stringify(CONNECT_AUTH.token(), undefined, 2);
		// UTILS ligger nederst i denne fila
		UTILS.alert(
			'<i class="ion ion-android-boat"></i> Velkommen ombord!', 
			'<p>Jepp, du er tydeligvis autentisert, for <code>Connect</code> har gitt meg en <code>token</code>:</p>' +
			'<pre><code class="language-javascript">' + token + '</code></pre>' + 
			'<p>Alt vel og bra det, men <strong>hva heter du???</strong></p>' +
			'<p>Det kan du si meg om du klikker på knappen nedenfor. Da kaller vi Connect sitt endepunkt <code>/userinfo</code> som vet mer om deg.</p>' +
			'<p>Før du klikker; ta en titt over på hvilke <code>scopes</code> jeg har tilgang til. Kan du gjette hva vi får i svar fra <code>/userinfo</code>?</p>' +
			// MERK: Denne knappen fyrer av et AJAX-kall og blir tatt hånd om i koden umiddelbart nedenfor
			'<p><button class="btn btn-info btnCallUserInfo" data-dismiss=""><i class="ion ion-code-download"></i> /userinfo</button></p>' 
			);
			
			// Vis i kodevindu på forsiden
			$('.fc-token-dump').text(token);
			// ...og gjør kodestyling mer fancy
			Prism.highlightAll();
	}
	
	// ---------------------- ./ TOKEN  -----------------------------------------------------------------
	
		
	
	// ---------------------- 2. USERINFO ---------------------------------------------------------------
	
	// Når knapp i velkomstvindu ble klikket
	$('body').on('click', '.btnCallUserInfo', function() {
		$(this).button('loading');
		callConnectUserInfo();
	});
	
	function callConnectUserInfo(){
		// Kall userinfo og vent på svar:
		$.when(CONNECT.userinfo()).done(function(userObj){
			// Svaret er kommet, vis melding:
			UTILS.alert(
				'<i class="ion ion-android-person"></i> Se der ja ' + userObj.name.split(' ')[0].toUpperCase() + '!',	// Ta (første) fornavn 
				'<p>Nå vet jeg litt mer om deg, eller hva <b>' + userObj.name + '</b> :)</p>' +
				'<div class="text-center"><img class="img-circle fc-user-image"></div>' +
				'<p>Endepunktet <code>/userinfo</code> sendte med følgende: </p>' +
				'<pre><code class="language-javascript">' + JSON.stringify(userObj, undefined, 2) + '</code></pre>' +
				'<p><code>userid</code> er din <strong>unike</strong> og <strong>persistente</strong> ID i Connect-verdenen; ' + 
				'et slags personnummer som kan brukes for å identifisere deg og bare deg.</p>' +  
				'<p>Følgende info fulgte med bare fordi, som jeg nevnte tidligere, jeg fortalte <code>Connect</code> at jeg vil ha tilgang til disse <code>scopes</code>:</p>' +
				'<ul>' +
					'<li>bilde (<code>userinfo-photo</code>)</li>' +
					'<li>epostadresse (<code>userinfo-mail</code>)</li>' +
					'<li>Feide brukernavn (<code>userinfo-feide</code>)</li>' +
				'</ul>' +
				'<p>Hadde jeg ikke fortalt <code>Connect</code> eksplisitt om tilgang til scopene over ville <code>/userinfo</code> gitt oss kun <code>userid</code> og <code>name</code>. ' + 
				'For noen klienter er det sikkert mer enn nok.</p>' +
				'<p>...men du? Hva med tilhørighet? Hvor kommer du fra og sånn? La oss prøve å kalle et annet innebygd ("core") Connect-endepunkt: <code>/groups/me/groups</code>:</p>' +
				// MERK: Denne knappen fyrer av et AJAX-kall
				'<p><button class="btn btn-info btnCallUserGroups" data-dismiss=""><i class="ion ion-code-download"></i> /groups/me/groups</button></p>' 
			);
			// Dump svaret i konsollen også
			console.log('Her er svaret fra ' + CONNECT_AUTH.config().fc_endpoints.userinfo + ':');
			console.log(userObj);
			// Og oppdater grensesnittet
			updateUserInfoUI(userObj);
		});
	}
	
	// Oppdater alle userinfo-felter i HTML (alle steder i kode med kommentar <!-- USERINFO -->)
	function updateUserInfoUI(userObj){
		// Gjør knappen klikkbar igjen
		$('.btnCallUserInfo').button('reset');
		$('.fc-user-first-name').text(userObj.name.split(' ')[0]);
		$('.fc-user-full-name').text(userObj.name);
		$('.fc-user-image').attr('src', CONNECT_AUTH.config().fc_endpoints.photo + userObj.profilephoto);
		
		// Vis i kodevindu på forsiden
		$('.fc-userinfo-dump').text(JSON.stringify(userObj, undefined, 2));
		// ...og gjør kodestyling mer fancy
		Prism.highlightAll();
	}
	
	// ---------------------- ./USERINFO ------------------------------------------------------------------
	
	
	
	
	
	
	// ---------------------- 3. GROUPS -------------------------------------------------------------------
	
	// Når knapp for /groups klikkes
	$('body').on('click', '.btnCallUserGroups', function() {
		$(this).button('loading');
		callUserGroups();
	});

	function callUserGroups(){
		// Kall userinfo og vent på svar:
		$.when(CONNECT.groups()).done(function(groupsArr){
			// Reset
			$('.fc-group-list').empty();
			// Svaret er kommet, finn navn på alle gruppene:
			var groups = '<ul>';
				$.each(groupsArr, function (index, groupObj){
					$('.fc-group-list').append('<small><span class="text-muted">' + groupObj.displayName + '</span><small><br>');
					groups += '<li><code>' + groupObj.displayName + '</code></li>';
				});
			groups += '</ul>';
			
			$('.fc-group-count').html('<span class="badge bg-aqua">'+groupsArr.length+'</span> grupper');
			
			// Vis meldingsboksen
			UTILS.alert(
				'<i class="ion ion-android-people"></i> Connect har levert varene!',	 
				'<p>...nå vet jeg hvilke grupper du tilhører: ' + groups + '</p>' +
				'<p>Om du studerer svaret nedenfor ser du at vi, gjennom grupper, kan hente ut massevis av informasjon om deg, ' +
				'f.eks. hvor du hører til, om du er ansatt eller student, osv. Hvilke muligheter for bruk i f.eks. tilgangsstyring!</p>' +
				'<pre><code class="language-javascript">' + JSON.stringify(groupsArr, undefined, 2) + '</code></pre>' +  
				'<p></p>' +
				'<p>...jomfruturer er ofte over på kort tid, og denne er intet unntak ;) Nå vil jeg at du lukker dette lille viduet og ' + 
				'scroller videre nedover siden for mer detaljer.</p>' 
			);
			// Dump svaret i konsollen også
			console.log('Her er svaret fra ' + CONNECT_AUTH.config().fc_endpoints.groups + 'me/groups:');
			console.log(groupsArr);
			// Og oppdater grensesnittet
			updateGroupsUI(groupsArr);
		});
	}
	
	function updateGroupsUI(groupsArr){
		// Gjør knappen klikkbar igjen
		$('.btnCallUserGroups').button('reset');
		// Vis i kodevindu på forsiden
		$('.fc-groups-dump').text(JSON.stringify(groupsArr, undefined, 2));
		// ...og gjør kodestyling mer fancy
		Prism.highlightAll();
	}
	
	
	
	// API-endepunktet er lagt inn i HTML data attributt
	$('body').on('click', '.btnCallGroupQuery', function() {
		var query = $(this).attr('data-group-query');
		callGroupQuery(query);
	});
	
	function callGroupQuery(query) {
		$.when(CONNECT.groupQuery(query)).done(function(data){
			console.log('Her er svaret fra ' + CONNECT_AUTH.config().fc_endpoints.groups +  query + ':');
			console.log(data);
			
			var groupMembers = '<ul>';
			$.each(data, function(index, groupMember){
				groupMembers += '<li>' + groupMember.name + '</li>';
			});
			groupMembers += '</ul>';
			UTILS.alert(query, groupMembers);
		});
	}
	
	
	


	// ---------------------- ./GROUPS ----------------------------------------------------------------------
	
	
	
	// ---------------------- JOKES (Vitse-API) ----------------------------------------------------------------------
		
		
	$('.btnGetJoke').on('click', function() {
		var $btn = $(this).button('loading');
        
		// Se jokes.js for kode
		$.when(JOKES.random()).done(function(joke){
			$('#jokeContainer').text(joke);
			$btn.button('reset');
		});
	});	
		
	// ---------------------- JOKES ----------------------------------------------------------------------
		
		
	
	// Når en 'logg ut' lenke/knapp blir trykket
	$('body').on('click', '.fc-logout', function() {
		UTILS.alert('<i class="ion ion-log-out"></i> Logger ut', '<p>Ha det bra - kom snart igjen :)</p>');
		CONNECT_AUTH.logout();	
	});
	
	
	
	
/**
 * Hjelpefunksjoner
 */

var UTILS = (function () {


	// En info-boks som vises ved behov
	// Du finner #alertModal som en skjult <div> i index.html. 
	function alert(title, msg){
		$('#alertModal').find('.modal-title').html(title);	// Tittel
		$('#alertModal').find('.modal-body').html(msg);		// Melding
		$('#alertModal').modal('show');						// Vis!
	}
	
	function image(title, src){
		$('#imageModal').find('.modal-title').html('<i class="ion ion-image"></i> ' + title);	// Tittel
		$('#imageModal').find('.modal-img').attr('src', src);									// Bilde
		$('#imageModal').modal('show');															// Vis!
	}
	
	// Tilgjengelige kall
	// Eks: UTILS.alert('Tittel', '<p>Meldingstekst</p>') 
	return {
		alert: function(title, msg) {
			alert(title, msg);
		},
		image: function(title, src) {
			image(title, src);
		}
	}

})();