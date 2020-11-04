# Structure des données

Les données en entrée de l'applications peuvent être sous deux formes: _simple_ ou _avancée_. Dans les deux cas l'application fonctionnera correctement, mais dans le deuxième cas, cela permets d'apporter plus de nuances notamment lors de l'affichage des informations liées aux evenements, mais nécéssite une structure plus complexe, voir une intervention auprès du code de l'application pour être affiché correctement.

## Préface

La totalité des structures présentés dans cette documentation sont détaillés (avec des exemples) dans la partie [API](#api).

## Cas Simple.

## API

### `index-actors.json`

`index-actors` est un objet contenant la liste de tous les acteurs disponibles à la recherche dans la base.

```json
{
  "__ID__": {
    "kind": "Actor",
    "id": __ID__,
    "label": __NOM__,
    "uri": __URL_REFERENCE__,
    "url": __URL_DATA__
  }
  /* ... */
}
```

#### Définition

- `__ID__` (type: `<number>`)  
   identifiant unique d'un Acteur
- `__NOM__` (type: `<string>`)  
   nom de l'acteur.
- `__URL_REFERENCE__` (type: `<url>`)  
   l'url vers la référence de la donnée, d'où elle est issue.
- `__URL_DATA__` (type: `<url>`)  
   l'url vers les données supplémentaires concernant l'acteur.
  l'url vers les données supplémentaires concernant l'acteur.
  l'url vers les données supplémentaires concernant l'acteur.
  l'url vers les données supplémentaires concernant l'acteur.
  l'url vers les données supplémentaires concernant l'acteur.

#### Exemple

```json
{
  "30764": {
    "kind": "Actor",
    "id": 30764,
    "label": "Batbie, Anselme",
    "uri": "http://symogih.org/resource/Actr30764",
    "url": "http://advanse.lirmm.fr/siprojuris/api/actor/30764/?format=json"
  },
  "40175": {
    "kind": "Actor",
    "id": 40175,
    "label": "Escarra, Jean",
    "uri": "http://symogih.org/resource/Actr40175",
    "url": "http://advanse.lirmm.fr/siprojuris/api/actor/40175/?format=json"
  }
}
```

---

### `index-localisations.json`

`index-localisations` est un objet contenant la liste de tous les lieux utilisés par le jeu de données.

```json
{
  "__ID__": {
    "kind": "CollectiveActor",
    "id": __ID__,
    "label": __NOM__,
    "uri": __URL_REFERENCE__,
    "url": __URL_DATA__
  }
  /* ... */
}
```

#### Définition

- `__ID__` (type: `<number>`)  
   identifiant unique d'un Acteur
- `__NOM__` (type: `<string>`)  
   nom du lieu.
- `__URL_REFERENCE__` (type: `<url>`)  
   l'url vers la référence de la donnée, d'où elle est issue.
- `__URL_DATA__` (type: `<url>`)  
   l'url vers les données supplémentaires concernant le lieu.

#### Exemple

```json
{
  "91": {
    "kind": "CollectiveActor",
    "id": 91,
    "label": "Collège de France",
    "uri": "http://symogih.org/resource/CoAc91",
    "url": "http://advanse.lirmm.fr/siprojuris/api/collective-actor/91/"
  },
  "838": {
    "kind": "NamedPlace",
    "id": 838,
    "label": "Bruxelles",
    "uri": "http://symogih.org/resource/NaPl838",
    "url": "http://advanse.lirmm.fr/siprojuris/api/named-place/838/?format=json"
  }
}
```

---

### `relations.json`

`relations` est un tableau contenant l'ensemble des liens (relations) entre les acteurs.

```json
[
  {
    "actors": [__ID_1__, __ID_2__],
    "loc": __ID_LOC__,
    "events": [__ID_EVENT_N__ /* ... */],
    "d": __DURATION__,
    "med": __MEDIAN__
  }
  /* ... */
]
```

#### Définition

- `__ID_1__` (type: `<number>`)
    <!-- TODO : REF index-actors -->
  identifiant du premier acteur de la relation .
- `__ID_2__` (type: `<number>`)
    <!-- TODO : REF index-actors -->
  identifiant du second acteur de la relation
- `__ID_LOC_` (type: `<number>`)
    <!-- TODO : REF index-localisations -->
  identifiant du lieu de la rencontre.
- `__ID_EVENT_1__, ..., __ID_EVENT_N__` (type: `<number>`)  
   identifiant des evenements responsable de la rencotre
- `__DURATION__` (type: `<number>`)  
   durée pendant la quelle les deux personnes se sont connues/vues
- `__MEDIAN__` (type: `<number>`)  
   date médiane de la relation. Date sous la forme d'un nombre (nombre de millisecondes depuis le 1 Janvier, 1970 UTC.)

#### Exemple

```json
[
  {
    "actors": [50077, 56390],
    "loc": 12531,
    "events": [101974, 108067, 116346],
    "d": 18,
    "med": -4798094400000
  },
  {
    "actors": [50077, 56801],
    "loc": 12531,
    "events": [101974, 110569],
    "d": 17,
    "med": -4925750400000
  }
]
```

---

### `graph.json`

`graph` est un tableau contenant la position de tous les acteurs sur le graphe global.

<!-- TODO: ref Graphe Global -->

```json
[
  {
    "index": __ID__,
    "label": __NOM__,
    "x": __POS_X__,
    "y": __POS_Y__,
    "width": __WIDTH__,
    "height": __HEIGHT__
  }
  /* ... */
]
```

#### Définition

- `__ID__` (type: `<number>`)
    <!-- TODO : REF index-actors -->
  identifiant de l'acteur.
- `__NOM__` (type: `<number>`)
    <!-- TODO : REF index-actors -->
  nom de l'acteur affiché par le graphe
- `__POS_X__`, `__POS_Y__` (type: `<number>`)
    <!-- TODO : REF index-localisations -->
  coordonnées du noeud sur le graphe.
- `__WIDTH__`, `__HEIGHT__` (type: `<number>`)  
   dimensions
  dimensions
  dimensions
  dimensions
  dimensions
- `__DURATION__` (type: `<number>`)  
   durée pendant la quelle les deux personnes se sont connues/vues
- `__MEDIAN__` (type: `<number>`)  
   date médiane de la relation. Date sous la forme d'un nombre (nombre de millisecondes depuis le 1 Janvier, 1970 UTC.)

#### Exemple

```json
[
  {
    "index": 30764,
    "label": "Batbie A.",
    "x": 2072.0088110289707,
    "y": 1093.791822982072,
    "width": 63,
    "height": 20
  },
  {
    "index": 40175,
    "label": "Escarra J.",
    "x": 1451.0732981499607,
    "y": 1608.3109673898746,
    "width": 64,
    "height": 20
  }
]
```
