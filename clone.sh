#!/usr/bin/env bash

####################
# Helper functions #
####################

determineDefaultPath() {
    parentDir="$(dirname "${PWD}")"
    fullPath=$parentDir/"webcomponent-vl-ui-"${naam}
}

overwriteDefaultPathWithInputIfPresent() {
    if [[ -n $pad ]]; then
        fullPath=$pad
    fi
}

readInput() {
    read -ep "Wat is de naam van de nieuwe webcomponent? " naam
    determineDefaultPath
    read -ep "Waar mag het project opgeslagen worden? [$fullPath]: " pad
    overwriteDefaultPathWithInputIfPresent
}
capitalizeFirstLetter() {
    upper=$(echo $1|cut -c1|tr [a-z] [A-Z])
    lower=$(echo $1|cut -c2-)
    naamWithFirstLetterUpper=$upper$lower
}

removeDashes() {
    withoutDashes=$(echo $1 | tr -d -)
}

replaceInFile() {
    sed -i "" -e "s/blueprint/${naam}/g" $fullPath/$1
    if [[ $1 == "bamboo-specs/bamboo.yml" ]]; then
        naamInUpper=$(echo "$naam" | tr a-z A-Z)
        sed -i "" -e "s/BLUEPRINT/${naamInUpper}/g" $fullPath/$1
    fi
    if [[ ( $1 == "vl-blueprint.src.js" ) || ( $1 == "style.scss" ) ]]; then
        capitalizeFirstLetter $naam
        removeDashes $naamWithFirstLetterUpper
        sed -i "" -e "s/Blueprint/${withoutDashes}/g" $fullPath/$1
    fi
}

cleanUp() {
    rm -rf $fullPath/$1
}

rename() {
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
replaceInFile README.md.template

cleanUp *bak
cleanUp test/*bak
cleanUp bamboo-specs/*bak

rename vl-blueprint.src.js vl-${naam}.src.js
rename demo/vl-blueprint.html demo/vl-${naam}.html
rename test/vl-blueprint.test.html test/vl-${naam}.test.html
rename README.md.template README.md

echo "Project aangemaakt onder $fullPath"

exit 0
