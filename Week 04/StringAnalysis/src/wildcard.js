function countStar(pattern) {
    let result = 0;
    for (let i = 0; i < pattern.length; ++i) {
        if (pattern[i] == "*") {
            ++result;
        }
    }
    return result;
}

function sameCharOn(source, ps, pattern, pd) {
    return pattern[pd] == source[ps] || pattern[pd] == "?";
}

function matchWithoutStar(source, pattern) {
    if (source.length != pattern.length) return false;
    for (let i = 0; i < pattern.length; ++i) {
        if (!sameCharOn(source, i, pattern, i)) {
            return false;
        }
    }
    return true;
}

function matchBeforeFirstStar(source, pattern) {
    let pos = 0;
    for (; pattern[pos] != "*"; ++pos) {
        if (!sameCharOn(source, pos, pattern, pos)) {
            return -1;
        }
    }
    return pos;
}

function matchAfterLastStar(source, lastIndex, pattern) {
    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] != "*"; ++j) {
        if (!sameCharOn(source, source.length - j, pattern, pattern.length - j)) {
            return false;
        }
    }
    return true;
}

function findPatternToNextStar(begin, pattern) {
    ++begin;
    let end = begin;
    while (pattern[end] != "*") {
        ++end;
    }
    return [begin, end];
}

function subPatternMatcher(pattern, begin, end, lastIndex) {
    let subPattern = pattern.substring(begin, end);
    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\]S", "g"));
    reg.lastIndex = lastIndex;
    return reg;
}

function matchToNext(reg, source) {
    if (!reg.exec(source)) {
        return -1;
    }
    return reg.lastIndex;
}

function wildcardMatch(source, pattern) {
    let starCount = countStar(pattern);
    if (starCount == 0) {
        return matchWithoutStar(source, pattern);
    }

    let begin = matchBeforeFirstStar(source, pattern);
    if (begin < 0) return false;
    let lastIndex = begin;

    for (let p = 0; p < starCount - 1; ++p) {
        let [pBegin, end] = findPatternToNextStar(begin, pattern);
        let reg = subPatternMatcher(pattern, pBegin, end, lastIndex)
        lastIndex = matchToNext(reg, source);
        if (lastIndex < 0) return false;
        begin = end;
    }

    return matchAfterLastStar(source, lastIndex, pattern);
}

module.exports = {
    default: wildcardMatch,
    wildcardMatch,
}
