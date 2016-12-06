/*
	feel.js
	.js qui contient la fonction qui calcule pour chaque mot le sentiment en parcourant le dictionnaire FEEL.json
*/

	

function feel_tweets(texte){
	
	var tab_feel = [0,0,0,0,0,0,0];
	var compt_mot_traite = 0;
	
	//OUVERTURE FEEL.json
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function (){ //OPEN REUSSI
		if (xhttp.readyState == 4){
			var data = eval('(' + xhttp.responseText + ')'); //CONTENU DE FEEL.json

			
				table = texte.split(" "); //SPLIT TWEET
		
				var expression = table[0];
				var flag=0;
				var sousdico=[];
				var finalexp = null;


					for(var i=0 ; i < table.length ; i++){ //PARCOURS DES MOTS DU TWEET

						sousdico=[];
						for(var j=0 ; j < data.length ; j++){ //PARCOURS DU DICO FEEL
							//alert(2);
							//alert(data[j]["word"]);
							var word = data[j]["word"];
							//alert(expression);
							if(word.indexOf(expression) != -1){
								//alert(3);
								sousdico.push(data[j]); //CREATE DICO
								
							}
							if(word == expression){ //EXPRESSION = EXPRESSION DANS FEEL.JSON
								flag = i;
								finalexp = data[j]; //GARDER L'EXPRESSION DU JSON EN MEMOIRE
							}	
						}
						
						if(sousdico.length == 0){ //EXPRESSION NON-TROUVEE
							//alert("dico vide");
							expression = table[i+1]; //NEXT WORD

							if(finalexp != null){ //SI EXPRESSION D'AVANT EST TROUVEE
								if(finalexp["joy"] == 0 && finalexp["sadness"] == 0 //EXPRESSION NEUTRE = PAS DE COMPTEUR
								&& finalexp["anger"] == 0 && finalexp["fear"] == 0
								&& finalexp["disgust"] == 0 && finalexp["surprise"]==0){
									compt_mot_traite += 0
								}
								else{
									compt_mot_traite = compt_mot_traite + 1; //COMPTEUR D'EXPRESSIONS EVALUEES
								}
								//CALCULS FELLS
								tab_feel[0] += finalexp["joy"];
								tab_feel[1] += finalexp["sadness"];
								tab_feel[2] += finalexp["anger"];
								tab_feel[3] += finalexp["fear"];
								tab_feel[4] += finalexp["disgust"];
								tab_feel[5] += finalexp["surprise"];
								if( finalexp["polarity"]=='positive' ){tab_feel[6] += 1;}
								if( finalexp["polarity"]=='negative' ){tab_feel[6] -= 1;}
								finalexp = null;

							}

							else{
								//alert(7);
								i = flag;
								flag =flag+1;
								expression = table[flag]; //WORD BEFORE TO FIND ANOTHER EXPRESSION
								//alert("new : "+expression);
							}
						}
						if(sousdico.length == 1){ // SI SOUSDICO = 1
							if(expression == sousdico[0]["word"]){ //EXPRESSION TROUVEE
								//alert("dico == 1 bon");
								//alert(9);
								expression = table[i+1] //NEXT WORD
								flag = i + 1;
								
								
								if(finalexp["joy"] == 0 && finalexp["sadness"] == 0 //EXPRESSION NEUTRE = PAS DE COMPTEUR
								&& finalexp["anger"] == 0 && finalexp["fear"] == 0
								&& finalexp["disgust"] == 0 && finalexp["surprise"]==0){
									compt_mot_traite += 0
								}
								else{
									compt_mot_traite = compt_mot_traite + 1; //COMPTEUR D'EXPRESSIONS EVALUEES
								}
								//CALCULS FELLS
								tab_feel[0] += finalexp["joy"];
								tab_feel[1] += finalexp["sadness"];
								tab_feel[2] += finalexp["anger"];
								tab_feel[3] += finalexp["fear"];
								tab_feel[4] += finalexp["disgust"];
								tab_feel[5] += finalexp["surprise"];
								if( finalexp["polarity"]=='positive' ){tab_feel[6] += 1;}
								if( finalexp["polarity"]=='negative' ){tab_feel[6] -= 1;}
										
								finalexp = null;
							}

							else{ //EXPRESSION NON-TROUVEE
								//alert("dico == 1 pas bon");
								expression = expression + " " + table[i+1]; //ADD NEXT WORD IN EXPRESSION
							}
						}


						if(sousdico.length > 1){ // SI SOUSDICO > 1
							//alert("dico >1");
							expression = expression + " " + table[i+1]; //ADD NEXT WORD IN EXPRESSION
						}

					}
				
				if (compt_mot_traite == 0){
					tab_feel = [0,0,0,0,0,0,0]
				}
				else{
					//CACUL POURCENTAGE FINAL DU TWEET
					tab_feel[0] = 100*tab_feel[0]/compt_mot_traite;
					tab_feel[1] = 100*tab_feel[1]/compt_mot_traite;
					tab_feel[2] = 100*tab_feel[2]/compt_mot_traite;
					tab_feel[3] = 100*tab_feel[3]/compt_mot_traite;
					tab_feel[4] = 100*tab_feel[4]/compt_mot_traite;
					tab_feel[5] = 100*tab_feel[5]/compt_mot_traite;
					tab_feel[6] = 100*tab_feel[6]/compt_mot_traite;
				}
				
				return tab_feel; // RETURN DU TABLEAU DES SENTIMENTS DU TWEET
			
		}
	};
	xhttp.open("GET", "Feel/FEEL.json", false);
	xhttp.send();
	return tab_feel;

}




