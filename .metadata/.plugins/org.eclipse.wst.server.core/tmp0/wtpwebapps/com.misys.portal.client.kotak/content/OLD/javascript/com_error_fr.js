// Copyright (c) 2000-2006 NEOMAlogic (http://www.neomalogic.com),
// All Rights Reserved. 

// ---------------------------------------------------------
// Error Messages, Formats and Related Functions in FRENCH
// ---------------------------------------------------------

// Language Code
var g_strLanguageCode = "fr";


// Constants for Amount format
var g_strDecimalDelimiter = ",";
var g_strDigitGroupingDelimiter = " ";


// Constants for Date format
var g_strGlobalDateFormat = "dd/mm/yyyy";
var g_strGlobalDateTimeFormat = "dd/mm/yyyy hh:mi:ss";
var g_strGlobalDateDelimiter = "/";
var g_strGlobalDateStartWeek = 1; // First day of the week, 0 for sunday, 1 for monday, etc.
var g_arrShortDayLabel = new Array('L','M','M','J','V','S','D');


// Perform SWIFT character set checking in the transaction submissions
var g_blnSWIFTChecking = true;


// Months
g_arrMonthLabel = new Array(13);

g_arrMonthLabel[1] = "Janvier";
g_arrMonthLabel[2] = "Février";
g_arrMonthLabel[3] = "Mars";
g_arrMonthLabel[4] = "Avril";
g_arrMonthLabel[5] = "Mai";
g_arrMonthLabel[6] = "Juin";
g_arrMonthLabel[7] = "Juillet";
g_arrMonthLabel[8] = "Août";
g_arrMonthLabel[9] = "Septembre";
g_arrMonthLabel[10] = "Octobre";
g_arrMonthLabel[11] = "Novembre";
g_arrMonthLabel[12] = "Décembre";

//
// Error Messages
//
g_arrErrorMessages = new Array();

g_arrErrorMessages[1] = "Le code devise %s ne correspond pas une devise existante.";

g_arrErrorMessages[2] = "Il n'y a pas de '%s' en %s %s.";
g_arrErrorMessages[3] = "%s n'est pas un Mois valide.";
g_arrErrorMessages[4] = "%s n'est pas une Année valide.";
g_arrErrorMessages[5] = "%s n'est pas une date valide (jj/mm/aaaa).";

g_arrErrorMessages[6] = "La Date d'Emission (%s) doit être ultérieure ou égale \nà la date du jour (%s).";
g_arrErrorMessages[7] = "La Date d'Emission (%s) doit être antérieure ou égale \nà la Date ultime de Validité (%s).";
g_arrErrorMessages[8] = "La Date limite d'Expédition (%s) doit être ultérieure ou égale \nà la date de la demande (%s).";
g_arrErrorMessages[9] = "La Date ultime de Validité (%s) doit être ultérieure \nou égale à la date du jour (%s).";
g_arrErrorMessages[10] = "La Date ultime de Validité du Crédit (%s) doit être \nultérieure ou égale à la Date limite d'Expédition (%s).";

g_arrErrorMessages[11] = "Ce champ doit contenir un nombre.";
g_arrErrorMessages[12] = "Le choix d'une tolérance (positive ou négative) et du \nmontant maximum du crédit sont mutuellement exclusifs.";
g_arrErrorMessages[13] = "Tous les champs obligatoires doivent être saisis pour \nsoumettre le formulaire.";

g_arrErrorMessages[14] = "Le nombre maximum de lignes pour ce champ a été \ndépassé (%s lignes).";
g_arrErrorMessages[15] = "La taille maximale autorisée pour ce champs a \nété dépassée (%s lignes x %s caractères).";

g_arrErrorMessages[16] = "Un Crédit Documentaire Stand-By doit être Irrévocable \npour être Transférable.";

g_arrErrorMessages[17] = "La Date d'Amendement (%s) doit être ultérieure ou égale \nà la Date d'Emission (%s).";
g_arrErrorMessages[18] = "La diminution du montant ne peut excéder le montant \nactuel du dossier.";
g_arrErrorMessages[19] = "Pour valider la transaction, au moins l'un des champs \nde saisie doit être modifié.";
g_arrErrorMessages[20] = "Désolé, votre moteur de recherche ne supporte pas cette fonction.\n Vous devez vous référer à la liste des moteurs de recherche recommandés pour résoudre le problème.";

