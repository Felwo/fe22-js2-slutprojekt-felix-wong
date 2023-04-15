# fe22-js2-sp-felix-wong
Social media

Detta är ett socialt medieplattform som är skrivet i Typescript. Det är ett slutprojekt för kursen JavaScript 2 på Grit Academy. Jag har använt Parcel som en bundler för att paketera koden.

Man kan registrera sig som en ny användare eller logga in med ett befintligt konto. Inloggningen är inte säker, eftersom både användarnamn och "lösenord" jämförs med en databas i Firebase som lagrar information om alla användare som är inte encrpted. Men den har en check lista om username finns redan på firebase, så kan man inte registrera sig. Utan man måste använda ett annat username. 

När man är inloggad kan man se ett dashboard med alla användares statusar, sorterade efter datum. Man kan också se en lista på alla användare och besöka deras profiler. På sin egen profil kan man lägga till nya statusar och radera sitt konto.
