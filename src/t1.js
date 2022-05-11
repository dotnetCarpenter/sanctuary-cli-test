import S from 'sanctuary'

// write an example of a function that takes an argument

let compose = f => g => x => f (g (x))
let compose_ = g => f => x => f (g (x))

const add1 = f => compose (f) (S.add (1))

// const toString = S.compose (n => `1 + 1 = ${n}`) (add1)

console.debug (
	add1 (n => `1 + 1 = ${n}`) (1)
)
