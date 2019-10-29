#!/usr/bin/env bash

prepareEnvironment() {
    which -s jq
    if [[ $? != 0 ]] ; then
        echo "Jq is not installed, please hang on while we install it for you ..."
        brew install jq
    fi
}

overwriteDefaultPathWithInputIfPresent() {
    if [[ -n $pad ]]; then
        fullPath=$pad
    fi
}

determineDefaultPath() {
    parentDir="$(dirname "${PWD}")"
    fullPath=$parentDir/"webcomponent-vl-ui-"${naam}
}
