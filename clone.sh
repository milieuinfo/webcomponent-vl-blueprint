#!/usr/bin/env bash

CWD=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

source $CWD/util/envUtils.sh 
source $CWD/util/fileUtils.sh

prepareEnvironment

####################
# Helper functions #
####################

readInput() {
    read -ep "Wat is de naam van de nieuwe webcomponent? " naam
    read -ep "Wat is de description van de component? " description
    determineDefaultPath
    read -ep "Waar mag het project opgeslagen worden? [$fullPath]: " pad
    overwriteDefaultPathWithInputIfPresent
}

#####################
# Application logic #
#####################

readInput

mkdir -p $fullPath \
&& rsync -arq . $fullPath --exclude .git --exclude node_modules --exclude util --exclude README.md --exclude clone.sh --exclude package-lock.json

replaceInFile package.json
replaceInFile bamboo-specs/bamboo.yml
replaceInFile demo/vl-blueprint.html
replaceInFile vl-blueprint.src.js
replaceInFile style.scss
replaceInFile test/vl-blueprint.test.html
replaceInFile README.md.template

replaceDescription

cleanUp *bak
cleanUp test/*bak
cleanUp bamboo-specs/*bak
cleanUp package.json

rename vl-blueprint.src.js vl-${naam}.src.js
rename demo/vl-blueprint.html demo/vl-${naam}.html
rename test/vl-blueprint.test.html test/vl-${naam}.test.html
rename README.md.template README.md
rename package.new.json package.json

echo "Project aangemaakt onder $fullPath"

exit 0
