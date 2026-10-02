# Carnet : dossier de conformité

Dernière mise à jour : 2 octobre 2026.

**Le cas :** appli web gratuite de budget personnel, pour des particuliers. Éditée par un particulier non professionnel, anonyme, établi en France. Hébergée sur **Vercel** (offre Hobby), à l'adresse `carnet-budget-zeta.vercel.app`. Contact : macroapp@outlook.fr. Aucune vente, aucun outil tiers. Données de budget stockées dans le navigateur (`localStorage`). Comptes Supabase prévus mais **pas encore codés**.

## Structure du site

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil statique, lisible sans JavaScript (agents IA et moteurs), avec JSON-LD `WebApplication` et `FAQPage` |
| `app.html` | L'application (issue du prototype `budget.html`) |
| `mentions-legales.html` | Mentions LCEN, éditeur anonyme et hébergeur Vercel |
| `confidentialite.html` | Politique de confidentialité, avec la section `#cookies` |
| `cgu.html` | Conditions d'utilisation |
| `assets/site.css`, `assets/fonts.css` | Styles des pages statiques et polices auto-hébergées |
| `robots.txt`, `sitemap.xml`, `llms.txt` | Robots, plan du site, description pour les IA |
| `vercel.json` | En-têtes de sécurité |

## Déjà rempli

- Hébergeur : Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723. Téléphone +1 559 288 7060, repris de la page officielle de Vercel pour les réclamations de droits d'auteur (vercel.com/legal/dmca-policy).
- Contact : macroapp@outlook.fr (messagerie Microsoft Outlook.com). C'est la même adresse que l'appli macros, ce qui ne pose pas de problème : même éditeur.
- Conservation des journaux : consultables 1 heure sur l'offre Hobby (documentation Vercel « Runtime Logs »).
- Date de mise en ligne : 1er octobre 2026.

## À FAIRE PAR UN HUMAIN

1. **Identité chez Vercel.** Tes nom, prénom et adresse doivent être exacts dans ton compte Vercel : c'est la condition de l'anonymat prévue par l'article 1-1, II de la LCEN.
2. **Nom du projet.** Le projet Vercel s.appelle `carnet-budget` et son adresse est `carnet-budget-zeta.vercel.app` (`carnet-budget.vercel.app` était déjà pris).
3. **Lire la boîte macroapp@outlook.fr.** Une demande RGPD doit recevoir une réponse sous un mois.
4. **Polices (facultatif).** Télécharge Nunito et Fredoka depuis Google Fonts (licence OFL) et dépose-les dans `assets/fonts/` sous les noms `nunito-latin-variable.woff2` et `fredoka-latin-variable.woff2`. Sans elles, la police arrondie du système est utilisée.
5. **Camille.** Si c'est une vraie personne, demande-lui son accord ou rends le prénom paramétrable (voir « Contenu à risque »).
6. **Relecture juridique.** Elle n'est pas indispensable aujourd'hui. Elle le devient **avant d'ouvrir les comptes**.

## Le jour où tu ajoutes les comptes Supabase

- [ ] Choisir une **région UE** (Paris `eu-west-3` ou Francfort `eu-central-1`) et signer le **DPA** de Supabase.
- [ ] Vérifier dans le DPA la garantie de transfert (certification Data Privacy Framework et/ou clauses contractuelles types). Compléter la section commentée « 4. Ton compte Carnet » de `confidentialite.html`, puis l'activer.
- [ ] Activer l'article « Compte utilisateur » commenté dans `cgu.html` et renuméroter.
- [ ] Mettre à jour `index.html` et `llms.txt` (« sans compte » ne sera plus vrai).
- [ ] Ajouter l'URL Supabase dans `connect-src` de la CSP (`vercel.json`), sinon les requêtes seront bloquées.
- [ ] Activer **Row Level Security** sur toutes les tables (chaque utilisateur ne voit que ses lignes). Ne jamais mettre la clé `service_role` dans le code du navigateur.
- [ ] Laisser Supabase Auth gérer les mots de passe (hachage) ; ne jamais les stocker ailleurs.
- [ ] Ajouter un bouton « Supprimer mon compte » qui efface toutes les données.
- [ ] Case d'acceptation **non pré-cochée** dans le formulaire d'inscription :

```html
<label class="consent">
  <input type="checkbox" id="accept-cgu" required>
  J'ai lu et j'accepte les <a href="cgu.html" target="_blank">conditions d'utilisation</a>.
</label>
<p class="hint">Ton email sert uniquement à te connecter et à synchroniser ton budget.
  <a href="confidentialite.html">Politique de confidentialité</a></p>
```

## Contenu à risque (point 11), non modifié en attendant ta décision

| Passage | Risque | Reformulation proposée |
|---|---|---|
| « Picsou validerait presque. » | Personnage et marque de Disney, utilisés dans une blague d'une appli publique. Le risque est faible, mais le nom appartient à un tiers. | « Même l'oncle le plus radin validerait. » |
| « Picsou pleure dans sa piscine de pièces. » | Même risque. | « Quelque part, un canard milliardaire pleure dans sa piscine de pièces. » |
| « Tu dépenses le PIB de Camille » (alerte au-delà de 725 €) | Si Camille est une personne réelle et reconnaissable, se moquer d'elle publiquement sans son accord peut porter atteinte à sa vie privée. | Rendre le prénom paramétrable par l'utilisateur, ou « Tu dépenses le PIB d'un petit pays ». |
| « Fais gaffe à ton portefeuille, imbécile ! », « Imbécile ! Ce fric… » | Insulte adressée à l'utilisateur. Ce n'est pas illégal, mais certains utilisateurs peuvent la mal prendre. | Garder, et ajouter plus tard un réglage « ton gentil ». Les CGU (article 3) précisent déjà le ton humoristique. |
| « Investis au lieu de dépenser », « Ce billet aurait pu devenir un ETF » | Pourrait être lu comme un conseil en investissement. | Garder : l'article 3 des CGU et la FAQ précisent que ce ne sont pas des conseils. |

Images : aucune image, photo ou logo tiers dans le projet. Les icônes sont des SVG dessinés dans le code.
