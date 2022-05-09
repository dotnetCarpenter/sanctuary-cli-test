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
        , ("arbitrary", Any "foo")
        ]


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


boolToString : Bool -> String
boolToString value =
    if value then
        ""

    else
        "not"


fieldToString : Field -> String
fieldToString field =
    case field of
        Any value ->
            value

        RequiredField _ value ->
            value


configToHtmlList : Config -> Html msg
configToHtmlList config =
    ol
    []
    (Dict.foldl
        (\key field output ->
            li
            []
            [ text ("Key: " ++ key ++ " Value: " ++ fieldToString field) ] :: output)
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
        , value (fieldToString field)
        , onInput (UpdateField key)
        ]
        []
