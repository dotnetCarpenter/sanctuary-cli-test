'use strict'

import S                     from 'sanctuary'
import { Option, parseArgs } from 'sanctuary-argv'
import API                   from './index.js'
import {
	Any,
	RequiredField,
	validateRequiredField,
}                            from './requiredField.js'

// Option        :: Validator a -⁠> Handler a
// Validator     :: String -> Either String (Setter a)
// Setter        :: Configuration a => a -> a
// Handler       :: Either (Setter a) (Validator a)
// Configuration :: StrMap (Either String String)

/**   dbHost :: Handler Configuration */
const dbHost = Option (Any (S.Right) ('dbHost'))

/**   dbPort :: Handler Configuration */
const dbPort = Option (Any (S.Right) ('dbPort'))

/**   dbName :: Handler Configuration */
const dbName = Option (Any (S.Right) ('dbName'))

/**   dbUser :: Handler Configuration */
const dbUser = Option (Any (RequiredField ('dbPassword')) ('dbUser'))

/**   dbPassword :: Handler Configuration */
const dbPassword = Option (Any (RequiredField ('dbUser')) ('dbPassword'))

/**   spec :: StrMap (Handler Configuration) */
const spec = {
	'-h':	dbHost,      	'--host':	dbHost,
	'-p':	dbPort,       '--port':	dbPort,
	'-n': dbName,       '--name': dbName,
	'-u': dbUser,       '--user': dbUser,
	'-w': dbPassword,   '--password': dbPassword,
}

/**   parse :: Array String -> ? */
const parse = S.pipe ([
	S.Pair (API.config),
	parseArgs (spec),
  // Either (Pair (StrMap (Either String String)) (Array String))
  S.either (S.K (`Argument not recognized.\nUsage: ${JSON.stringify (spec)}`))
           (S.pair (config => _ => validateRequiredField (config)))
])

console.debug (
	parse (process.argv.slice (2))
)
