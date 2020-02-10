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

replaceDescription

replaceInFile package.json
replaceInFile src/vl-blueprint.src.js
replaceInFile src/style.scss
replaceInFile README.md.template
replaceInFile index.js
replaceInFile src/index.js

replaceInFile bamboo-specs/bamboo.yml
replaceInFile demo/vl-blueprint.html
replaceInFile test/e2e/components/vl-blueprint.js
replaceInFile test/e2e/pages/vl-blueprint.page.js
replaceInFile test/e2e/blueprint.test.js
replaceInFile test/unit/vl-blueprint.test.html

cleanUp *bak
cleanUp test/*bak
cleanUp bamboo-specs/*bak

rename src/vl-blueprint.src.js src/vl-${naam}.src.js
rename README.md.template README.md

rename demo/vl-blueprint.html demo/vl-${naam}.html
rename test/e2e/components/vl-blueprint.js test/e2e/components/vl-${naam}.js
rename test/e2e/pages/vl-blueprint.page.js test/e2e/pages/vl-${naam}.page.js
rename test/e2e/blueprint.test.js test/e2e/${naam}.test.js
rename test/unit/vl-blueprint.test.html test/unit/vl-${naam}.test.html

echo "Project aangemaakt onder $fullPath"

exit 0
