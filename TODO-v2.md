# TODO v2 : Inspirations Scala/Haskell pour Undumbed


## Array (et collections)
- [x] `partition` (séparer selon un prédicat)
- [x] `collect` (map + filter en un seul passage)
- [x] `sliding` (fenêtres glissantes)
- [x] `scanLeft` / `scanRight` (accumulateurs intermédiaires)
- [x] Helpers paresseux : générateurs/itérateurs

## Object
- [x] `merge` / `mergeWith` (fusionner deux objets, avec ou sans fonction de résolution de conflit)
- [x] `deepMerge` (fusion profonde)
- [x] `pick` / `omit` (sélection ou exclusion de clés)
- [x] `keys`, `values` (helpers explicites)
- [x] `invert` (échanger clés/valeurs)
- [x] `mapKeys`, `mapValues` (transformer uniquement les clés ou les valeurs)

## Try
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