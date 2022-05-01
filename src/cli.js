'use strict'

import S                           from 'sanctuary'
import { Flag, Option, parseArgs } from 'sanctuary-argv'
import API                         from './index.js'

// Option        :: Validator a -⁠> Handler a
// Validator     :: String -> Either String (Setter a)
// Handler       :: Either (Setter a) (Validator a)
// Configuration :: StrMap

/**   Required :: (Maybe String -> Maybe String) -> a -> Handler a */
const Required = (setter => value =>
  value == null
  ? S.Left (`${S.show (value)} is required`)
  : S.Right (setter (S.K (S.Just (value))))
)

/**   update :: String -> (Maybe String -> Maybe String) -> Options -> Configuration */
const update = key => f => options => ({...options, [key]: f (null)})

/**   dbHost :: Handler Configuration */
const dbHost = Option (Required (update ('dbHost')))

/**   dbPort :: Handler Configuration */
const dbPort = Option (Required (update ('dbPort')))

/**   dbName :: Handler Configuration */
const dbName = Option (Required (update ('dbName')))

/**   dbUser :: Handler Configuration */
const dbUser = Option (Required (update ('dbUser')))

/**   dbPassword :: Handler Configuration */
const dbPassword = Option (Required (update ('dbPassword')))

/**   spec :: StrMap (Handler Configuration) */
const spec = {
  '-h':	dbHost,     '--host':	dbHost,
  '-p':	dbPort,     '--port':	dbPort,
  '-n':	dbName,     '--name':	dbName,
  '-u':	dbUser,     '--user':	dbUser,
  '-w':	dbPassword, '--password':	dbPassword,
}

/**   parse :: Array String -> Either String (Pair Options (Array String)) */
const parse = S.pipe ([
  S.Pair (API.config),
  parseArgs (spec)
])

console.debug (
  parse (process.argv.slice (2))
)
