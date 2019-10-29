#!/usr/bin/env bash

CWD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

source $CWD/stringUtils.sh

replaceInFile() {
    sed -i "" -e "s/blueprint/${naam}/g" $fullPath/$1
    if [[ $1 == "bamboo-specs/bamboo.yml" ]]; then
        naamInUpper=$(echo "$naam" | tr a-z A-Z)
        sed -i "" -e "s/BLUEPRINT/${naamInUpper}/g" $fullPath/$1
    fi
    if [[ ( $1 == "vl-blueprint.src.js" ) || ( $1 == "style.scss" ) ]]; then
        capitalizeFirstLetter $naam
        removeDashesAndUpperEachFirstLetter $naamWithFirstLetterUpper
        sed -i "" -e "s/Blueprint/${CLEANED}/g" $fullPath/$1
    fi
}

rename() {
    mv $fullPath/$1 $fullPath/$2
}

cleanUp() {
    rm -rf $fullPath/$1
}
