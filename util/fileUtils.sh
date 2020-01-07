#!/usr/bin/env bash

CWD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

source $CWD/stringUtils.sh

replaceInFile() {
    sed -i "" -e "s/blueprint/${naam}/g" $fullPath/$1
    sed -i "" -e "s/Blueprint/${naam^}/g" $fullPath/$1
    sed -i "" -e "s/BLUEPRINT/${naam^^}/g" $fullPath/$1
}

rename() {
    if [[ $1 == *"/"* ]]; then
        BASE=${1##*/}
        DIR=${1%$BASE}
        mkdir -p $fullPath/$DIR
    fi

    mv $fullPath/$1 $fullPath/$2
}

cleanUp() {
    rm -rf $fullPath/$1
}
