import S from 'sanctuary'

// version 1
//       Any :: (a -> b) -> String -> a -> Right (Setter b) -> Right (StrMap)
// const Any = f => key => value => S.Right (options => ({
// 	...options,
// 	[key]: f (value)
// }))

// version 2
// const Any = of => key => value => (
// 	S.Right (S.insert (key) (of (value)))
// )

/**   Any :: Applicative f => f -> String -> a -> Right (Setter (StrMap a)) -> Right (StrMap a) */
const Any = typeRep => key => (
	S.pipe ([
		S.of (typeRep),
		S.insert (key),
		S.Right,
	])
)

const RequiredField = key => value => (
	Object.assign (Object.create (S.Right (value)), {
		'requiredField': key,
	})
)

/**   validateRequiredField :: Configuration -> Boolean */
const validateRequiredField = config => {
	const required = S.filter (x => x.requiredField !== undefined) (config)

	return S.all (x => config[x.requiredField].value !== '')
							 (required)
}

export {
	Any,
	RequiredField,
	validateRequiredField,
}
