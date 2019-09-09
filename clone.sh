#!/bin/bash
echo "Wat is de naam van de nieuwe webcomponent?"

read naam

echo "Waar mag het project opgeslagen worden (Absoluut pad)?:"

read pad

echo "Het project zal gekopieerd worden naar $pad/$naam. Is dit juist (Y/n)?"

read keuze

function replaceInFile() {
    sed -i "" -e "s/blueprint/${naam}/g" $pad/$naam/$1
    if [[ $1 == "bamboo-specs/bamboo.yml" ]]; then
        NAAM=$(echo "$naam" | tr a-z A-Z)
        sed -i "" -e "s/BLUEPRINT/${NAAM}/g" $pad/$naam/$1
    fi
    if [[ $1 == "vl-blueprint.src.js" ]]; then
        upper=`echo $naam|cut -c1|tr [a-z] [A-Z]`
        lower=`echo $naam|cut -c2-`
        NAAM=$upper$lower
        sed -i "" -e "s/Blueprint/${NAAM}/g" $pad/$naam/$1
    fi
}

function cleanUp() {
    rm -rf $pad/$naam/$1
}

function rename() {
    mv $pad/$naam/$1 $pad/$naam/$2
}

if [[ $keuze = "Y" ]]; then
    mkdir -p $pad/$naam \
    && cp -R . $pad/$naam/ \
    && replaceInFile package.json \
    && replaceInFile bamboo-specs/bamboo.yml \
    && replaceInFile demo/vl-blueprint.html \
    && replaceInFile vl-blueprint.src.js \
    && cleanUp *bak \
    && cleanUp test/*bak \
    && cleanUp bamboo-specs/*bak \
    && rename vl-blueprint.src.js vl-${naam}.src.js \
    && rename demo/vl-blueprint.html demo/vl-${naam}.html \
    && rename test/vl-blueprint.test.html test/vl-${naam}.test.html \
    && echo "Kopieren voltooid!"
else
    echo "Start het script nogmaals met het correcte pad."
    exit 1
fi

exit 0