g_arrErrorMessages[21] = "La Date d'Emission (%s) doit être antérieure ou égale \nà la Date de Maturité (%s).";
g_arrErrorMessages[22] = "La Date de Maturité (%s) doit être ultérieure ou égale \nà la date du jour (%s).";

g_arrErrorMessages[23] = "La référence du Modèle est obligatoire si vous souhaitez \nsauver les détails de la transaction en modèle.";

g_arrErrorMessages[24] = "Le nouveau montant dépasse le maximum autorisé.";

g_arrErrorMessages[25] = "La Date d'Amendement (%s) doit être antérieure ou égale \nà la nouvelle Date ultime de Validité (%s).";

g_arrErrorMessages[26] = "Pour le mode d'envoi par SWIFT choisi, le caractère illégal '%s' est présent \ndans les détails de cette transaction. Veuillez corriger le texte correspondant sachant \nque le jeu de caractères autorisés comprend exclusivement les caractères suivants:\na..zA..Z0..9 /-?:().,'+";

g_arrErrorMessages[27] = "Lors d'une augmentation ou diminution du montant de la transaction,\nla raison de cet amendement doit être indiquée dans le narratif.";

// same message g_arrErrorMessages[8]
//g_arrErrorMessages[28] = "La Date limite d'Expédition (%s) doit être postérieure ou égale \nà la date de la demande (%s).";

g_arrErrorMessages[29] = "La Date d'Exécution (%s) doit être ultérieure ou égale \nà la date du jour (%s).";

g_arrErrorMessages[30] = "Le caractère '%s' n'est pas autorisé pour cette donnée.";

g_arrErrorMessages[31] = "Tous les champs obligatoires doivent être saisis.";

g_arrErrorMessages[32] = "Les détails doivent être validés avant \nde soumettre le formulaire.";

g_arrErrorMessages[33] = "Cet élément est déjà présent dans votre liste. Veuillez le renommer.";

g_arrErrorMessages[34] = "La longueur du mot de passe n'est pas valide (saisissez entre %s et %s caractères).";
// Alternative error message
g_arrErrorMessages[35] = "Le mot de passe n'est pas valide (saisissez au minimum %s caractères, \ndont au moins une lettre et un chiffre).";

g_arrErrorMessages[36] = "Vous devez saisir un taux de change avant de calculer le montant équivalent.";

g_arrErrorMessages[37] = "Vous n'avez pas sélectionné le format pour chacun des documents présentés.";

g_arrErrorMessages[38] = "Vous devez choisir un et un seul lien pour cette nouvelle.";

g_arrErrorMessages[39] = "Désolé, un maximum de %s enregistrements est autorisé.";
g_arrErrorMessages[40] = "Ce paramètre est déjà utilisé par un critère avec une colonne de type différent. \nVeuillez choisir un autre paramètre.";
//Telex
g_arrErrorMessages[41] = "Pour le mode d'envoi par TELEX choisi, le caractère illégal '%s' est présent \ndans les détails de cette transaction. Veuillez corriger le texte correspondant sachant \nque le jeu de caractères autorisés comprend exclusivement les caractères suivants:\nA..Z0..9'()+,-./:=?";

g_arrErrorMessages[42] = "Vous avez choisi de spécifier des tailles relatives pour la largeur des colonnes.\nLa somme des largeurs de colonnes doit donc être égale à 100%,et toutes les largeurs des colonnes doivent contenir une valeur.";

g_arrErrorMessages[43] = "La saisie au choix d'une date limite d'expédition ou d'un \ncalendrier d'expédition est obligatoire.";

g_arrErrorMessages[44] = "Vous devez préciser un Donneur d'ordre";

g_arrErrorMessages[45] = "Le montant transféré ne peut être supérieur au montant du Crédit Documentaire.";

g_arrErrorMessages[46] = "Le nombre maximum de lignes affichées \nà l'exécution du rapport est compris entre 1 et 100.";

g_arrErrorMessages[47] = "Le rapport n'est pas multi-produit. Vous ne pouvez pas ajouter un autre produit.";

