#!/bin/bash

####################
# Helper functions #
####################

function determineDefaultPath() {
    parentDir="$(dirname "${PWD}")"
    fullPath=$parentDir/${naam}
}

function overwriteDefaultPathWithInputIfPresent() {
    if [[ -n $pad ]]; then
        fullPath=$pad
    fi
}

function readInput() {
    read -p "Wat is de naam van de nieuwe webcomponent? " naam
    determineDefaultPath
    read -p "Waar mag het project opgeslagen worden? [$fullPath]: " pad
    overwriteDefaultPathWithInputIfPresent
}

function replaceInFile() {
    sed -i "" -e "s/blueprint/${naam}/g" $fullPath/$1
    if [[ $1 == "bamboo-specs/bamboo.yml" ]]; then
        NAAM=$(echo "$naam" | tr a-z A-Z)
        sed -i "" -e "s/BLUEPRINT/${NAAM}/g" $fullPath/$1
    fi
    if [[ $1 == "vl-blueprint.src.js" ]]; then
        upper=`echo $naam|cut -c1|tr [a-z] [A-Z]`
        lower=`echo $naam|cut -c2-`
        NAAM=$upper$lower
        sed -i "" -e "s/Blueprint/${NAAM}/g" $fullPath/$1
    fi
}

function cleanUp() {
    rm -rf $fullPath/$1
}

function rename() {
    mv $fullPath/$1 $fullPath/$2
}

#####################
# Application logic #
#####################

readInput

mkdir -p $fullPath \
&& rsync -arq . $fullPath --exclude .git --exclude node_modules --exclude README.md

replaceInFile package.json
replaceInFile bamboo-specs/bamboo.yml
replaceInFile demo/vl-blueprint.html
replaceInFile vl-blueprint.src.js

cleanUp *bak
cleanUp test/*bak
cleanUp bamboo-specs/*bak

rename vl-blueprint.src.js vl-${naam}.src.js
rename demo/vl-blueprint.html demo/vl-${naam}.html
rename test/vl-blueprint.test.html test/vl-${naam}.test.html

echo "Project aangemaakt onder $fullPath"

exit 0
