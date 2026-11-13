// Fiches produit, indexées par id de produit (voir categories.js). Textes issus du document
// « Infos Catalogue ».
//
// accroche : la ligne de mots-clés sous le nom
// resume : deux courts textes affichés en colonnes sous le produit (4 lignes chacun, ~115 caractères)
// intro : paragraphes d'introduction de la fiche complète
// sections : blocs de la fiche complète, dans l'ordre. Chacun a un titre (et un intro, une note) et
//   un type :
//     'bienfaits' : items = [{ titre, texte }]
//     'puces'     : items = [texte]
//     'etapes'    : items = [texte] (numérotées, ou à puces si ordonne === false)
//     'texte'     : items = [paragraphe]
// precautions : texte d'avertissement affiché en bas de la fiche

export const FICHES = {
  'masque-glow': {
    accroche: "ILLUMINE • UNIFIE • RAVIVE L'ÉCLAT",
    resume: [
      "Masque moussant au curcuma, bissap et argile rose : estompe les taches et ravive l'éclat d'un teint terne.",
      "1 à 2 fois par semaine : mélangez à l'eau tiède, laissez poser 5 à 10 minutes, puis rincez.",
    ],
    intro: [
      "Vous en avez assez du teint terne, fatigué et des taches pigmentaires qui gâchent l'uniformité de votre peau ? Quand le grain de peau est brouillé par les impuretés et les marques d'hyperpigmentation, le maquillage ne suffit plus : votre peau a besoin d'un vrai renouveau.",
      'Ce masque moussant nouvelle génération cible directement le manque d’éclat et les irrégularités pour transformer visiblement votre visage :',
    ],
    sections: [
      {
        type: 'bienfaits',
        items: [
          {
            titre: 'Unifie et estompe les taches',
            texte:
              'Grâce à l’action combinée du curcuma et de la lavande, il aide à atténuer visiblement les taches brunes et les zones d’hyperpigmentation pour un teint parfaitement homogène.',
          },
          {
            titre: 'Coup d’éclat immédiat',
            texte:
              'Le bissap (hibiscus) et la poudre d’orange, naturellement riches en antioxydants et en acides de fruits doux, éliminent les cellules mortes pour réveiller instantanément la luminosité naturelle de votre peau.',
          },
          {
            titre: 'Peau purifiée sans tiraillement',
            texte:
              'L’argile rose détoxifie et resserre les pores en douceur, tandis que la rose apaise l’épiderme, laissant votre peau douce, fraîche et nette.',
          },
        ],
      },
      {
        type: 'puces',
        titre: 'Pour qui ?',
        intro: 'Idéal si vous luttez contre :',
        items: [
          'Le teint brouillé ou en manque de lumière',
          'Les taches d’hyperpigmentation et les marques post-imperfections',
          'Un grain de peau irrégulier et des pores encombrés',
        ],
      },
      {
        type: 'etapes',
        titre: 'Une gestuelle simple pour un résultat visible',
        items: [
          'Activez la mousse : dans le creux de la main ou un bol, mélangez une noisette de poudre avec un filet d’eau tiède jusqu’à obtenir une texture onctueuse et moussante.',
          'Laissez agir : appliquez en couche généreuse sur le visage propre et légèrement humide (en évitant le contour des yeux). Laissez poser 5 à 10 minutes.',
          'Révélez votre éclat : rincez abondamment à l’eau tiède, puis appliquez immédiatement votre sérum et votre crème hydratante habituels pour sceller l’hydratation.',
        ],
        note: 'À utiliser 1 à 2 fois par semaine pour un teint radieux au quotidien.',
      },
    ],
  },

  'masque-purify': {
    accroche: 'PURIFIE • ASSAINIT • MATIFIE',
    resume: [
      'Masque moussant au soufre, neem et argile verte : stoppe les boutons, absorbe le sébum et matifie.',
      'Pour les peaux qui brillent vite, aux pores visibles et aux boutons récurrents. 1 à 2 fois par semaine.',
    ],
    intro: [
      'Vous connaissez cette sensation : la peau qui regraisse trop vite, les pores visibles et ce bouton qui apparaît toujours au mauvais moment. À force d’utiliser des soins décapants, la peau surproduit du sébum et le cycle recommence.',
      'Ce soin moussant est le reset express dont votre peau a besoin. Il réunit les trésors naturels les plus puissants contre les imperfections dans une formule douce et sensorielle :',
    ],
    sections: [
      {
        type: 'bienfaits',
        items: [
          {
            titre: 'Stoppe les boutons et assainit',
            texte:
              'Le soufre et les feuilles de neem s’associent pour calmer les rougeurs, assécher les boutons naissants et purifier l’épiderme en profondeur.',
          },
          {
            titre: 'Matité nette et zéro brillance',
            texte:
              'L’argile verte agit comme un véritable buvard pour aspirer l’excès de sébum et resserrer visiblement le grain de peau.',
          },
          {
            titre: 'Mousse détox et douceur absolue',
            texte:
              'Le secret ancestral du qasil (issu du jujubier) active une mousse fine qui déloge les impuretés sans frotter, tandis que le moringa réconforte la peau pour ne laisser aucun tiraillement.',
          },
        ],
      },
      {
        type: 'puces',
        titre: 'Ce soin est fait pour vous si :',
        items: [
          'Vous en avez assez de briller au bout de quelques heures.',
          'Vous voulez réduire visiblement les boutons, points noirs et pores dilatés.',
          'Vous cherchez l’efficacité d’un soin purifiant intense, sans effet « peau qui craquelle ».',
        ],
      },
      {
        type: 'etapes',
        titre: 'Votre rituel « peau nette » en 3 étapes',
        items: [
          'Activez la mousse : déposez une noisette de poudre dans le creux de la main, ajoutez quelques gouttes d’eau tiède et frottez délicatement pour réveiller la mousse onctueuse.',
          'Laissez poser : appliquez sur le visage propre et humide (en évitant le contour des yeux) et laissez agir 5 à 10 minutes de pure détox.',
          'Révélez le résultat : rincez abondamment à l’eau tiède pour découvrir une peau immédiatement fraîche, veloutée et mate. Poursuivez avec vos sérums et votre crème habituels.',
        ],
        note: 'Fréquence idéale : 1 à 2 fois par semaine. Inutile de faire un gommage le même jour, le masque s’occupe déjà de clarifier votre grain de peau !',
      },
    ],
  },

  'serum-glow': {
    accroche: 'UNIFIE • CORRIGE • ILLUMINE',
    resume: [
      'Sérum tout-en-un au zinc PCA, niacinamide et romarin : régule la brillance, resserre les pores, hydrate sans gras.',
      'Matin et soir : 2 à 3 gouttes sur le visage et le cou propres, avant la crème (et la crème solaire le matin).',
    ],
    intro: [
      'Visage qui brille dès midi, pores dilatés ou petits boutons qui gâchent votre journée ? Révélez un grain de peau lisse et naturellement éclatant.',
      'Rien n’est plus gênant que de sentir son visage luire au bout de quelques heures ou de voir ses pores s’élargir sous l’effet de la chaleur et du sébum. Les soins trop asséchants ne font qu’empirer les choses : la peau regraisse de plus belle et perd toute sa fraîcheur.',
      'Le Sérum Glow Nat’Care est le soin tout-en-un formulé sur mesure pour nos peaux et nos climats : il purifie et hydrate en profondeur, sans faire luire ni étouffer la peau :',
    ],
    sections: [
      {
        type: 'bienfaits',
        items: [
          {
            titre: 'Stoppe les brillances et les boutons',
            texte:
              'L’action combinée du zinc PCA, de la niacinamide et des extraits de romarin régule l’excès de sébum à la racine et assainit la peau pour calmer les rougeurs et éviter les nouvelles imperfections.',
          },
          {
            titre: 'Affine et resserre le grain de peau',
            texte:
              'Les pores sont visiblement resserrés, la texture du visage est lissée et plus uniforme au toucher.',
          },
          {
            titre: 'Hydratation repulpante sans effet gras',
            texte:
              'L’acide hyaluronique, le panthénol et l’allantoïne désaltèrent intensément l’épiderme pour offrir un fini rebondi, doux et un éclat frais dès la première goutte.',
          },
        ],
      },
      {
        type: 'bienfaits',
        titre: 'Pourquoi choisir le Sérum Glow plutôt qu’un soin standard ?',
        items: [
          {
            titre: 'Pensé pour nos réalités',
            texte:
              'Sa texture gel-eau ultra-fine pénètre en quelques secondes sans laisser de film lourd ou collant sous la chaleur.',
          },
          {
            titre: 'La science et la botanique',
            texte:
              'L’efficacité d’actifs dermatologiques de pointe (zinc, niacinamide, acide hyaluronique) enrichie de la fraîcheur assainissante du romarin.',
          },
          {
            titre: 'Polyvalent',
            texte:
              'Il prend soin de votre peau le matin comme base idéale sous votre solaire, et l’apaise le soir après une longue journée.',
          },
        ],
      },
      {
        type: 'etapes',
        titre: 'Votre rituel simple (matin et soir)',
        items: [
          'Sur une peau propre et sèche, déposez 2 à 3 gouttes sur le visage et le cou.',
          'Massez délicatement du bout des doigts jusqu’à absorption complète.',
          'Poursuivez avec votre crème hydratante habituelle (et votre crème solaire le matin).',
        ],
      },
    ],
  },

  'gommage-sugar': {
    accroche: 'EXFOLIE • ILLUMINE • SE TRANSFORME EN LAIT',
    resume: [
      'Gommage gourmand au sucre fin, curcuma et bissap : lisse les rugosités et se transforme en lait au contact de l’eau.',
      '1 à 2 fois par semaine sur peau humide, puis rincez en 10 secondes et appliquez votre lait corporel.',
    ],
    intro: [
      'Votre lait corporel ne pénètre plus et votre peau reste rêche ? C’est parce qu’une couche de cellules mortes bloque tout.',
      'Ce gommage gourmand au sucre fin, curcuma et bissap relance le renouvellement cellulaire et décuple l’effet de votre routine :',
    ],
    sections: [
      {
        type: 'bienfaits',
        items: [
          {
            titre: 'Multiplie l’efficacité de vos soins',
            texte:
              'Débarrasse la peau de la barrière de peaux mortes pour permettre à votre lait de pénétrer immédiatement en profondeur.',
          },
          {
            titre: 'Peau douce comme un bébé',
            texte:
              'Lisse instantanément les rugosités (jambes râpeuses, coudes rugueux) sans jamais écorcher l’épiderme.',
          },
          {
            titre: 'Unifie et réveille l’éclat',
            texte:
              'Le duo curcuma et bissap aide à estomper les zones sombres pour un corps lumineux.',
          },
          {
            titre: 'Texture magique en lait',
            texte:
              'Fond au massage et se transforme en lait crémeux au contact de l’eau. Se rince en 10 secondes sans laisser de film gras collant.',
          },
        ],
      },
      {
        type: 'etapes',
        titre: 'Le geste beauté (1 à 2 fois par semaine)',
        items: [
          'Massez sur peau humide.',
          'Ajoutez un filet d’eau pour créer le lait.',
          'Rincez, puis appliquez immédiatement votre Lait Corporel Fluide sur une peau transformée.',
        ],
        note: 'Astuce pro : amenez votre pot à l’esthéticienne lors de votre prochaine séance au spa pour un gommage sur mesure avec des actifs nobles !',
      },
    ],
  },

  'chantilly-nourrissante': {
    accroche: 'NOURRIT • RÉPARE • ASSOUPLIT',
    resume: [
      'Chantilly corporelle fouettée au karité, cacao et avocat : nourrit en profondeur sans effet lourd.',
      'Pour les peaux sèches et tiraillées, et pendant la grossesse sur le ventre et les hanches. Matin et/ou soir.',
    ],
    intro: [
      'Peau de croco, démangeaisons, sensations de tiraillement après la douche ou ventre qui s’étire… Quand la peau est déshydratée et asséchée, les laits corporels classiques ne suffisent plus. Elle réclame un soin enveloppant, réconfortant et profondément réparateur.',
      'Cette chantilly corporelle à la texture fouettée et ultra-gourmande fond instantanément sur la peau pour la saturer en nutrition, sans effet lourd :',
    ],
    sections: [
      {
        type: 'bienfaits',
        items: [
          {
            titre: 'Nutrition et bouclier anti-sécheresse',
            texte:
              'Le duo généreux de beurre de karité et de beurre de cacao pénètre pour régénérer la barrière cutanée, réparer les zones rugueuses et sceller l’hydratation durablement.',
          },
          {
            titre: 'Souplesse et élasticité retrouvées',
            texte:
              'L’huile d’avocat, gorgée d’acides gras essentiels, assouplit la peau en profondeur pour lui redonner tout son rebond naturel.',
          },
          {
            titre: 'Apaisement immédiat des inconforts',
            texte:
              'Les macérâts précieux de rose musquée et de calendula calment les rougeurs, atténuent les tiraillements et favorisent une peau lisse, douce et régénérée.',
          },
        ],
      },
      {
        type: 'puces',
        titre: 'Ce soin est fait pour vous si :',
        items: [
          'Votre peau tiraille, démange ou s’écaille au fil de la journée.',
          'Vous cherchez un soin doudou riche mais aérien qui transforme immédiatement le toucher de la peau.',
          'Vous êtes enceinte et cherchez le soin idéal pour accompagner l’étirement du ventre et des hanches en toute sérénité.',
        ],
      },
      {
        type: 'texte',
        titre: 'Un allié précieux pendant la grossesse',
        items: [
          'Parce que le corps change et que la peau s’étire intensément, cette formule aide à préserver une élasticité maximale. Appliquée chaque jour sur le ventre, les hanches, les cuisses et la poitrine, elle maintient les tissus souples, nourris et prêts à vivre ces transformations en douceur.',
        ],
      },
      {
        type: 'etapes',
        titre: 'Conseils d’utilisation',
        items: [
          'Prélevez : chauffez une petite noisette entre la paume de vos mains pour faire fondre la texture aérienne.',
          'Massez : appliquez quotidiennement (matin et/ou soir) sur peau propre et sèche par mouvements circulaires jusqu’à pénétration complète.',
          'Le geste expert : appliquez-la généreusement juste après un gommage corporel pour saturer la peau de nutriments et obtenir un toucher satiné incomparable.',
        ],
      },
    ],
    precautions: 'En cas d’application en journée, évitez les expositions prolongées au soleil.',
  },

  'huile-eclat': {
    accroche: 'ILLUMINE • SCELLE • PARFUME',
    resume: [
      'Huile sèche shimmer visage et corps : scelle l’hydratation de votre lait et habille la peau d’un fini satiné.',
      'Quelques gouttes sur jambes, bras et décolleté après le lait. Toucher sec : on s’habille tout de suite.',
    ],
    intro: [
      'Vous appliquez déjà votre lait, mais votre peau redevient terne et sans éclat en cours de journée ?',
      'Un lait de toilette hydrate, mais il s’évapore vite sous la chaleur, le vent ou la climatisation. Résultat : les jambes reprennent un aspect grisâtre, les bras manquent de vie et la peau perd toute sa lumière.',
      'Cette huile sèche précieuse est la touche finale indispensable à votre routine : elle scelle l’hydratation de votre lait tout en habillant votre corps d’un fini satiné et soyeux incomparable :',
    ],
    sections: [
      {
        type: 'bienfaits',
        items: [
          {
            titre: 'Fini satiné ultra-naturel',
            texte:
              'Une micro-dose de mica minéral et une nuance de curcuma doré qui captent la lumière en toute discrétion. Zéro effet « paillettes de fête », juste une peau éclatante, saine et chic.',
          },
          {
            titre: 'Scelle l’hydratation sans coller',
            texte:
              'Le sésame local, l’argan et le baobab créent un bouclier doux qui empêche votre lait de sécher. Toucher sec immédiat : vous pouvez vous habiller sans tacher vos vêtements.',
          },
          {
            titre: 'Sillage floral et ambré',
            texte:
              'Le macérât de rose, bissap et lavande parfume délicatement votre peau d’une note chaleureuse et féminine qui dure des heures.',
          },
        ],
      },
      {
        type: 'etapes',
        titre: 'Comment l’intégrer à votre routine ?',
        items: [
          'Agitez : secouez le flacon pour bien mélanger les micro-nacres.',
          'Sublimez : appliquez quelques gouttes sur les jambes, les bras et le décolleté, juste après votre lait de toilette, pour fixer l’hydratation et faire briller le grain de peau.',
          'Le soir : vous pouvez aussi déposer 1 à 2 gouttes sur le visage propre pour un réveil lumineux.',
        ],
      },
    ],
    precautions:
      'Contient du sésame. Évitez le contact avec les yeux et les lèvres. Avant la première utilisation, effectuez un test au pli du coude et surveillez la réaction de la peau.',
  },

  'huile-douceur': {
    accroche: 'NOURRIT • APAISE • ENDORT',
    resume: [
      'Huile douce au palmiste et au sésame : nourrit la peau fragile des tout-petits sans film collant.',
      'Camomille, calendula et lavande apaisent et préparent au sommeil. À masser après le bain.',
    ],
    intro: [
      'Le rituel apaisant du coucher : une peau veloutée et un sommeil serein pour votre tout-petit.',
      'Fini la peau sèche qui tiraille après le bain et l’agitation à l’heure du dodo. Cette huile douce transforme la routine du soir en un véritable moment de câlin et de détente.',
    ],
    sections: [
      {
        type: 'bienfaits',
        items: [
          {
            titre: 'Nourrit et protège la peau fragile',
            texte:
              'L’huile de palmiste d’Afrique et le sésame local adoucissent l’épiderme en profondeur sans laisser de film collant.',
          },
          {
            titre: 'Calme les petites irritations',
            texte:
              'Les extraits de camomille et de calendula soulagent instantanément les rougeurs et les tiraillements causés par le calcaire.',
          },
          {
            titre: 'Aide à l’endormissement',
            texte:
              'Le parfum naturel et délicat de la lavande relaxe l’enfant et prépare au calme de la nuit.',
          },
        ],
      },
      {
        type: 'etapes',
        titre: 'En 2 minutes après le bain',
        items: [
          'Versez quelques gouttes au creux de vos mains et frottez vos paumes pour tiédir l’huile.',
          'Massez délicatement sur la peau propre et sèche (corps, dos, petits pieds) en évitant les yeux.',
        ],
      },
    ],
  },

  'huile-racines': {
    accroche: 'STIMULE • FORTIFIE • ASSOUPLIT',
    resume: [
      'Huile concentrée aux plantes africaines et ayurvédiques : stimule la pousse, fortifie et nourrit sans graisser.',
      'En sérum sans rinçage ou en bain d’huile avant le shampoing, 2 à 3 fois par semaine. Dès 12 ans.',
    ],
    intro: [
      'Cuir chevelu fatigué, casse ou stagnation de la pousse ? Réveillez la vitalité de vos cheveux dès la racine.',
      'Quand le cuir chevelu manque de tonus et que les longueurs se cassent avant même d’atteindre la longueur voulue, les soins de surface ne suffisent plus. Il faut agir à la source pour fortifier le cheveu et relancer une dynamique de croissance saine.',
      'Cette huile concentrée fusionne la puissance des huiles africaines et le secret des plantes ayurvédiques pour une chevelure visiblement plus forte, dense et résistante :',
    ],
    sections: [
      {
        type: 'bienfaits',
        items: [
          {
            titre: 'Stimule la pousse et tonifie la racine',
            texte:
              'La macération de palmiste d’Afrique et de romarin, enrichie d’actifs stimulants (menthe poivrée, gingembre, tea tree), active la microcirculation et procure un coup de fraîcheur immédiat qui réveille les follicules paresseux.',
          },
          {
            titre: 'Bouclier anti-casse et force brute',
            texte:
              'Le duo ancestral de nigelle et de carapa fortifie la fibre capillaire en profondeur, freine la chute mécanique et soulage les cuirs chevelus sujets aux démangeaisons.',
          },
          {
            titre: 'Souplesse et brillance sans alourdir',
            texte:
              'L’huile précieuse de baobab (« l’arbre de vie »), alliée au ricin et à la coco, nourrit intensément les longueurs assoiffées pour sceller la matière sans effet gras persistant.',
          },
        ],
      },
      {
        type: 'puces',
        titre: 'Pour qui ?',
        intro: 'Hommes et femmes dès 12 ans confrontés à :',
        items: [
          'Des cheveux fins, cassants ou en perte de densité',
          'Un cuir chevelu en manque de fraîcheur, étouffé ou sujet aux inconforts',
          'Une pousse qui stagne ou des longueurs fragilisées',
        ],
      },
      {
        type: 'etapes',
        titre: '1 flacon, 2 usages au choix',
        ordonne: false,
        items: [
          'En sérum activateur (sans rinçage) : appliquez quelques gouttes raie par raie sur cuir chevelu propre, puis massez du bout des doigts 2 à 3 fois par semaine.',
          'En bain d’huile fortifiant (avant-shampoing) : répartissez des racines jusqu’aux pointes, massez 5 minutes, laissez poser 1 heure minimum, puis procédez à votre shampoing habituel (2 à 3 fois par semaine).',
        ],
      },
    ],
    precautions:
      'Dès 12 ans. Déconseillé aux femmes enceintes ou allaitantes (contient des huiles essentielles). Contient du sésame. Éviter le contact avec les yeux. Effectuer impérativement un test dans le pli du coude 24 h avant usage.',
  },

  // Gammes : la liste des produits, leurs prix et le prix de la gamme sont ajoutés automatiquement
  // sous l'introduction (voir FicheProduit).
  'gamme-visage': {
    accroche: 'UNE ROUTINE VISAGE COMPLÈTE',
    resume: [
      'Le trio visage : Masque Purify, Sérum Glow et Masque Glow, pour purifier, matifier, unifier et illuminer.',
      'Deux masques 1 à 2 fois par semaine, le sérum matin et soir : une routine visage complète, vendue ensemble.',
    ],
    intro: [
      'Trois soins visage Nat’Care qui se complètent : un masque purifiant pour assainir et matifier, un masque éclat pour estomper les taches et raviver la luminosité, et un sérum pour réguler la brillance et hydrater au quotidien.',
    ],
    sections: [
      {
        type: 'puces',
        titre: 'Votre routine avec la gamme',
        items: [
          'Masque Purify : 1 à 2 fois par semaine, pour purifier, assainir et matifier.',
          'Masque Glow : 1 à 2 fois par semaine, pour unifier le teint et raviver l’éclat.',
          'Sérum Glow : matin et soir, 2 à 3 gouttes sur le visage et le cou propres, avant votre crème (et votre crème solaire le matin).',
        ],
      },
    ],
  },

  'gamme-corps': {
    accroche: 'UN RITUEL CORPS COMPLET',
    resume: [
      'Le trio corps : Gommage Sugar, Huile Éclat et Chantilly Nourrissante, pour exfolier, nourrir et illuminer.',
      'On gomme, on nourrit, puis on sublime : le geste beauté du corps du début à la fin, vendu ensemble.',
    ],
    intro: [
      'Trois soins corps Nat’Care pour un rituel complet : un gommage qui débarrasse la peau de ses cellules mortes, une chantilly qui nourrit et assouplit en profondeur, et une huile shimmer qui scelle l’hydratation et habille la peau d’un fini satiné.',
    ],
    sections: [
      {
        type: 'puces',
        titre: 'Votre rituel avec la gamme',
        items: [
          'Gommage Sugar Soufflé Éclat : 1 à 2 fois par semaine, massé sur peau humide puis rincé.',
          'Chantilly Nourrissante : appliquée généreusement juste après le gommage, matin et/ou soir, pour saturer la peau de nutriments.',
          'Huile Éclat : quelques gouttes sur les jambes, les bras et le décolleté pour fixer l’hydratation et faire briller le grain de peau.',
        ],
      },
    ],
  },
}