g_arrErrorMessages[48] = "Vous devez choisir une fréquence.";
g_arrErrorMessages[49] = "Vous devez choisir un jour de la semaine.";
g_arrErrorMessages[50] = "vous devez choisir un jour du mois.";
g_arrErrorMessages[51] = "La taille maximale autorisée pour ce champs a \nété dépassée (%s caractères autorisés. Vous en avez saisi %s.).";

g_arrErrorMessages[52] = "Ce champ doit contenir un nombre ce qui n'est pas le cas de la valeur %s.";
g_arrErrorMessages[53] = "Code pays %s invalide.";
g_arrErrorMessages[54] = "Vous devez définir au moins un bénéficiaire.";
g_arrErrorMessages[55] = "La date limite d'expédition (%s) doit être ultérieure à la date prévue(%s).";
g_arrErrorMessages[56] = "La dernière date d'expédition (%s) doit être ultérieure à la date prévue (%s).";
g_arrErrorMessages[57] = "La dernière date d'expédition (%s) doit être ultérieure à la date de demande (%s).";
g_arrErrorMessages[58] = "Vous devez choisir entre le montant et le taux/pourcentage.";
//g_arrErrorMessages[59] = "Number format is not valid : one digit and %s decimals.";
g_arrErrorMessages[60] = "Vous devez choisir les frais de transport en amont. .";
g_arrErrorMessages[61] = "Le (%s) code du pays n'est pas valide.";
g_arrErrorMessages[62] = "Vous devez définir au moins un paiement.";
g_arrErrorMessages[68] = "Vous devez définir au moins un aéroport de destination \n pour chaque groupe d'aéroports dans le mode de transport individuel.\n Vérifier les détails des transports."
g_arrErrorMessages[69] = "Vous devez définir au moins un port de décharge \n pour chaque groupe de ports dans le mode de transport individuel.\n Vérifier les détails des transports.";
g_arrErrorMessages[70] = "Vous devez définir au moins un lieu de livraison \n pour chaque groupe de transports routier dans le mode de transport individuel.\n Vérifier les détails des transports."
g_arrErrorMessages[71] = "Vous devez définir au moins un lieu de livraison \n pour chaque groupe de transports férroviaire dans le mode de transport individuel.\n Vérifier les détails des transports."
g_arrErrorMessages[72] = "BEI inccorecte (%s).\nUn BEI doit avoir le format suivant : \n6 caractères + 1 caractère alphanumérique excepté le 0 et le 1 \n+ 1 caractère alphanumérique de A à N ou de P à Z ou de 0 à 9 \n+ 0 ou 3 caractère(s) alphanumérique(s).";
g_arrErrorMessages[73] = "BIC inccorecte (%s).\nUn code BIC doit avoir le format suivant : \n6 caractères + 1 caractère alphanumérique excepté le 0 et le 1 \n+ 1 caractère alphanumérique de A à N ou de P à Z ou de 0 à 9 \n+ 0 ou 3 caractère(s) alphanumérique(s).";
g_arrErrorMessages[74] = "Les types de mesure %s et %s ne sont pas compatibles.";
g_arrErrorMessages[75] = "Vous devez choisir un sens avant.";
g_arrErrorMessages[76] = "Un type de marchandise ne peut être choisi qu'une fois par ligne de marchandise.";
g_arrErrorMessages[77] = "Le champ 'Dernière Date d'Expédition' ne peut être présent à la fois au niveau général du Bon de Cmmande et au niveau des Lignes de Marchandise.\n Remarque : il peut ne pas être précisé du tout.";
g_arrErrorMessages[78] = "Les Détails sur le transport ne peuvent être présents à la fois dans au niveau général du bon de Commande et au niveau des Lgnes de Marchandises.\n Remarque : ils peuvent ne pas être précisés du tout.";
g_arrErrorMessages[79] = "Les Inco Termes ne peuvent être présents à la fois dans au niveau général du bon de Commande et au niveau des Lgnes de Marchandises.\n Remarque : ils peuvent ne pas être précisés du tout.";
g_arrErrorMessages[80] = "Vous devez choisir entre un code aéroport et un nom de ville ou d'aéroport";
g_arrErrorMessages[81] = "Vous devez saisir une devise pour pouvoir entrer les détails du bon de commande.";
g_arrErrorMessages[82] = "Pour un transport Simple, l'un des éléments au moins doit être saisi.";
g_arrErrorMessages[83] = "Pour un transport Multimodale, au moins deux éléments doivent être saisis.";
g_arrErrorMessages[84] = "Si les Termes de Paiement sont exprimés en pourcentage, le total doit être égal à 100%. Il est actuellement de %s%.";
g_arrErrorMessages[85] = "Vous devez choisir auparavant un type de Termes de Paiement.";
g_arrErrorMessages[86] = "Les Incotermes,  ajustements, taxes et charges  ne peuvent être présents à la fois dans au niveau général du bon de Commande et au niveau des Lgnes de Marchandises.\n Remarque : ils peuvent ne pas être précisés du tout.";
g_arrErrorMessages[87] = "Vous ne pouvez pas modifier le code BIC de cette banque. ";
g_arrErrorMessages[88] = "Pour le mode d'envoi par SWIFT choisi, le caractère illégal 'Tabulation' est présent \ndans les détails de cette transaction. Veuillez corriger le texte correspondant sachant \nque le jeu de caractères autorisés comprend exclusivement les caractères suivants:\na..zA..Z0..9 /-?:().,'+";
g_arrErrorMessages[89] = "La référence doit être unqiue. La valeur( %s) est déjà définie.";

