#TDD - TestDrivenDevelopment

##Risiko (bzw rundenbasiertes StrategieSpiel)

>Hier sollte die Spielanleitung rein um daraus die Testfälle zu entwickeln!

>v1.0

###Regeln
####Spielanfang
Zu beginn des Spieles wird die Startreiehenfolge zufällig bestimmt. Bei gleichen Zufallswerten werden diese neu generiert. Spieler mit einem höheren Wert kommen zuerst dran.  

####Spielablauf
Jeder Spieler hat 4 Phasen in seinem Zug, die Spieler kommen nach der Reihe dran.

#####Phase 1 - Einheiten rekrutieren
In dieser Phase hat der Spieler neue Einheiten zu rekrutieren. Die Anzahl der neuen Rekruten entspricht:

Anzahl der Länder / 3 (Wird abgerundet)

Dabei ist zu beachten, dass jeder Spieler unabhängig der Anzahl der Länder immer mindestens 3 neue Einheiten bekommt.

#####Phase 2 - Befreien anderer Länder
In dieser Phase hat der Spieler die Möglichkeit andere Länder, welche an seinen angrenzen, anzugreifen. Hierbei ist zu beachten, dass man immer mindestens 2 Einheiten für einen Angriff im Gebiet braucht und mindestens 1 Einheit in einem Land stationiert sein muss.

#####Phase 3 - Truppen bewegen
Nach der Befereiungsphase dürfen Truppen zwischen den eigenen Ländergrenzen verschoben werden. Dabei darf eine beliebige Amzahl an Einheiten in ein anderes Gebiet bewegt werden, solange mindestens eine Einheit im Ursprungsgebiet bestehen bleibt und das Zielgebiet mit dem Ursprungsgebiet verbunden ist. Diese Aktion darf lediglich einmal pro Phase ausgeführt werden.

#####Phase 4 - Einheiten gruppieren

###Ziel
Das Ziel des Spiels ist es, alle Gebiete der Karte zu okkupieren und danach den endlosen Weltfrieden zu bewahren.

####Einheiten
Einheiten gibt es in verschiedenen Klassen.
#####Klassen
######Standart
Standartklasse
######Ultra
Ultraklasse
