# biscalchin.github.io — CV multilingue di Alberto Biscalchin

Sito CV statico (HTML + CSS + JavaScript, nessun build step, nessuna dipendenza
esterna) pubblicabile direttamente su GitHub Pages.

## Lingue

- L'**inglese è la lingua predefinita**. `index.html` contiene il testo inglese
  statico ed è ciò che si vede alla prima visita, qualunque sia la lingua del
  browser. Con JavaScript disattivato il CV inglese resta leggibile e
  navigabile.
- Le lingue supportate sono inglese (`en`), italiano (`it`), danese (`da`),
  norvegese bokmål (`nb`) e svedese (`sv`).
- Il dizionario unico è `i18n.js` (`window.SITE_I18N`): metadati per lingua in
  `locales` e stringhe in `strings`. `script.js` applica la lingua scelta
  aggiornando testo, attributo `lang`, `title`, meta description, `og:*` ed
  etichette accessibili (`aria-label`, `alt`).
- Una scelta esplicita dell'utente viene ricordata in `localStorage` con la
  chiave `ab-site-locale`. La lingua del browser non viene mai usata per
  indovinare: si parte sempre dall'inglese. Se `localStorage` non è
  disponibile (modalità privata, storage bloccato) il sito funziona comunque e
  la scelta vale solo per la sessione corrente.
- Il selettore in header usa bandiere SVG locali in `assets/flags/`
  (`gb`, `it`, `da`, `nb`, `sv`): nessuna emoji, nessun servizio esterno,
  nessuna dipendenza di rete.

### Modificare i testi

1. Modifica il valore nel dizionario `i18n.js` per la lingua desiderata (chiavi
   piatte con punto, per esempio `profile.lead`).
2. La versione inglese deve restare allineata al testo statico scritto in
   `index.html`: gli elementi con `data-i18n="chiave"` vengono confrontati con
   il pacchetto `en` dal controllo statico (vedi «Verifiche»).
3. Nei testi si usano solo `data-i18n` (testo semplice) e `data-i18n-html`
   (markup fidato definito nel dizionario locale). Nessun valore proviene da
   URL o da storage, quindi non esiste superficie di iniezione.

### Aggiungere una lingua

1. Copia un pacchetto dentro `strings` e traduci tutti i valori mantenendo le
   stesse chiavi.
2. Aggiungi una voce in `locales` (nome nativo, codice `htmlLang`, file
   bandiera) e il relativo SVG in `assets/flags/`.
3. Aggiungi il codice a `supported` in `i18n.js` e un'opzione con lo stesso
   `data-locale` nel menu di `index.html` (altrimenti resta il fallback
   inglese).

## Anteprima locale

Il sito non richiede compilazione: aprire `index.html` funziona già, ma per
un'anteprima fedele (percorsi relativi, `download` del PDF, font di sistema)
conviene servirlo via HTTP.

Con Python (bundled nel runtime di Codex):

```powershell
& "C:/Users/alber/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe" -m http.server 8080 --bind 127.0.0.1
```

Poi aprire <http://127.0.0.1:8080/>.

Alternative: `python -m http.server 8080`, `npx live-server`, oppure
l'estensione Live Server di VS Code.

## Struttura

| Percorso | Contenuto |
| --- | --- |
| `index.html` | Contenuto semantico **in inglese** (baseline statica), una pagina, nove sezioni numerate, con gli agganci `data-i18n` |
| `i18n.js` | Dizionario delle cinque lingue e metadati dei locale (nessun servizio esterno) |
| `styles.css` | Design system editoriale: ivory + inchiostro, accento bordeaux, responsive 360→1440 px, selettore lingua |
| `script.js` | Miglioramenti progressivi: cambio lingua, menu mobile, reveal allo scroll, scroll-spy, anno nel footer |
| `assets/flags/` | Bandiere SVG di Regno Unito, Italia, Danimarca, Norvegia, Svezia |
| `assets/portrait-1000.jpg`, `assets/portrait-640.jpg` | Ritratto ottimizzato (originale non modificato) |
| `assets/Alberto_Biscalchin_CV_General.pdf` | CV scaricabile; è l'unico PDF usato da tutti i link di download |
| `assets/favicon.svg` | Monogramma AB |
| `work/` | Note di lavoro, controlli e screenshot — **escluso dal deployment** (`.gitignore`) |

## Contenuti

I testi derivano dal CV PDF (fonte autorevole). Le traduzioni mantengono dati
fattuali, titoli delle pubblicazioni, DOI, nomi propri, nomi dei corsi e dei
titoli di studio; i titoli di ruolo (per esempio «Research Assistant») e i nomi
delle istituzioni restano in inglese o nella forma ufficiale. Nessun dato è
inventato: la provenienza di ogni voce e i conflitti risolti sono documentati
in `work/source-cv-extraction.md`. Indirizzo di residenza, data di nascita,
telefono e recapiti di terzi non compaiono nella pagina; restano nel PDF
scaricabile.

## Verifiche

Node e Python sono quelli inclusi nel runtime di Codex; adatta i percorsi se usi
un'altra installazione.

- Sintassi JS:
  `& "C:/Users/alber/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe" --check script.js`
  (e allo stesso modo `i18n.js`).
- Controllo statico del dizionario e della baseline inglese (nessun browser):
  `node work/checks/i18n-static-check.cjs`
  Copre: stesse chiavi nei cinque locale, nessun valore vuoto, nessun carattere
  doppiamente codificato, bandiere presenti, baseline `en` in `index.html`
  allineata al dizionario, metadati statici coerenti, assenza di testo italiano
  residuo nell'HTML.
- Controllo nel browser (Playwright + Chrome di sistema), con il sito servito
  via HTTP:
  `node work/checks/languages-check.cjs`
  L'URL di base si imposta con la variabile d'ambiente `SITE_URL`
  (default `http://127.0.0.1:8765/`).
  Copre: prima visita in inglese anche con browser `it-IT`; applicazione di
  tutte e cinque le lingue a intestazioni, corpo, navigazione, `lang`, `title`,
  meta e etichette accessibili; persistenza della scelta al reload; storage non
  disponibile; uso da tastiera del menu lingua; funzionamento di menu, reveal e
  `prefers-reduced-motion` dopo il cambio lingua; PDF unico con integrità byte;
  overflow orizzontale e errori a 360 / 390 / 768 / 1440 px; resa senza
  JavaScript.
- Screenshot e risultati JSON: `work/screenshots/`
  (`languages-*.png`, `languages-check-results.json`, `i18n-static-results.json`).
- Limite noto: la verifica visiva richiede Chrome in
  `C:/Program Files/Google/Chrome/Application/chrome.exe`; il browser Playwright
  non è incluso nel runtime e non viene scaricato. Non viene eseguito alcun
  test su Firefox o Safari.

## Pubblicazione

Il repository è il sito utente GitHub Pages (`biscalchin.github.io`): il push sul
branch predefinito pubblica `index.html` dalla radice. Nessun build, nessun
segreto, nessuna configurazione extra.
