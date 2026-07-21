export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  description: string;
  defaultTop?: string;
  defaultBottom?: string;
}

export interface MemeText {
  top: string;
  bottom: string;
}

export { MEME_TEMPLATES } from './data/memeTemplates';

export const RANDOM_MEME_TEXTS: MemeText[] = [
  // Travail / Bureau
  { top: "Moi disant oui à un appel de \"5 minutes\"", bottom: "Trois heures plus tard on parle de la vie de quelqu'un" },
  { top: "Moi faisant de grands signes de tête", bottom: "Alors que je n'écoute plus depuis 10 minutes" },
  { top: "Quand tu commences un mail professionnel par :", bottom: "\"Sauf erreur de ma part\" = t'as tort, assume" },
  { top: "\"Je peux te poser une question vite fait ?\"", bottom: "Moi qui prépare mentalement mon CV" },
  { top: "La réunion qui pouvait être un mail", bottom: "Le mail qui pouvait être un message" },
  { top: "Quand quelqu'un répond à un mail de y a 3 mois", bottom: "\"Ah oui cette personne existe encore\"" },
  { top: "Moi au premier jour de boulot après les vacances", bottom: "\"Bon, qui a tout cassé pendant mon absence ?\"" },
  { top: "POV: Vendredi 16h vs Lundi 9h", bottom: "Le glow up à l'envers" },
  { top: "Quand ta collègue a passé 2h à te parler de son chat", bottom: "Tu connais son arbre généalogique maintenant" },
  { top: "Le fameux \"je pars dans 5 minutes\" du collègue", bottom: "30 minutes plus tard il est toujours là" },
  { top: "Quand tu te prépares pour un appel Teams", bottom: "Short de nuit, chemise repassée" },
  { top: "Moi en entretien : \"Je suis très organisé\"", bottom: "Mon bureau avec 47 post-its qui disent oui" },
  { top: "Quand le boss dit \"on va faire du brainstorming\"", bottom: "Aka on va parler 2h pour au final rien changer" },
  { top: "Moi après une semaine de taf", bottom: "J'ai besoin de vacances pour me remettre de mes vacances" },

  // Santé / Âge
  { top: "Quand tu te lèves et que ton dos craque", bottom: "T'as 30 ans mais t'as l'articulation d'un vieux grille-pain" },
  { top: "Moi à 20 ans : une nuit blanche et hop", bottom: "Moi à 30 ans : 23h c'est déjà trop tard" },
  { top: "Quand tu te couches à 22h un samedi soir", bottom: "Le plaisir coupable du trentenaire épanoui" },
  { top: "Moi et mon mal de dos mystérieux", bottom: "Je me suis juste penché pour lacer mes chaussures" },
  { top: "Quand tu te mets à calculer ton âge", bottom: "Le chiffre obtenu te donne envie d'acheter de la tisane" },
  { top: "Moi après une soirée arrosée", bottom: "Plus jamais... Jusqu'à la prochaine fois" },
  { top: "Quand tu réalises que ta musique préférée", bottom: "Est considérée comme \"vieux son\" par les jeunes" },
  { top: "Moi le lendemain d'un déménagement", bottom: "Je pourrais jouer dans Walking Dead sans maquillage" },
  { top: "Quand tu prends soudainement conscience", bottom: "Que les jeux de ton enfance ont 25 ans" },
  { top: "Moi après avoir fait un faux mouvement", bottom: "Je m'assois et j'attends que ça passe" },
  { top: "Le check-up chez le médecin", bottom: "\"Vous avez 30 ans mais le corps d'un quadra stressé\"" },
  { top: "Quand tu vois les premières rides", bottom: "\"C'est pas une ride, c'est un trait de caractère\"" },

  // Sommeil / Énergie
  { top: "Quand tu te réveilles 5 minutes avant le réveil", bottom: "La trahison ultime de ton propre corps" },
  { top: "Moi à 7h du matin faisant un calcul mental", bottom: "Puis-je me rendormir 12 minutes ?" },
  { top: "\"Je vais me coucher tôt ce soir, promis\"", bottom: "4h du matin à regarder comment fabriquer une cabane" },
  { top: "Quand ton alarme sonne le lundi matin", bottom: "Tu regrettes d'avoir signé ce CDI" },
  { top: "Moi après une nuit de 7h", bottom: "\"J'ai super bien dormi\" = j'ai survécu" },
  { top: "Quand tu as trouvé LA position de sommeil parfaite", bottom: "Et que ton corps décide que tu dois boire" },
  { top: "Ma jauge d'énergie le matin", bottom: "10% et c'est juste parce que j'ai bu un café" },
  { top: "POV: Lundi matin dans l'open space", bottom: "Tout le monde simule la vie" },
  { top: "Quand tu te réveilles en panique certains du retard", bottom: "Puis tu réalises qu'on est dimanche" },
  { top: "\"Je vais lire un chapitre pour m'endormir\"", bottom: "Le soleil se lève, j'ai fini la trilogie" },
  { top: "Moi calculant combien d'heures de sommeil", bottom: "Si je dors 6h au lieu de 8h depuis 5 ans..." },
  { top: "Quand tu passes devant ton miroir à 3h du matin", bottom: "Tu te juges sévèrement sur ta posture" },

  // Vie sociale / Amitié
  { top: "\"On se fait une bouffe bientôt !\"", bottom: "Prochaine fois qu'on se voit : les calendes grecques" },
  { top: "Le groupe WhatsApp avec les potes du lycée", bottom: "Personne n'a parlé depuis 3 ans sauf pour les voeux" },
  { top: "Quand tu invites tes amis à un truc", bottom: "16 personnes voient le message, 0 répondent" },
  { top: "Moi et mes potes à 20 vs à 30 ans", bottom: "On se voyait tous les jours / On s'écrit une fois par semestre" },
  { top: "Le pote qui dit non à tout", bottom: "Mais qui pleure de pas être invité sur les stories" },
  { top: "Quand tu organises quelque chose pour juin", bottom: "Il faut checker les agendas de 12 personnes" },
  { top: "\"Faut absolument qu'on se voie cette semaine\"", bottom: "Dit-on depuis 4 mois sans rien faire" },
  { top: "Moi quand je croise quelqu'un dans la rue", bottom: "Je fais semblant de regarder mon téléphone" },
  { top: "Quand tes potes commencent à faire des enfants", bottom: "Le groupe passe de soirées à changes" },
  { top: "POV: Tu veux organiser un anniversaire surprise", bottom: "Le groupe secret a plus d'échanges que le vrai" },

  // Dating / Relations
  { top: "Quand tu matche sur une app de rencontre", bottom: "\"Salut ça va ?\" - sommet de l'originalité" },
  { top: "Moi expliquant ma situationship à mes potes", bottom: "Moi-même je comprends plus qui je suis" },
  { top: "\"Alors, t'as quelqu'un en ce moment ?\"", bottom: "La question préférée de toute ma famille" },
  { top: "Moi en date : \"Je suis très spontané\"", bottom: "J'ai préparé 14 sujets de conversation à l'avance" },
  { top: "Quand le date dit \"on verra où ça mène\"", bottom: "Ça va mener nulle part et on le sait" },
  { top: "Moi sur les réseaux: vie parfaite et voyag", bottom: "Moi dans la vraie vie : pâtes au beurre et fatigue" },
  { top: "Le fameux \"c'est pas toi c'est moi\"", bottom: "Spoiler : c'était toi" },
  { top: "Quand tu recroises ton ex par hasard", bottom: "Tu fais semblant d'être super occupé sur ton tél" },
  { top: "Moi en mode célibataire épanoui", bottom: "Qui pleure devant un film romantique à 23h un samedi" },
  { top: "Quand quelqu'un te dit \"j'ai trouvé quelqu'un\"", bottom: "Moi : trop content pour lui // aussi un peu jaloux" },
  { top: "POV: Tu matches avec quelqu'un de prometteur", bottom: "Il/elle ne répond plus depuis 3 jours" },
  { top: "Moi faisant la liste de mes critères", bottom: "Spoiler : je finis avec l'exact opposé" },

  // Argent
  { top: "Quand je regarde mon compte le 15 du mois", bottom: "Déjà dans le rouge, mais il reste 15 jours" },
  { top: "Moi devant mes finances perso", bottom: "\"C'est pas grave, je me rembourse le mois prochain\"" },
  { top: "Quand tu reçois ton salaire", bottom: "Et que tout part en factures en 48h chrono" },
  { top: "Moi parlant de mon épargne", bottom: "Mon livret A pleure dans un coin depuis 3 ans" },
  { top: "\"Cette semaine je gère mes dépenses\"", bottom: "Jour 1 : j'ai déjà dépensé la moitié du budget" },
  { top: "Quand tu retrouves 20€ dans un vieux manteau", bottom: "Je suis officiellement milliardaire" },
  { top: "Moi calculant si je peux me faire un resto", bottom: "Spoiler : non, mais je le fais quand même" },
  { top: "Le loyer vs mon salaire", bottom: "Meme de Spiderman qui se pointe du doigt" },
  { top: "Quand tes parents disent \"mets de côté\"", bottom: "Moi qui mets de côté pour un café à 6€50" },
  { top: "La carte bleue refusée au moment de payer", bottom: "\"Attends je change de carte, c'est un bug\"" },

  // Réseaux / Numérique
  { top: "Je regarde une vidéo de 5 minutes", bottom: "2h plus tard : je regarde l'historique d'un random" },
  { top: "Quand tu ouvres TikTok pour \"5 minutes\"", bottom: "Ton forfait data a pris feu" },
  { top: "Les stories VS la vraie vie", bottom: "Le décalage est tellement grand" },
  { top: "Quand tu scrolles Instagram 2h sans t'en rendre compte", bottom: "\"Mais j'ai rien vu d'intéressant pourtant\"" },
  { top: "Moi quand quelqu'un met un avis google", bottom: "Je prends ça personnellement" },
  { top: "Quand tu perds tes écouteurs quelque part", bottom: "Tu dois subir les bruits du monde réel" },
  { top: "Les cookies \"Tout accepter\" à toute vitesse", bottom: "De peur de rater l'article du siècle" },
  { top: "Moi devant \"Mot de passe oublié\"", bottom: "Nouveau mdp différent de l'ancien. Mais lequel ?" },
  { top: "La connexion Wi-Fi qui coupe 30 secondes", bottom: "Moi face au vide intersidéral" },
  { top: "Quand tu as 47 onglets ouverts", bottom: "Et qu'une pub surgit sans que tu trouves où" },
  { top: "Moi lisant les conditions d'utilisation", bottom: "Non, je mens, j'ai coché tout en 0.2 secondes" },
  { top: "POV: Tu passes ta soirée à scroller", bottom: "\"J'ai rien à faire\" - 2h plus tard toujours sur le téléphone" },

  // Sport / Motivation
  { top: "Moi essayant de reprendre le sport", bottom: "J'ai couru après le bus, ça compte" },
  { top: "L'abonnement à la salle payé en janvier", bottom: "Janvier : 3 visites. Février : 0. Mars : on en parle pas" },
  { top: "POV: C'est l'heure du sport", bottom: "Mon canapé : \"reste avec moi\"" },
  { top: "Moi quand le médecin dit \"faites du sport\"", bottom: "J'ai mal au dos juste en y pensant" },
  { top: "Moi qui jure que cette année je deviens sportif", bottom: "14 janvier : j'ai changé ma photo de profil Strava" },
  { top: "Quand tu fais 10 min de sport", bottom: "Tu postes une story \"séance faite 🔥\"" },
  { top: "Quand tu t'achètes une tenue de sport", bottom: "Pour qu'elle prenne la poussière dans le placard" },
  { top: "Le fameux \"je commence lundi\"", bottom: "Lundi : il pleut. On verra mardi." },

  // Nourriture / Apéro
  { top: "Quand tu ouvres le frigo pour la 5e fois", bottom: "En espérant qu'un plat soit apparu par magie" },
  { top: "Moi après le repas chez ma grand-mère", bottom: "J'ai besoin d'un transpalette pour bouger" },
  { top: "Quand tu tentes une recette sophistiquée", bottom: "Le résultat ressemble à un accident nucléaire" },
  { top: "L'apéro qui commence à 18h", bottom: "23h : on commande des pizzas et on refait le monde" },
  { top: "\"Juste une bière\" entre potes", bottom: "6 bières plus tard : on parle de nos existences" },
  { top: "Moi devant un plat épicé \"moyen\"", bottom: "Mes papilles demandent l'asile politique" },
  { top: "Quand tu cuisines pour impressionner quelqu'un", bottom: "Le résultat : on commande Uber Eats" },
  { top: "Moi sans faire les courses de la semaine", bottom: "Pâtes au beurre, j'maintiens" },

  // Administration
  { top: "\"Il faut que j'appelle la CAF\"", bottom: "J'ai repoussé l'appel depuis 2 mois" },
  { top: "Quand tu dois remplir un formulaire administratif", bottom: "Tu sors littéralement de ta zone de confort" },
  { top: "Moi déclarant mes impôts", bottom: "\"Je suis célibataire sans enfant, c'est vite fait\"" },
  { top: "Le site CAF qui plante", bottom: "Comme d'habitude. Et demain aussi." },
  { top: "Quand tu dois envoyer un recommandé", bottom: "Je crois que je vais laisser tomber en fait" },
  { top: "Moi chez le notaire / banque", bottom: "Je fais oui de la tête sans rien comprendre" },
  { top: "POV: Tu dois faire refaire ta carte d'identité", bottom: "Rendez-vous dans 4 mois, prenez un café" },
  { top: "\"Vous avez reçu votre remboursement ?\"", bottom: "Je l'attends depuis la crise des subprimes" },

  // Nostalgie / Temps qui passe
  { top: "Quand tu réalises que ta chanson préférée", bottom: "Est diffusée sur les radios \"gold\"" },
  { top: "Moi regardant une vieille photo de moi", bottom: "\"Qui m'a laissé sortir avec cette tête ?\"" },
  { top: "Quand tu croises ton prof dans la rue", bottom: "\"Attends, ils ont une vraie vie ?\"" },
  { top: "Le temps qui passe entre potes", bottom: "On se voit plus mais on s'aime toujours" },
  { top: "Moi expliquant les années 2000 à un ado", bottom: "\"Oui on survivait sans écran tactile\"" },
  { top: "Quand tu réalises que Noël arrive", bottom: "T'as toujours pas acheté un seul cadeau" },
  { top: "Moi qui croyais être adulte à 25 ans", bottom: "À 30 ans : je sais toujours pas ce que je fais" },

  // Couple / Famille / Parents
  { top: "\"Alors c'est pour quand le mariage ?\"", bottom: "Moi à chaque repas de famille : sourire et silence" },
  { top: "Quand tes parents apprennent à utiliser l'ordi", bottom: "\"Fais-moi une capture d'écran\" : 45 minutes" },
  { top: "Moi expliquant ce que je fais dans la vie", bottom: "À mes grands-parents : c'est compliqué" },
  { top: "Le week-end chez les beaux-parents", bottom: "Moi simulant un intérêt pour le jardinage" },
  { top: "Quand ta mère t'envoie un tuto TikTok", bottom: "\"Regarde c'est drôle\" - non" },
  { top: "POV: La photo de famille", bottom: "Toujours quelqu'un qui ferme les yeux" },
  { top: "Quand ton partenaire ronfle", bottom: "Tu te demandes si le voisinage entend aussi" },
  { top: "Moi faisant les courses en couple", bottom: "On entre pour du lait, on ressort avec une plante" },

  // Logement / Quotidien
  { top: "\"Je vais ranger demain\"", bottom: "J'ai dit ça y a 3 semaines" },
  { top: "Moi et ma plante verte", bottom: "Elle est en soins intensifs depuis le premier jour" },
  { top: "Quand tu t'achètes un meuble chez Ikea", bottom: "La notice dit \"simple\". La notice ment." },
  { top: "Le linge à plier qui s'accumule", bottom: "La montagne du désespoir dans un coin de la chambre" },
  { top: "Moi cherchant mes clés", bottom: "Elles sont dans ma main depuis 10 minutes" },
  { top: "Quand tu marches sur un Lego pied nu", bottom: "La douleur indicible que même la science ne comprend pas" },
  { top: "Moi et mon sens de l'orientation", bottom: "Perdu dans un parking. Les secours arrivent." },
  { top: "Quand tu perds ton téléphone dans ton appart", bottom: "Tu l'appelles avec... ton téléphone" },

  // Phobies / Paniques légères
  { top: "Quand ton téléphone n'est plus dans ta poche", bottom: "Pacifique. Panique. Tout va bien. PANIQUE." },
  { top: "Le moment où tu réalises que ton micro était ouvert", bottom: "47 personnes ont entendu ton monologue" },
  { top: "Quand tu t'étouffes avec ta salive", bottom: "Tu fais comme si de rien n'était en devenant violet" },
  { top: "Moi au moment de prendre la parole en réunion", bottom: "Ma voix fait un octet aléatoire" },
  { top: "Quand ton téléphone tombe face contre terre", bottom: "Le ralenti le plus long de ta vie" },
  { top: "POV: Tu croises quelqu'un que tu connais", bottom: "\"Salut... ça... va... ?\" - tout l'art de la conversation" },
  { top: "Quand un collègue veut faire une manip sur ton pc", bottom: "Tu regardes sa main s'approcher du clavier" },
  { top: "Moi devant expliquer une blague qui n'a fait rire personne", bottom: "Je m'enfonce, je le sais, mais je continue" },

  // Saisons / Vie courante
  { top: "Le samedi et dimanche : 4 secondes", bottom: "Le mardi après-midi : une éternité" },
  { top: "Quand tu viens de finir une série", bottom: "Le vide existentiel du lendemain" },
  { top: "Moi guettant mon colis à la fenêtre", bottom: "Le moindre bruit de moteur = frisson" },
  { top: "Quand le serveur dit \"bon appétit\"", bottom: "\"Merci vous aussi\" - je sors de moi-même" },
  { top: "Quand tu te prépares mentalement", bottom: "À appeler le service client" },
  { top: "Moi qui devais faire une chose importante", bottom: "J'ai regardé 4 heures de quiz débile à la place" },
  { top: "POV: Tu fais tes valilles la veille du départ", bottom: "Comme un adulte responsable" },
  { top: "Quand t'écris \"bonjour\" avec une faute", bottom: "Tu recommences ta vie ailleurs" },
  { top: "Moi quand quelqu'un me dit \"détends-toi\"", bottom: "Je deviens instantanément tendu" },
  { top: "Le plaisir simple de poser son sac", bottom: "Après une journée de merde" },
  { top: "Quand tu te rends compte que demain", bottom: "C'est lundi. Et il pleut." },
  { top: "Moi ayant une illumination à 3h du mat',", bottom: "Que j'oublie au réveil. Évidemment." },
  { top: "POV: Tu essaies d'ouvrir un pot de confiture", bottom: "Le combat du siècle. Je perds." },
  { top: "Quand tu fais un câl',in à ton chat", bottom: "Il te regarde comme si tu l'avais insulté" },
  { top: "Le mème créé est d'une beauté rare", bottom: "Je m'arrête là, c'est mon chef-d'oeuvre" },

  // Transports / Déplacements
  { top: "Moi dans les transports aux heures de pointe", bottom: "Je fais la paix avec l'humanité. De force." },
  { top: "Quand le métro s'arrête entre deux stations", bottom: "Personne regarde personne. On intériorise." },
  { top: "POV: T'es sur le périph' un vendredi soir", bottom: "Mise à jour : t'as vieilli de 10 ans" },
  { top: "Moi qui pensais arriver à l'heure", bottom: "Le GPS : 45 minutes de trafic. Resignation." },
  { top: "Quand quelqu'un marche au ralenti devant toi", bottom: "Tu inventes des nouvelles insulte dans ta tête" },
  { top: "Moi et mon abonnement de transport", bottom: "Je paie pour être compressé comme une sardine" },

  // Vêtements / Look
  { top: "Moi qui pensais avoir le temps de m'habiller", bottom: "Finalement : pull de la veille et on assume" },
  { top: "Quand t'achètes un vêtement en ligne", bottom: "Sur le mannequin : sublime. Sur moi : sac à patate." },
  { top: "Moi le matin devant mon armoire", bottom: "J'ai rien à me mettre. J'ai 45 trucs." },
  { top: "La chemise achetée pour \"l'occasion spéciale\"", bottom: "Portée une fois. Suspendue depuis 3 ans." },
  { top: "POV: Tu mets un jean propres", bottom: "5 minutes plus tard : tache de café. Inévitable." },

  // Fêtes / Occasions
  { top: "Moi le 31 décembre à 23h55", bottom: "\"Cette année je vais devenir une meilleure personne\"" },
  { top: "Moi le 2 janvier", bottom: "Je suis la même personne. Les mêmes défauts." },
  { top: "Quand ton anniversaire approche", bottom: "Moi qui simule la surprise pour chaque cadeau" },
  { top: "Moi à un mariage", bottom: "Je danse comme si j'étais seul chez moi" },
  { top: "Quand tu dois trouver un cadeau d'anniversaire", bottom: "Cadeau de dernière minute à 23h sur Amazon" },

  // Projets perso / Temps libre
  { top: "\"Ce week-end je finis ce projet\"", bottom: "Dimanche 23h : j'ai regardé 3 séries" },
  { top: "Moi qui devait apprendre l'espagnol", bottom: "Duolingo m'envoie des notifications passives-agressives" },
  { top: "Quand tu commences un nouveau hobby", bottom: "Tu t'achètes tout le matos. Tu l'utilises 2 fois." },
  { top: "Moi planifiant mon été parfait", bottom: "Juillet : canapé. Août : canapé. Bilan : canapé." },
  { top: "La playlist \"je vais être productif\"", bottom: "Écouter de la musique motivante = productive accompli" },

  // Animaux
  { top: "Quand ton animal te réveille à 6h", bottom: "Pour te demander à manger alors que la gamelle est pleine" },
  { top: "Moi parlant à mon chien/chat", bottom: "Lui : neutre. Moi : je pense qu'il comprend tout." },
  { top: "Quand ton animal fait une bêtise", bottom: "Il te regarde avec ses yeux innocents. Tu craques." },
  { top: "Moi plus investi dans le bien-être de mon animal", bottom: "Que dans mon propre bien-être" }
];
