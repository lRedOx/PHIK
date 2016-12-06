import sys # nécessaire pour avoir des précisions sur les erreurs se produisant
            #lors d'un accès fichier
import os # nécessaire pour la gestion de dossiers

def between_sting(string, start, stop, exclude=False):
    a=string.find(start)
    if a != -1:
        b=string[a:].find(stop)+a+len(stop)
        if exclude != False:
            a=a+len(start)
            b=b-len(stop)
        return string[a:b]
    else:
        return ""

def modif(path , new):
    file1 = open(path,'r')
    file2 = open(new,'w')
    liste_verbe=[]
    count=0
    total=0
    file2.write ('[\n')
    for line in file1:
        total=total+1
        verbe = between_sting(line , '"verbe": ' , '}', True)
        if not(verbe in liste_verbe):
            print(verbe)
            inflections=[]
            count=count+1
            liste_verbe.append(verbe)
            part = between_sting(line , ', "inflections": [' , ']}', True)
            while part != "":
                line = line.replace(', "inflections": ['+part+']}','')
                tmp = part.split(",")
                part = between_sting(line , ', "inflections": [' , ']}', True)
                for elt in tmp:
                    if not(elt in inflections):
                        inflections.append(elt)
            ajout=','.join(inflections)
            file2.write ('\t{\n')
            file2.write ('\t\t"0": ['+ajout+'],\n')
            file2.write ('\t\t"1": '+verbe+'\n')
            file2.write ('\t},\n')
    file2.write (']')
    print(count,'/',total)
    file1.close()
    file2.close()
    

# Tests locaux
if __name__ == "__main__":
    modif('F:/verbe.json' , 'new.json' )












    