g_arrErrorMessages[95] = "Pour le mode d'envoi par SWIFT choisi, le caractère '%s' ne peut pas être utilisé ne première position d'une ligne."
g_arrErrorMessages[99] = La date de fin (%s) doit être antérieure ou égale à la date de départ' (%s).";

// Collaboration Suite
g_arrErrorMessages[100] = "Vous devez d'abord choisir une banque.";
g_arrErrorMessages[101] = "L'application ne peut exécuter votre requête car un élément HTML est manquant.";

// TSU console
g_arrErrorMessages[150] = "Valeur invalide.";

g_arrErrorMessages[500] = "Adresse E-mail invalide.";

// Confirmation Messages
//
g_arrConfirmationMessages = new Array();

g_arrConfirmationMessages[1] = "Vous allez sauver les détails de la transaction \nen cours. Etes-vous sûr ?";
g_arrConfirmationMessages[2] = "Vous allez soumettre les détails de la transaction \nen cours. Etes-vous sûr ?";
g_arrConfirmationMessages[3] = "Vous allez sauver les détails de la transaction en cours \nsous la forme d'un modèle. Etes-vous sûr ?";
g_arrConfirmationMessages[4] = "Vous allez quitter la page en cours. \nEtes-vous sûr ?";
g_arrConfirmationMessages[5] = "Souhaitez-vous accéder un formulaire de mise à \njour des détails de la transaction en cours ?";
g_arrConfirmationMessages[6] = "Vous allez effacer %s enregistrement(s) de transactions. \nEtes-vous sûr ?";
g_arrConfirmationMessages[7] = "Vous allez effacer du système \nl'enregistrement '%s'. Etes-vous sûr ?";

g_arrConfirmationMessages[8] = "Votre Description de Marchandises dépasse la taille \nmaximale autorisée dans un message SWIFT (100 lignes). \nSouhaitez-vous que le mode d'envoi soit changé en Telex ?";
g_arrConfirmationMessages[9] = "Votre liste de Documents Requis dépasse la taille \nmaximale autorisée dans un message SWIFT (100 lignes). \nSouhaitez-vous que le mode d'envoi soit changé en Telex ?";
g_arrConfirmationMessages[10] = "Vos Conditions Supplémentaires dépassent la taille \nmaximale autorisée dans un message SWIFT (100 lignes). \nSouhaitez-vous que le mode d'envoi soit changé en Telex ?";
g_arrConfirmationMessages[11] = "Vous allez supprimer cet enregistrement. Etes-vous sûr ?";

g_arrConfirmationMessages[12] = "Vous allez télécharger un fichier de %s. Etes-vous sûr ?";

g_arrConfirmationMessages[13] = "Vous allez rejeter la transaction. Etes-vous sûr ?";

