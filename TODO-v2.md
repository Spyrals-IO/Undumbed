# TODO v2 : Inspirations Scala/Haskell pour Undumbed

## Option / Maybe
- [ ] Implémenter un type `Option` (ou `Maybe`) simple
- [ ] Méthodes : `map`, `flatMap`, `getOrElse`, `isDefined`, `isEmpty`, `fold`, `toArray`, `toNullable`
- [ ] Helpers : `fromNullable`, `fromPredicate`, `tryCatch` (retourne Option)

## Array (et collections)
- [ ] `find`, `findIndex`, `forall` (every), `exists` (some)
- [ ] `partition` (séparer selon un prédicat)
- [ ] `collect` (map + filter en un seul passage)
- [ ] `sliding` (fenêtres glissantes)
- [ ] `scanLeft` / `scanRight` (accumulateurs intermédiaires)
- [ ] `headOption` / `lastOption` (retourne Option)
- [ ] `flattenDeep` (aplatissement récursif)
- [ ] Helpers paresseux : générateurs/itérateurs

## Object
- [ ] `merge` / `mergeWith` (fusionner deux objets, avec ou sans fonction de résolution de conflit)
- [ ] `deepMerge` (fusion profonde)
- [ ] `pick` / `omit` (sélection ou exclusion de clés)
- [ ] `keys`, `values` (helpers explicites)
- [ ] `invert` (échanger clés/valeurs)
- [ ] `mapKeys`, `mapValues` (transformer uniquement les clés ou les valeurs)

## Try
- [ ] `toOption` (retourne Option si succès, None sinon)
- [ ] `isSuccess` / `isFailure`
- [ ] `fold` (pattern matching fonctionnel : `fold(onError, onSuccess)`)
- [ ] `filter` (échoue si le prédicat n'est pas vérifié)
- [ ] `tap` / `tapError` (side-effects sans casser la chaîne)

## Functions
- [ ] `constant` (retourne toujours la même valeur)
- [ ] `curry` / `uncurry`
- [ ] `pipe` (composition gauche-droite)
- [ ] `memoize`
- [ ] `once` (n'exécute qu'une fois)
- [ ] `partial` (application partielle)

## Types
- [ ] `isPrimitive`
- [ ] `isPromise`, `isIterable`, `isGenerator`
- [ ] `isFrozen`, `isSealed` 