/*
Lemmatiseur écrit en javascript. Peut contenir des erreurs.
Les fichiers servant à la lemmatisation sont dans le dossier "lemm".
_ autre.json : contient des mots à lemmatiser.
	Ce fichier peut être modifier afin d'ajouter d'autre mots.
	En 0 : le mot non lemmatisé
	En 1 : la lemmatisation du mot en 0
_ pro_per : contient tous les pronom personnelle avec leur lemmatisation
_ term_s : liste de mot aidant pour les pluriels des mots 
_ verbe (original) : contient une liste de verbe conjugué de base (ex : j'abondonne)
_ verbe : contient une liste de verbe conjugué utilisé par la lemmatisation (ex : je abondonne)


Mail : ponnaka.tith@gmail.com
*/
function find_index(mot , table , dim){
/*
Recherche le mot dans le tableau donnée. Retourne l'index si trouvé -1 sinon
*/
	var current
	if (table != null){
		for (var i=0;i<table.length;i++){
			if (dim == 1){
				current=table[i];
			}
			if (dim == 2){
				current=table[i][0];
			}
			if(current==mot){
				return i;
			}
		}
	}
	return -1;
}

function lemm(texte){
/*
Fonction qui applique à chaque mot la fonction correct_word
 */
	texte=texte.toLowerCase();
	texte = texte.split("'").join("e ");
	texte = texte.split("’").join("e ");
	
	var extrawords1 = new Array(" ", "-", ",", "<", ">", "(", ")", ".", "/", "\\", "\"", "\n", "\r", "\t", ";", ":", "=", "'", "!", "?");
	var phrase=[];
	var mot="";
		
	for (var i=0 ; i<texte.length ; i++){
		if( in_array(texte[i],extrawords1) ){
			phrase.push(mot);
			phrase.push(texte[i]);
			mot="";
		}
		else{
			mot=mot+texte[i];
		}
	}
	
	var stemm=new Array(phrase.length);
	var pos_sujet=[];
	
	for (var i=0 ; i<phrase.length ; i++){
		mot=phrase[i];
		if( isNaN(mot) && !in_array(mot,extrawords1) ){
			info = nature(mot);
			phrase[i]=info[0];
			stemm[i]=info[1];
			if(stemm[i]=='sujet'){
				if ( phrase[i]!="il" && phrase[i]!="elle" && phrase[i]!="on" && find_index( phrase[i] , pos_sujet , 1 ) == -1 ) {
					pos_sujet.push(phrase[i]);
				}
			}
		}
		else{
			stemm[i]='autre';
		}
	}
	pos_sujet.push("il/elle");
	pos_sujet.push(null);
	
	for (var i=0 ; i<stemm.length ; i++){
		if (stemm[i] == null){
			for(var j=0 ; j<pos_sujet.length ; j++){
				mot=phrase[i];
				var tmp = verbe(pos_sujet[j] , mot);
				if (tmp != mot){
					phrase[i]=tmp;
					break;
				}
			}
		}
	}
	
	return phrase.join('');
	
}

function verbe(sujet , mot){
	var retour=null;
	var xhttp = new XMLHttpRequest();
	var conjugue=null;
	var tmp=null;
	var find=null;
	xhttp.onreadystatechange = function (){
		if (xhttp.readyState == 4){
			var data = eval('(' + xhttp.responseText + ')');
			//var data = xhttp.responseText.split('\n');
			
			for(var i=0 ; i<data.length ; i++){
				for(var j=0 ; j<data[i][0].length ; j++){
					conjugue=data[i][0][j];
					if(sujet!=null){
						if (conjugue == sujet+" "+mot){
							if (retour == null){
								retour=data[i][1];
							}
							else{
								retour += "|"+data[i][1];
							}
						}
					}
					else {
						if(mot[mot.length-1] == "s"){
							tmp = mot.substr(0,mot.length-1);
						}
						else{
							tmp = mot;
						}
						if( conjugue.search(" "+tmp) != -1 ) {
							find=conjugue.substr(conjugue.search(" "+tmp)+1);
							if(tmp.length == find.length){
								retour=data[i][1];
								break;
							}
						}
					}
				}
			}
		}
	};
	xhttp.open("GET", "lemm/verbe.json" , false);
	xhttp.send();
	if(retour == null){retour=mot};
	return retour;
}

function nature(mot){
/*
Fonction qui renvoie le lemme et la nature du mot : sujet, autre ou null
*/
	var l = mot.length;
	var deb=mot[0];
	var fin=mot[l-1];
	var termi = mot.substr(-4);
	var resulat=[mot,null];
	var flag=0;
	
	if(mot=="me" || mot == "te"){
		resulat = ['se','autre'];
		flag=1;
	}
	else if ( (deb=="j" || deb=="t" || deb=="i" || deb=="e" || deb=="o" || deb=="n" || deb=="v") && l<=5){
		if( open_dico(mot , "pro_per.json" , 2) != null ){
			resulat = [open_dico(mot , "pro_per.json" , 2)[1],'sujet'];
			flag=1;
		}
	}
	else if(flag==0){
		if( open_dico(mot , "autre.json" , 2) != null ){
			resulat = [ open_dico(mot , "autre.json" , 2)[1],'autre'];
			flag=1;
		}
	}
	
	if (flag==0){
		if(fin == "s" || fin == "x"){
			verif=open_dico(mot , "term_s.json" , 2)
			if ( verif != null ){
				resulat = [verif[1] , "autre"];
			}
			else if(termi.substr(1) == "aux" && termi[0] != "e"){
				mot=mot.substr(0,l-3)+"al";
				resulat = [mot , 'autre']
			}
			else{
				resulat = [mot.substr(0,l-1) , null];
			}
		}
	}
	
	return resulat;
	
}

function open_dico(mot,dico,dim){
	var index;
	var retour=null;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function (){
		if (xhttp.readyState == 4){
			var data = eval('(' + xhttp.responseText + ')');
			index = find_index(mot,data,dim) ;
			if (index != -1 ){
				if (dim == 1){
					retour=data[index];
				}
				else if (dim == 2){
					retour=data[index];
				}
				else {
					retour=null;
				}
			}
		}
	};
	xhttp.open("GET", "lemm/"+dico, false);
	xhttp.send();
	
	return retour;
}




