g_arrConfirmationMessages[14] = "Vous allez versionner les documents sélectionnés. \nEtes-vous sûr ?";
g_arrConfirmationMessages[15] = "Vous allez ajouter un document. \nEtes-vous sûr ?";
g_arrConfirmationMessages[16] = "Vous allez effacer un document. \nEtes-vous sûr ?";
g_arrConfirmationMessages[17] = "Souhaitez-vous accéder un formulaire de mise à \njour des détails du document ?";
g_arrConfirmationMessages[18] = "Souhaitez-vous accéder un formulaire de mise à \njour du modèle pour les documents de ce dossier ?";
g_arrConfirmationMessages[19] = "Souhaitez-vous clore le modèle ?";
g_arrConfirmationMessages[20] = "Vous allez modifier la devise du total. \nVous pouvez perdre certaines données \ndans les formes relatives aux produits et aux charges. \nEtes-vous sûr ?";
g_arrConfirmationMessages[21] = "Vous allez soumettre les détails de la transaction \nen cours. Etes-vous sûr ?\n\nRemarque: La %s étant assujettie aux eRUU,\nvérifiez que vous avez correctement spécifié\nles formats électroniques des documents.";
g_arrConfirmationMessages[22] = "Vous allez soumettre %s enregistrement(s) de transactions. \nEtes-vous sûr ?";
g_arrConfirmationMessages[23] = "La modification du produit effacera la configuration de votre rapport.\nEtes-vous sûr ?";
g_arrConfirmationMessages[24] = "La paramètre %s est utilisé par un ou plusieurs critères. \nLa suppression de cet enregistrement entraînera la suppression du(des) critère(s) associé(s). \nEtes-vous sûr ?";
g_arrConfirmationMessages[25] = "Vous allez charger %s enregistrement(s). \nEtes-vous sûr ?";
g_arrConfirmationMessages[26] = "Le lieu de départ ou de destination n'a pas été saisi. \nEtes-vous sûr de vouloir soumettre la transaction en l'état ?";
g_arrConfirmationMessages[27] = "Le mode d'envoi est TELEX. Avez-vous vérifié que la banque destinataire accepte ce mode? \n Etes-vous sûr de vouloir soumettre la transaction en l'état ?";
g_arrConfirmationMessages[28] = "Ce paramètre est utilisé par un ou plusieurs critères. \nLe renommage de ce paramètre entraînera la suppression du(des) critère(s) associé(s). \nEtes-vous sûr ?";
g_arrConfirmationMessages[29] = "Ce champ calculé est utilisé par un ou plusieurs agrégats. \nLe renommage de l'identifiant entraînera la suppression des agrégats associés. \nEtes-vous sûr ?";
g_arrConfirmationMessages[30] = "Vous allez sauver vos données. Etes-vous sûr ?";
g_arrConfirmationMessages[31] = "Vous allez modifier la devise du Virement.\n Ce changement supprimera les bénéficiaires saisis. Etes-vous sûr ?";;

g_arrConfirmationMessages[31] = "Vous allez saisir des détails de transport. \nEtes-vous sûr ?";
g_arrConfirmationMessages[32] = "Vous allez saisir des enregistrements. \nEtes-vous sûr ?";
g_arrConfirmationMessages[33] = "Vous allez initier %s Crédit(s) Documentaire. \nEtes-vous sûr ?";
g_arrConfirmationMessages[34] = "Vous allez sauver les enregistrements dans une transaction Open Account. \nEtes-vous sûr ?";
g_arrConfirmationMessages[35] = "Vous allez soumettre les enregistrements dans une transaction Open Account. \nEtes-vous sûr ?";
g_arrConfirmationMessages[36] = "Si vous ne redéfinissez pas de devise, les ajustements, taxes, charges  et les articles seront effacés. \nEtes-vous sûr ?";
g_arrConfirmationMessages[37] = "Si vous redéfinissez le type des Détails des Termes de Paiements, tous les éléments actuels seront effacés. \nEtes-vous sûr ?";
g_arrConfirmationMessages[38] = "Si vous redéfinissez le type de charges, tous les éléments actuels seront effacés. \nEtes-vous sûr ?";
g_arrConfirmationMessages[40] = "Vous allez cr?er %s dossier(s). \nEtes-vous s?r ?";

