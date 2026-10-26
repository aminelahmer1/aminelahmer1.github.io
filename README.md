# Portfolio — Mohamed Amine Lahmer

Site statique (HTML / CSS / JS), hébergé sur GitHub Pages : https://aminelahmer1.github.io

## Mise en ligne
1. Dans le dépôt `aminelahmer1.github.io`, remplace `index.html`, `style.css`, `script.js` par ces fichiers.
2. Dans `assets/`, ajoute `CV_Mohamed_Amine_Lahmer_FR.pdf` et `CV_Mohamed_Amine_Lahmer_EN.pdf`
   et supprime l'ancien `CV_Mohamed_Amine_Lahmer.pdf`. Garde `portrait.jpg`.
3. Supprime `README.txt` (remplacé par ce fichier).

## Formulaire de contact
Deux services possibles, le site choisit automatiquement :

1. **Web3Forms (recommandé, rapide)** : va sur https://web3forms.com, entre medaminelahmer@hotmail.com,
   tu reçois une « Access Key » par e-mail. Colle-la dans `script.js` à la place de `COLLE-TA-CLE-ICI`
   (ligne `const WEB3FORMS_KEY = ...`). C'est tout.
2. **FormSubmit (utilisé tant qu'il n'y a pas de clé Web3Forms)** : ouvre l'e-mail « Activate Form » de
   FormSubmit et clique sur le lien. Ça marche, mais l'envoi peut prendre jusqu'à une minute.

## Modifier le contenu
- Texte français : dans `index.html`.
- Texte anglais : dans l'objet `EN` au début de `script.js` (mêmes clés `data-i18n`).
