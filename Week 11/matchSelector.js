/**
 * @param {string} selector 
 * @param {HTMLElement} element 
 */
function matchSingleElement(selector = "", element) {
    const EOS = Symbol('End of selector');
    let current = start;
    let matchingName = "";

    for (let c of selector) {
        current = current(c);
    }
    current = current(EOS);

    return current == matchSuccess;

    /** @param {string} c */
    function start(c) {
        if (c == '*') {
            return matchSuccess;
        }
        if (c == '.') {
            return matchClass;
        }
        if (c == '#') {
            return matchEleId;
        }
        if (c == EOS) {
            return matchFailed;
        }
        return matchTagName(c);
    }

    function checkTagName() {
        if (element.tagName.toUpperCase() == matchingName.toUpperCase()) {
            matchingName = "";
            return true;
        }
        return false;
    }

    /** @param {string} c */
    function matchTagName(c) {
        if (c == '.') {
            return checkTagName() ? matchClass : matchFailed;
        }
        if (c == '#') {
            return checkTagName() ? matchEleId : matchFailed;
        }
        if (c == EOS) {
            return checkTagName() ? matchSuccess : matchFailed;
        }
        matchingName += c;
        return matchTagName;
    }

    function checkClassName() {
        if (element.classList.contains(matchingName)) {
            matchingName = "";
            return true;
        }
        return false;
    }

    /** @param {string} c */
    function matchClass(c) {
        if (c == '.') {
            return checkClassName() ? matchClass : matchFailed;
        }
        if (c == '#') {
            return checkClassName() ? matchEleId : matchFailed;
        }
        if (c == EOS) {
            return checkClassName() ? matchSuccess : matchFailed;
        }
        matchingName += c;
        return matchClass;
    }

    function checkElementId() {
        if (element.id == matchingName) {
            matchingName = "";
            return true;
        }
        return false;
    }

    /** @param {string} c */
    function matchEleId(c) {
        if (c == '.') {
            return checkElementId() ? matchClass : matchFailed;
        }
        if (c == '#') {
            return checkElementId() ? matchEleId : matchFailed;
        }
        if (c == EOS) {
            return checkElementId() ? matchSuccess : matchFailed;
        }
        matchingName += c;
        return matchEleId;
    }

    function matchSuccess() {
        return matchSuccess;
    }

    function matchFailed() {
        return matchFailed;
    }
}

/**
 * @param {string} selector 
 * @param {HTMLElement} element 
 */
function match(selector = "", element) {
    let selectorParts = selector.split(" ").reverse();

    if (!matchSingleElement(selectorParts[0], element)) return false;

    let i = 1;
    for (let ele = element.parentElement; ele; ele = ele.parentElement) {
        if (matchSingleElement(selectorParts[i], ele)) {
            ++i;
        }
    }
    if (i >= selectorParts.length) return true;

    return false;
}