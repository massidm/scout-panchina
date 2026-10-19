# Scout panchina — Volley 2001 Garlasco

Web app per segnare dalla panchina i tocchi della squadra (battuta, ricezione, attacco, muri punto, errori) e avere in tempo reale V−P, cambio palla, break point, rotazioni e tabellino in stile DataVolley. Funziona senza rete dopo la prima apertura.

## Installazione su iPad / iPhone
1. Apri il sito in **Safari** (con rete).
2. Tocca **Condividi → Aggiungi alla schermata Home**.
3. Apri l'app dall'icona sulla Home. Da qui in poi funziona anche in modalità aereo.

I dati restano solo su quel dispositivo, e l'app installata ha una memoria separata da Safari. Esporta il JSON a fine set o a fine partita ("Rosa e partite → Scarica JSON").

## File
- `index.html` — l'app (unico file, motore incluso)
- `sw.js` — copia per l'uso senza rete; cambiare `VERSION` a ogni rilascio
- `manifest.webmanifest`, `icons/` — icona e nome sulla schermata Home
- `fonts/` — Barlow e Barlow Condensed (SIL Open Font License)
