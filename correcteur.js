/*
Code source d'origine : http://pascal.cormier.free.fr/correcteur/
Convertie en javascript par Ponnaka TITH (mail : ponnaka.tith@gmail.com)
Algorithme de Levenshtein inspiré de wikipédia : https://fr.wikipedia.org/wiki/Distance_de_Levenshtein
*/


function levenshteinDistance (s, t) {
/*
La distance de Levenshtein est une distance mathématique donnant une mesure de la similarité entre deux chaînes de caractères.
Elle est égale au nombre minimal de caractères qu'il faut supprimer, insérer ou remplacer pour passer d’une chaîne à l’autre.
*/
	var x=s.length;
	var y=t.length;
	var cout=0;
    var mat=new Array(x);
	for(var i=0 ; i<mat.length ; i++){
		mat[i]=new Array(y);
	}
	for(var i=0 ; i<x ; i++){
		mat[i][0] = i;
	}
	for(var i=0 ; i<y ; i++){
		mat[0][i] = i;
	}
	
	for(var i=1 ; i<x ; i++){
		for(var j=1 ; j<y ; j++){
			if(s[i-1] == t[j-1]){
				cout=0;
			}
			else{
				cout=1;
			}
			mat[i][j]=Math.min( mat[i-1][j]+1 , mat[i][j-1]+1 , mat[i-1][j-1]+cout )
		}
	}
	return mat[x-1][y-1];
	
}

function correct_word(mot, dictionnaire , precision ){
/*
 * Fonction qui corrige un mot
 */
	var mot_entre = mot.toLowerCase();
	faute = false;
	correction = false;
	var retour=mot;
	var i=0;
	
	if( typeof(precision)=='undefined' ){
		min=mot_entre.length+2;
	}
	else{
		min=precision;
	}
	
	if( !in_array(mot_entre, dictionnaire) ){ //Si le mot n'est pas dans le dictionnaire
		var distance = -1; //On va rechercher des distances de mots : pour l'instant, elle est à moins un.
		var suggestions = [];
		for (i=0 ; i<dictionnaire.length ; i++){
			if(dictionnaire[i] != ""){
				lev = levenshteinDistance(mot_entre, dictionnaire[i]);
				if(lev<=min){
					retour = dictionnaire[i];
					min=lev;
				}
			}
		}
	}
	
	return retour;
}

function correct_text(texte){
/*
 * Fonction qui applique à chaque mot la fonction correct_word
 */
	texte=texte+" ";
	var extrawords1 = new Array(" ", ",","-","#", "<", ">", "(", ")", ".", "/", "\\", "\"", "\n", "\r", "\t", ";", ":", "=", "'", "!", "?");
	var extrawords2 = new Array("l", "n", "qu", "d", "c", "s", "n", "t", "j", "m", "a", "à");
	var phrase=[];
	var mot="";
	for (var i=0 ; i<texte.length ; i++){
		if( in_array(texte[i],extrawords1) || ( in_array(texte[i],extrawords2) && texte[i+i]=="'" ) ){
			phrase.push(mot);
			if( in_array(texte[i],extrawords1)){
				phrase.push(texte[i]);
			}
			mot="";
		}
		else{
			mot=mot+texte[i];
		}
	}
	var dictionnaires = charge_dicos(phrase);
	var resultat = [];
	for (var i=0 ; i<phrase.length ; i++){
		var mot=phrase[i].toLowerCase();
		if( isNaN(mot) && !in_array(mot,extrawords1) && !in_array(mot,extrawords2) ){
			if(is_correct(mot)){
				var dico = name_dico(mot);
				resultat.push(correct_word(mot, dictionnaires[dico],2));
			}
			else{
				resultat.push(mot);
			}
		}
		else{
			resultat.push(mot);
		}
	}
	return resultat.join('');
}

function in_array(mot,table){
/*
Recherche le mot fournit en paramètre dans le tableau donnée. Retourne TRUE si trouvé False sinon
*/
	if (table != null){
		for (var i=0;i<table.length;i++){
			if(table[i]==mot){
				return true;
			}
		}
	}
	return false;
}

function charge_dicos(phrase){
/*
* Fonction qui charge les dictionnaires nécéssaires à la correction du texte
*/
	var extrawords = [" ", "#", "@", "-", ",", "<", ">", "(", ")", ".", "/", "\\", "\"", "\n", "\r", "\t", ";", ":", "=", "'", "!", "?", "l", "n", "qu", "d", "c", "s", "n", "t", "y", "j", "m", "a", "à"];
	var dico_a_charger = [];
	var test_key="hello";
	for (var i=0 ; i<phrase.length ; i++){
		var mot=phrase[i];
		if( (!in_array(mot, extrawords)) && is_correct(mot)  && isNaN(mot) && !in_array(name_dico(mot),dico_a_charger) ){
			//alert(mot+" : "+name_dico(mot));
			dico_a_charger.push(name_dico(mot));
		}
	}
	var dictionnaires = [];
	for (var i=0 ; i<dico_a_charger.length ; i++){
		var key = dico_a_charger[i];
		
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function (){
			if (xhttp.readyState == 4){
				var tmp=xhttp.responseText.split('\n');
				dictionnaires[key]=tmp.map(function(e){return e.trim();});
			}
		};
		try{
			xhttp.open("GET", "dictionnaire/"+key+".txt", false);
			xhttp.send();
		}
		catch(e){
			dictionnaires[key]=key;
		}
	}
	
	return dictionnaires;
}

function name_dico(mot){
/*
 * Fonction pour obtenir le nom du dictionnaire approprié
 */
	mot = no_accents(mot.toLowerCase());
	var length = mot.length;
	if (length < 2){
		return mot[0]+'.-.1-3';
	}
	else if (length > 26){
		return mot[0]+'.'+mot[1]+'25-27';
	}
	else{
		return mot[0]+'.'+mot[1]+'.'+(length-1)+'-'+(length+1);
	}
}

function is_correct(mot){
/*
* Fonction qui vérifie si les deux premiers caractères de chaque mot est bien une lettre ou un tiret
*/
	mot = no_accents(mot.toLowerCase());
	if (((mot.charCodeAt(0)>=97 && mot.charCodeAt(0)<=122) || (mot.charCodeAt(0)==45)) && ((mot.charCodeAt(1)>=97 && mot.charCodeAt(1)<=122) || mot.charCodeAt(1)==45)){
		return true;
	}
	else{
		return false;
	}
}

function no_accents(mot){
/*
* Fonction qui enlève les accent d'un mot
*/
	mot=mot.replace("à", "a");
	mot=mot.replace("ä", "a");
	mot=mot.replace("â", "a");
	mot=mot.replace("é", "e");
	mot=mot.replace("è", "e");
	mot=mot.replace("ê", "e");
	mot=mot.replace("ê", "e");
	mot=mot.replace("ë", "e");
	mot=mot.replace("ï", "i");
	mot=mot.replace("î", "i");
	mot=mot.replace("ö", "o");
	mot=mot.replace("ô", "o");
	mot=mot.replace("ü", "u");
	mot=mot.replace("û", "u");
	mot=mot.replace("ù", "u");
	mot=mot.replace("ç", "c");
	return mot;
}