#!/usr/bin/env bash

capitalizeFirstLetter() {
    upper=$(echo $1|cut -c1|tr [a-z] [A-Z])
    lower=$(echo $1|cut -c2-)
    naamWithFirstLetterUpper=$upper$lower
}

removeDashesAndUpperEachFirstLetter() {
    IFS='-' # hyphen (-) is set as delimiter
        read -ra ADDR <<< "$1" # str is read into an array as tokens separated by IFS
        for i in "${ADDR[@]}"; do # access each element of array
            CLEANED+=${i^}
        done
    IFS=' '
}

replaceDescription() {
    sed -i "" -e "s/@description@/${description}/g" $fullPath/README.md.template
    touch $fullPath/package.new.json
    cat package.json | jq --arg desc "${description}" '.description = $desc' > $fullPath/package.new.json
}
