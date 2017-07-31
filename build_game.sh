#!/bin/sh

docker build -t game_grunt_builder .

docker run -v $(pwd)/WebContent:/game/game -v $(pwd)/dest:/game/dest game_grunt_builder grunt
