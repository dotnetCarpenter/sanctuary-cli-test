'use strict'

import S                     from 'sanctuary'
import { Option, parseArgs } from 'sanctuary-argv'
import API                   from './index.js'

// Option        :: Validator a -⁠> Handler a
// Validator     :: String -> Either String (Setter a)
// Handler       :: Either (Setter a) (Validator a)
// Configuration :: StrMap (Either String String)

/**   Any :: (a -> b) -> String -> StrMap b -> Right (StrMap b) */
const Any = of => key => (
	S.pipe ([
		of,
		S.insert (key),
		S.Right,
	])
)

// const Any = of => key => value => (
// 	S.Right (S.insert (key) (of (value)))
// )

// const Any = f => key => value => S.Right (options => ({
// 	...options,
// 	[key]: f (value)
// }))

/**   dbHost :: Handler Configuration */
const dbHost = Option (Any (S.Right) ('dbHost'))

/**   dbPort :: Handler Configuration */
const dbPort = Option (Any (S.Right) ('dbPort'))

/**   dbName :: Handler Configuration */
const dbName = Option (Any (S.Right) ('dbName'))

/**   dbUser :: Handler Configuration */
const dbUser = Option (Any (S.Right) ('dbUser'))

/**   dbPassword :: Handler Configuration */
const dbPassword = Option (Any (S.Right) ('dbPassword'))


//    spec :: StrMap (Handler Configuration)
const spec = {
	'-h':	dbHost,      	'--host':	dbHost,
	'-p':	dbPort,       '--port':	dbPort,
	'-n': dbName,       '--name': dbName,
	'-u': dbUser,       '--user': dbUser,
	'-w': dbPassword,   '--password': dbPassword,
}

/**   parse :: Array String -> Either String (Pair Options (Array String)) */
const parse = S.pipe ([
	S.Pair (API.config),
	parseArgs (spec)
])

console.debug (
	parse (process.argv.slice (2))
)