// Collaboration Suite
g_arrConfirmationMessages[100] = "Vous allez associer ce client avec la(les) contrepartie(s) précédemment sélectionnée(s). \nEtes-vous sûr ?";

g_arrConfirmationMessages[500] = "Vous allez soumettre les d?tails de la transaction \nen cours. Etes-vous s?r ?\nVous vous engagez alors ? ce que toute transaction pass?e sur le portail soit licite.";

//
// Information messages
//
g_arrInformationMessages = new Array();

g_arrInformationMessages[1] = "Message de la banque sur la transaction :\n\n%s";
g_arrInformationMessages[2] = "La plage de date n'est pas valide. Elle est obligatoire et restreinte à %s mois.";
g_arrInformationMessages[3] = "Attention: le 29,30 et 31 ne sont pas possibles pour tous les mois de l'année.";
g_arrInformationMessages[4] = "La plage de date n'est pas valide. Elle est obligatoire et restreinte à %s jours.";
g_arrInformationMessages[5] = "Vous devez définir une devise.";

g_arrInformationMessages[10] = "La plage de date n'est pas valide. Elle est obligatoire et restreinte à %s jours (à partir du %s)";
g_arrInformationMessages[11] = "La plage de date n'est pas valide. Elle est obligatoire et restreinte à %s jours (jusqu'au %s)";

g_arrInformationMessages[50] = "Vous devez choisir un format de compte avant.";
g_arrInformationMessages[51] = "Le champ Transshipment doit être précisé si les documents de transport sont demandés.";
g_arrInformationMessages[52] = "Le champ Transshipment doit être précisé si les documents de transport sont demandés. Si la section 'Détails de Transport' n'est pas présente, contactez votre administrateur.";

g_arrInformationMessages[55] = "Temps restant : %s minute(s) %s seconde(s)";
g_arrInformationMessages[56] = "Session Expirée!";
g_arrInformationMessages[57] = "Votre session expire dans %s minute(s).\nSauvegardez votre travail maintenant pour prévenir toute déconnexion.";

  // Utility to substitute the %s appearing in the message definition with the actual text
  function fncPrepareMessage(strTempMessage, strText1, strText2, strText3, strText4, strText5) 
  { 
    if (strText1)
    {
      strTempMessage = strTempMessage.replace(/%s/,strText1);
      if (strText2)
      {
        strTempMessage = strTempMessage.replace(/%s/,strText2);
        if (strText3) 
        {
          strTempMessage = strTempMessage.replace(/%s/,strText3);
          if (strText4) 
          {
            strTempMessage = strTempMessage.replace(/%s/,strText4);
            if (strText5) 
              strTempMessage = strTempMessage.replace(/%s/,strText5);
          }
        }
      }
    }
    return strTempMessage;
  }

  // Displays an error box for the error code passed as input parameter
  function fncShowError(intErrorCode, strText1, strText2, strText3, strText4, strText5) 
  {
    var strErrorMessage = g_arrErrorMessages[intErrorCode];
    window.alert("ERREUR - " + fncPrepareMessage(strErrorMessage, strText1, strText2, strText3, strText4, strText5));
  }

  // Displays a confirmation popup window returning true if the user clicks OK
  // and false otherwise
  function fncShowConfirmation(intMessageCode, strText1, strText2, strText3, strText4, strText5) 
  {
    var strConfirmationMessage = g_arrConfirmationMessages[intMessageCode];
    return window.confirm(fncPrepareMessage(strConfirmationMessage, strText1, strText2, strText3, strText4, strText5));
  }
  // Displays an information popup window
  function fncShowInformation(intMessageCode, strText1, strText2, strText3, strText4, strText5) 
  {
    var strInformationMessage = g_arrInformationMessages[intMessageCode];
    window.alert(fncPrepareMessage(strInformationMessage, strText1, strText2, strText3, strText4, strText5));
  }

  // Get an information message
  function getInformationMessage(intMessageCode, strText1, strText2, strText3, strText4, strText5) 
  {
    var strInformationMessage = g_arrInformationMessages[intMessageCode];
    return fncPrepareMessage(strInformationMessage, strText1, strText2, strText3, strText4, strText5);;
  }