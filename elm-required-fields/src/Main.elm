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
import Html exposing (Html, div, input, text)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)



-- MAIN


main : Program () Model Msg
main = Browser.sandbox { init = init, update = update, view = view }


stringFromBool : Bool -> String
stringFromBool value =
    if value then
        ""

    else
        "not"



-- MODEL
type Field
    = Any String
    | RequiredField String String

-- type alias Model =
--     { user : Field
--     , password : Field
--     , arbitrary : Field
--     , isValid : Bool
--     }
type alias Model =
    {
        fields: Dict String Field
        , isValid : Bool
    }


init : Model
init = { fields = Dict.fromList
            [ ("user", RequiredField "password" "")
            , ("password", RequiredField "user" "")
            , ("arbitrary", Any "foo")
            ]
        , isValid = False
        }


fieldToString : Field -> String
fieldToString field =
    case field of
        Any value ->
            value

        RequiredField _ value ->
            value


modelToString : Model -> Html msg
modelToString model =
    text (fieldToString model.user ++ fieldToString model.password ++ " is " ++ stringFromBool model.isValid ++ " valid")


validate : Model -> Bool
validate model =
    List.map2 .user .password model
--    case field of
--        Any ->
--            True
--
--        RequiredField required _ ->
--            Model



-- UPDATE


type Msg
    = UpdateUser String
    | UpdatePassword String


update : Msg -> Model -> Model
update msg model =
    case msg of
        UpdateUser name ->
            { model | user = RequiredField "password" name }

        UpdatePassword pw ->
            { model | password = RequiredField "user" pw }



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ input [ placeholder "User", value (fieldToString model.user), onInput UpdateUser ] []
        , input [ placeholder "Password", value (fieldToString model.password), onInput UpdatePassword ] []
        , div [ attribute "style" "color:white;" ] [ modelToString model ]
        ]
