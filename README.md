# Connect Simple Demo

Dette er en liten klient som demonstrerer bruk av UNINETT ~~Connect~~ Dataporten sin tjenesteplattform. 

For autentisering benyttes Andreas Solberg sin JSO – OAuth 2.0 Klient - https://github.com/andreassolberg/jso

For å sette opp denne klienten på egen webtjener, gjerne localhost, gjør som følger:

1. Last ned klienten fra GitHub
2. Fjern '-SAMPLE' fra filnavn 'connect-simple-demo/js/auth/connect_auth-SAMPLE.js'
3. Registrer en ny klient i Connect DASHBOARD
4. Fyll inn inn config: providerID, client_id, redirect_uri i connect_auth.js 
 
* Med referanser til DASHBOARD menes https://dashboard.dataporten.no.

![Preview](/images/UNINETT_Connect_Demo.png)

## Annet ##

Utviklet av Simon Skrødal for UNINETT