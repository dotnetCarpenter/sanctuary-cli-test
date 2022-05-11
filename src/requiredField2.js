import S from 'sanctuary'
import $ from 'sanctuary-def'

const RequiredField = key => value => S.Right ({value, 'requiredField': key})

// 1. get all fields
// 2. check that 'requiredField' is a field in fields
// 3. check that field has a value

/**   prop :: String -> Object -> Any */
const prop = p => o => o[p]

/**   validateRequiredField :: Configuration -> Boolean */
const validateRequiredField = S.all (S.pipe ([
	prop ('requiredField'),
	S.is ($.Undefined),
	S.not,
]))

export {
	RequiredField,
	validateRequiredField,
}
