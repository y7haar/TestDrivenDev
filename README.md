#TDD - TestDrivenDevelopment

##Risiko (bzw rundenbasiertes StrategieSpiel)

>Hier sollte die Spielanleitung rein um daraus die Testfälle zu entwickeln!

>v0.0.3

###Regeln

####Spielvorbereitung
Vor dem Spiel haben die Spieler die Möglichkeit, sich für eine Farbe und einen Namen zu entscheiden.

####Spielanfang
Zu beginn des Spieles wird die Startreiehenfolge zufällig bestimmt. Bei gleichen Zufallswerten werden diese neu generiert. Spieler mit einem höheren Wert kommen zuerst dran.  

Die Gebiete werden den Spielern zufällig zugewiesen. Dabei erhält jeder Spieler (wenn möglich) die gleiche Anzahl an Gebieten. Ist eine faire Aufteilung nicht möglich, werden die übrigen Gebiete an eine weitere neutrale Fraktion verteilt. Diese Fraktion verhält sich komplett passiv und greift nicht in das Spielgeschehen ein.

Nach der Verteilung können die Spieler ihre Gebiete mit zusätzlichen Einheiten verstärken. Die Anzahl der zusätzlichen Einheiten hängt von der Anahl der eigenen Gebiete ab.

####Spielablauf
Jeder Spieler hat 4 Phasen in seinem Zug, die Spieler kommen nach der Reihe dran. Ist ein Spieler mit seiner letzten Phase fertig, kommt der nächste Spieler an den Zug.

#####Phase 1 - Einheiten rekrutieren
In dieser Phase hat der Spieler neue Einheiten zu rekrutieren. Die Anzahl der neuen Rekruten entspricht:

*Anzahl der Länder / 3 (Wird abgerundet)*

Dabei ist zu beachten, dass jeder Spieler unabhängig der Anzahl der Länder immer mindestens 3 neue Einheiten bekommt.

#####Phase 2 - Befreien anderer Länder
In dieser Phase hat der Spieler die Möglichkeit andere Länder, welche an seinen angrenzen, anzugreifen. Es können mehrere Angriffe in der Befreiungsphase ausgeführt werden.

**Angriff**
Beim Angriff ist zu beachten, dass man immer mindestens 2 Einheiten für einen Angriff im Gebiet braucht und mindestens 1 Einheit in einem Land stationiert sein muss. 

Ein Angriff erfolgt immer von einem eigenen Land in ein anderes direkt benachbartes Land, welches feindlich kontrolliert wird.

Der Angreifer kann entscheiden, mit wie vielen Einheiten angegriffen wird. Maximal kann mit 3 Einheiten gleichzeitig angegriffen werden, sofern genügend Einheiten im Heimatland zur Verfügung stehen.

**Verteidigung**
Der Verteidiger kann entscheiden, mit wie vielen Einheiten ein Angriff abgewehrt wird. Das Maximum der Einheiten beträgt 2, wenn genügend Einheiten in dem angegriffenen Gebiet sind.


**Berechnung des Kampfs**
>TODO


#####Phase 3 - Truppen bewegen / verstärken
Nach der Befereiungsphase dürfen Truppen zwischen den eigenen Ländergrenzen verschoben werden. Dabei darf eine beliebige Amzahl an Einheiten in ein anderes Gebiet bewegt werden, solange mindestens eine Einheit im Ursprungsgebiet bestehen bleibt und das Zielgebiet mit dem Ursprungsgebiet verbunden ist. Diese Aktion darf lediglich einmal pro Phase ausgeführt werden.

#####Phase 4 - Buffs / Verstärkende Items
>In der Phase hat der Möglichkeit, unterstützende Items oder ähnliches zu ergattern oder einzusetzen. 
>Einzelheiten stehen noch nicht fest.

###Ziel
Das Ziel des Spiels ist es, alle Gebiete der Karte zu okkupieren und danach den endlosen Weltfrieden zu bewahren. Hat dies ein Spieler geschafft, endet das Spiel.

###Niederlage
Besitzt ein Spieler keine Gebiete mehr und hat alle Einheiten verloren, hat der Spieler das Spiel verloren und nimmt nun nicht mehr am Spielgeschehen teil. 


**Folgende Informationen sind optional und noch nicht komplett ausgearbeitet.**
