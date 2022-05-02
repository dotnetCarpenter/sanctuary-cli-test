'use strict'

import S                           from 'sanctuary'
import { Flag, Option, parseArgs } from 'sanctuary-argv'
import API                         from './index.js'

// const Required = setter => value =>

/**   updateHost :: (Maybe String -> Maybe String) -> Options -> Options */
const updateHost = f => opts => ({...API.config, dbHost: f (opts.dbHost) })

/**   updatePort :: (Maybe String -> Maybe String) -> Options -> Options */
const updatePort = f => opts => ({...API.config, dbPort: f (opts.dbPort) })

/**   dbHost :: Handler Configuration */
const dbHost = Option (S.pair (opts => host =>
	S.isLeft (opts.dbPort) == null
	? S.Left (`${S.show (host)} is required`)
	: S.Right (updateHost (S.K (S.Just (host))))
))

const dbPort = Option (S.pair (opts => port =>
	port = null
	? S.Left (`${S.show (port)} is required`)
	: S.Right (updatePort (S.K (S.Just (port))))
))

//    spec :: StrMap (Handler Configuration)
const spec = {
	'-h':	dbHost,	'--host':	dbHost,
	'-p':	dbPort, '--port':	dbPort,
}

/**   parse :: Array String -> Either String (Pair Options (Array String)) */
const parse = S.pipe ([
	S.Pair (API.config),
	parseArgs (spec)
])

console.debug (
	parse (process.argv.slice (2))
)
