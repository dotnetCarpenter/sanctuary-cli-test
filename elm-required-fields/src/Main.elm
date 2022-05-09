module Main exposing (..)

-- This app implements an interactive counter. It contains two buttons to increment and decrement the number shown between the buttons.
--
-- For a list of other example projects, see https://github.com/onlinegamemaker/making-online-games
-- A text input for reversing text. Very useful!
--
-- Read how it works:
--   https://guide.elm-lang.org/architecture/text_fields.html
--

import Browser
import Dict exposing (Dict)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)



-- MAIN


main : Program () Config Msg
main = Browser.sandbox { init = init, update = update, view = view }



-- MODEL
type Field
    = Any String
    | RequiredField String String


type alias Config = Dict String Field


init : Config
init = Dict.fromList
        [ ("user", RequiredField "password" "")
        , ("password", RequiredField "user" "")
        , ("arbitrary", Any "")
        ]


validate_ : Config -> Result String Bool
validate_ config =
    let validateField_ = validateField config
    in
        Dict.foldl (\key field output ->
                        case output of
                            Result.Ok  _ ->
                                if validateField_ field then
                                    Result.Ok True
                                else
                                    Result.Err ("“" ++ key ++ "” requires that “" ++ requiredFieldToString field ++ "” has a value.")

                            Result.Err _ -> output
                   )
                   (Result.Ok True)
                   (config)



validate : Config -> Bool
validate config = {- key is only needed if we need to communicate what was invalid -}
    let validateField_ = validateField config
    in
        Dict.foldl (\_ field output -> output && validateField_ field) True config


validateField : Config -> Field -> Bool
validateField config field =
    case field of
        Any _ -> True

        RequiredField fieldName _ ->
            config
                |> Dict.get fieldName
                |> Maybe.map isFieldValid
                |> Maybe.withDefault False


isFieldValid : Field -> Bool
isFieldValid field =
    case field of
        RequiredField _ value -> value /= ""
        Any _ -> True {- impossible path -}



-- UPDATE


type Msg
    = UpdateField String String


update : Msg -> Config -> Config
update msg config =
    case msg of
        UpdateField key value ->
            Dict.update key (Maybe.map (updateField value)) config


updateField : String -> Field -> Field
updateField value field =
    case field of
        Any _ ->
            Any value

        RequiredField requiredFieldName _ ->
            RequiredField requiredFieldName value



-- VIEW



resultToString : Result String Bool -> String
resultToString result =
    case result of
        Result.Ok  a -> "The configuration is " ++ boolToString a ++ " valid."
        Result.Err a -> a



boolToString : Bool -> String
boolToString value =
    if value then ""
    else "not"


fieldToValue : Field -> String
fieldToValue field =
    case field of
        Any value ->
            value

        RequiredField _ value ->
            value

requiredFieldToString : Field -> String
requiredFieldToString requiredField =
    case requiredField of
     RequiredField fieldName _ -> fieldName
     Any _ -> ""


configToHtmlList : Config -> Html msg
configToHtmlList config =
    ol
    []
    (Dict.foldl
        (\key field output ->
            li
            []
            [ text ("Key: " ++ key ++ " Value: " ++ fieldToValue field) ] :: output)
        []
        config)


view : Config -> Html Msg
view config =
    div []
        (
            (viewInputFields config)
            ++
            [
                p [] [ text ("The configuration is " ++ (boolToString (validate config)) ++ " valid.") ]
            ,   p [] [ text (resultToString (validate_ config)) ]
            ,   configToHtmlList config
            ]
        )


viewInputFields : Config -> List (Html Msg)
viewInputFields config =
    Dict.foldl
        (\key field fields -> viewInputField key field :: fields)
        []
        config


viewInputField : String -> Field -> Html Msg
viewInputField key field =
    input
        [ placeholder key
        , value (fieldToValue field)
        , onInput (UpdateField key)
        ]
        []
