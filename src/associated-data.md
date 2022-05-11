# How to develop a custom ADT?

## Introduction

I'm building a CLI tool and want to use [sanctuary-argv](https://github.com/sanctuary-js/sanctuary-argv/tree/davidchambers/everything) for parsing arguments. I realise that sanctuary-argv is not done so I want to add some extra bells and whistles to complement the library, using ADTs. **How to develop custom ADTs confuses me in Sanctuary.**

With sanctuary-argv you can define a `Flag` and an `Option` type. I will focus on `Option` which is defined as [`Option :: Validator a -⁠> Handler a`](https://github.com/sanctuary-js/sanctuary-argv/tree/davidchambers/everything#option--validatora---handlera).

`Validator` and `Handler` are type aliases. In order to understand the notation, the following list of definitions might be helpful:

```haskell
Validator :: String -> Either String (Setter a)
Handler   :: Either (Setter a) (Validator a)
Setter    :: (a -> a)
```
For `Setter` it is useful to see how an implementation could look like.
```js
config => ({...config, color: true})
```
_☝️ Setting a `color :: Boolean` property._


`Setter` is used to add/update a value on a _configuration_.
The use of `a` should indicate to you that the _configuration_ can be any type but I will from here on only use [`StrMap Either`](https://sanctuary.js.org/#section:strmap) as the data type for `a` in `Setter a`.



## Motivation

The following will be my _configuration_:

```js
config: {
	dbHost: S.Left (''),
	dbPort: S.Right ('28015'),
	dbName: S.Left (''),
	dbUser: S.Left (''),
	dbPassword: S.Left (''),
}
```

I want the user to be able to update each property. `Left` represents an invalid value and a `Right` represents a valid value. sanctuary-argv provides the means to validate a value but no way to validate a value based on multiple properties.

A simple use-case is that one value is only valid if another value is provided. For example, `dbUser` is not valid if `dbPassword` is not provided and vice versa.

I want to encode this relationship via an ADT (Algebraic Data Type). From here on out I am going to call that ADT, `RequiredField`. I will need another ADT to represent a data type that does not do any validation but always sets a `Right a`. I have no name preferences here, so I'll just call it `Any` as in will accept any value.

Our union type, `Field` where a value will always be a `String`, will then be:

```elm
type Field
    = Any String
    | RequiredField String String
```
