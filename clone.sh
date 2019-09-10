#!/bin/bash

####################
# Helper functions #
####################

function determineDefaultPath() {
    parentDir="$(dirname "${PWD}")"
    fullPath=$parentDir/"webcomponent-vl-ui-"${naam}
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
function capitalizeFirstLetter() {
    upper=`echo $1|cut -c1|tr [a-z] [A-Z]`
    lower=`echo $1|cut -c2-`
    NAAM=$upper$lower
}

function replaceInFile() {
    sed -i '' -e 's/blueprint/${naam}/g' $fullPath/$1
    if [[ $1 == "bamboo-specs/bamboo.yml" ]]; then
        NAAM=$(echo "$naam" | tr a-z A-Z)
        sed -i '' -e 's/BLUEPRINT/${NAAM}/g' $fullPath/$1
    fi
    if [[ ( $1 == "vl-blueprint.src.js" ) || ( $1 == "style.scss" ) ]]; then
        capitalizeFirstLetter $naam
        sed -i '' -e 's/Blueprint/${NAAM}/g' $fullPath/$1
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
&& rsync -arq . $fullPath --exclude .git --exclude node_modules --exclude README.md --exclude clone.sh --exclude package-lock.json

replaceInFile package.json
replaceInFile bamboo-specs/bamboo.yml
replaceInFile demo/vl-blueprint.html
replaceInFile vl-blueprint.src.js
replaceInFile style.scss
replaceInFile test/vl-blueprint.test.html

cleanUp *bak
cleanUp test/*bak
cleanUp bamboo-specs/*bak

rename vl-blueprint.src.js vl-${naam}.src.js
rename demo/vl-blueprint.html demo/vl-${naam}.html
rename test/vl-blueprint.test.html test/vl-${naam}.test.html

echo "Project aangemaakt onder $fullPath"

exit 0
