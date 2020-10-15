# Structure des données

> Quelles données entrantes dans l'application

Afin de fonctionner correctement, l'application utilise 5 source de données sous format JSON.

1. Liste des références des Acteurs, nommé `RefActors`
2. Liste des références des Lieux, nommé `RefLocalisations`
3. Liste des relations entre les individus `Links`
4. Position des differentes Acteurs sur le graphe d'ensemble, `Graph`
5. Détail des evènements pour chaque acteur. `ActorEvents`

> A quoi servent les differentes données ?

## Referencer les acteurs disponibles à la recherche

`RefActors` est une source qui est utilisée plusieurs fois à des fins differents.

L'une d'entre elles, et la plus importante est de référencer tous les acteurs disponibles. C'est utilisé par exemple dans le champ d'autocompletion situé en haut à gauche de l'application:
![autocompletion](./docs/img/autocompletion.png)

La structure est assez simple car il ne contient que peu d'informations concernant la ressource:

> **Exemple**: `ref-actors.json`
> ```json
> {
>   "30764": {
>     "kind": "Actor",
>     "id": 30764,
>     "label": "Batbie, Anselme",
>     "uri": "http://symogih.org/resource/Actr30764",
>     "url": "http://advanse.lirmm.fr/siprojuris/api/actor/30764/"
>   },
>   "40175": {
>     "kind": "Actor",
>     "id": 40175,
>     "label": "Escarra, Jean",
>     "uri": "http://symogih.org/resource/Actr40175",
>     "url": "http://advanse.lirmm.fr/siprojuris/api/actor/40175/"
>   },
> }
> ```

> **Définition**: `ref-actors.json`
>
> De manière plus générique la structure JSON est:
> ```json
> {
>     ID : {
>         "kind": "Actor",
>         "id": ID,
>         "label": NOM_PERSONNE,
>         "uri": LIEN_REFERENCE,
>         "url": LIEN_DONNEES
>     }
> }
> ```
> 
> Comme on peut le constater, chaque entité (`Ressource`) est identifiée par une clé unique `ID`.
>
> `LIEN_REFERENCE` représente la source d'où les données ont étés extraites (ici: depuis symogih).
>
> `LIEN_DONNEES` represente où les données sur cet acteur pourront être récupérés sous format JSON. 

---

## Afficher la vue d'ensemble

![vue d'ensemble](./docs/img/vue_ensemble.png)

Afin d'afficher la vue d'ensemble, nous utilisons `Graph`.

> **Exemple**: `graph.json`
> 
> ```json
> [
>   {
>     "index": 30764,
>     "label": "Batbie A.",
>     "x": 2072.0088110289707,
>     "y": 1093.791822982072,
>     "width": 63,
>     "height": 20
>   },
>   {
>     "index": 40175,
>     "label": "Escarra J.",
>     "x": 1451.0732981499607,
>     "y": 1608.3109673898746,
>     "width": 64,
>     "height": 20
>   },
> ]
> ```


> **Définition**: `graph.json`
> 
> ```json
> [
>   {
>     "index": ID,
>     "label": NOM_PERSONNE,
>     "x": COORD_X,
>     "y": COORD_Y,
>     "width": LARGEUR,
>     "height": HAUTEUR
>   }
> ]
> ```
>
> `NOM_PERSONNE` est le nom qui sera affiché dans la vue d'ensemble.
> Dans notre exemple, le nom est raccourci afin d'éviter de surcharger
> l'interface
>
> `COORD_X`, `COORD_Y` représentent les coordonnées.
> `HAUTEUR`, `LARGEUR` représentent les dimensions de la boite:
> ![description vue d'ensemble](./docs/img/zoom_vue_ensemble.png)

---

## Lors de l'ajout d'un Acteur, récuperer tous les évènements associés

Grâce à [`RefActors`](#referencer-les-acteurs-disponibles-à-la-recherche) pour récuperer les evenements associes à un acteur, il suffit de les récuperer via l'url fourni (exemple: http://advanse.lirmm.fr/siprojuris/api/actor/40175/).

Cet url retourne alors tous les evenements associés à cet acteur.

Ces evenements sont groupés par leur catégorie (naissance, décès, obtention de qualité, ...). C'est ce qu'on appellera des *sets*

> **IMPORTANT**: Je vais introduire une notation particulière qui n'est pas du JSON pour représenter des données qui peuvent être manquantes :
>
> Exemple: 
> ```json
> {
>     "id": ID,
>     "label": NOM,
>     "information"?: OPTIONNEL
> }
> ```
>
> Dans cet exemple, j'utiliserais `?` pour representer le fait que `information` peut ne pas exister.

> Ces deux alternatives sont corrects
> <div style="display: flex; flex: 1;">
> <pre><code>{
>     "id": ID,
>     "label": NOM,
>     "information"?: OPTIONNEL
> }</code></pre></div>
>