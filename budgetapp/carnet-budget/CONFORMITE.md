# Carnet : dossier de conformité

Dernière mise à jour : 2 octobre 2026.

**Le cas :** appli web gratuite de budget personnel, pour des particuliers. Éditée par un particulier non professionnel, anonyme, établi en France. Hébergée sur **Vercel** (offre Hobby), à l'adresse `carnet-budget-zeta.vercel.app`. Contact : macroapp@outlook.fr. Aucune vente, aucun outil tiers. Données de budget stockées dans le navigateur (`localStorage`) et, pour les utilisateurs qui créent un compte, dans Supabase (région Irlande eu-west-1, une ligne JSON par utilisateur, protégée par RLS). Plus de page d'accueil : `index.html` est directement l'appli, avec l'écran de création de compte.

## Structure du site

| Fichier | Rôle |
|---|---|
| `index.html` | L'application, avec l'écran de compte, les métadonnées et le JSON-LD `WebApplication` |
| `config.js` | Adresse et clé publique « anon » du projet Supabase |
| `sync.js` | Inscription, connexion, mot de passe oublié, synchronisation, suppression de compte |
| `supabase.sql` | Table `budgets`, règles RLS et fonction `delete_my_account` (à exécuter une fois dans Supabase, ne pas mettre en ligne) |
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

## Comptes Supabase (en place depuis le 2 octobre 2026)

- [x] Politique de confidentialité : traitement 4 « Ton compte Carnet » publié (Supabase Pte. Ltd, région Irlande, clauses contractuelles types intégrées au DPA de Supabase).
- [x] CGU : article 6 « Compte utilisateur » publié ; case d'acceptation non pré-cochée à l'inscription (date d'acceptation enregistrée dans le compte).
- [x] Suppression du compte depuis l'appli, export JSON, effacement des données locales à la déconnexion.
- [x] CSP : `connect-src` autorise `https://*.supabase.co`.
- [x] Projet Supabase créé en région Irlande (eu-west-1). - [x] `supabase.sql` exécuté.
- [x] Dans Supabase > Authentication > URL Configuration : Site URL et Redirect URL = `https://carnet-budget-zeta.vercel.app`.
- [x] `config.js` rempli (Project URL + clé publishable). Jamais la clé secrète.
- [ ] Vérifier que RLS est actif sur `budgets` (Table Editor : pas de mention « RLS disabled »).
- [ ] L'envoi d'emails intégré à Supabase est limité à quelques emails par heure : suffisant pour démarrer, à remplacer par un service d'envoi (SMTP) si beaucoup de gens s'inscrivent. Le nommer alors dans la politique de confidentialité.
- [ ] Relecture par un avocat recommandée : des données financières sont désormais stockées sur un serveur.

## Contenu à risque (point 11), non modifié en attendant ta décision

| Passage | Risque | Reformulation proposée |
|---|---|---|
| « Picsou validerait presque. » | Personnage et marque de Disney, utilisés dans une blague d'une appli publique. Le risque est faible, mais le nom appartient à un tiers. | « Même l'oncle le plus radin validerait. » |
| « Picsou pleure dans sa piscine de pièces. » | Même risque. | « Quelque part, un canard milliardaire pleure dans sa piscine de pièces. » |
| « Tu dépenses le PIB de Camille » (alerte au-delà de 725 €) | Si Camille est une personne réelle et reconnaissable, se moquer d'elle publiquement sans son accord peut porter atteinte à sa vie privée. | Rendre le prénom paramétrable par l'utilisateur, ou « Tu dépenses le PIB d'un petit pays ». |
| « Fais gaffe à ton portefeuille, imbécile ! », « Imbécile ! Ce fric… » | Insulte adressée à l'utilisateur. Ce n'est pas illégal, mais certains utilisateurs peuvent la mal prendre. | Garder, et ajouter plus tard un réglage « ton gentil ». Les CGU (article 3) précisent déjà le ton humoristique. |
| « Investis au lieu de dépenser », « Ce billet aurait pu devenir un ETF » | Pourrait être lu comme un conseil en investissement. | Garder : l'article 3 des CGU et la FAQ précisent que ce ne sont pas des conseils. |

Images : aucune image, photo ou logo tiers dans le projet. Les icônes sont des SVG dessinés dans le code.
