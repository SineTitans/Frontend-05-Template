function StringToNumber(numStr = "") {
    if (numStr == "Infinity") return Infinity;
    if (numStr == "-Infinity") return -Infinity;
    numStr = numStr.toLowerCase();

    let ch_0 = '0'.charCodeAt(0);

    if (numStr[0] == '0') {
        let base = 10, result = 0;
        if (numStr[1] == 'x') {
            base = 16;
        }
        else if (numStr[1] == 'o') {
            base = 8;
        }
        else if (numStr[1] == 'b') {
            base = 2;
        }
        if (base != 10) {
            let ch_a = 'a'.charCodeAt(0);
            for (let c of numStr.substring(2)) {
                let num = c.charCodeAt(0) - ch_0;
                if (num < 0 || num >= base) {
                    if (base > 10) {
                        num = num + ch_0 - ch_a + 10;
                        if (num < 10 || num >= base)
                            return Number.NaN;
                    }
                    else return Number.NaN;
                }
                result = result * base + num;
            }
            return result;
        }
    }

    let sign = 1;
    if (numStr[0] == '-') {
        sign = -1;
        numStr = numStr.substring(1);
    }
    else if (numStr[0] == '+') {
        numStr = numStr.substring(1);
    }

    let numParts = numStr.split('e');
    if (numParts.length > 2) return Number.NaN;
    if (numParts.length == 2) {
        if (numParts[0] == '' || numParts[1] == '') return Number.NaN;
    }

    let main = numParts[0].split('.');
    if (main.length > 2) return Number.NaN;
    if (main.length == 2) {
        if (main[0] == '' && main[1] == '') return Number.NaN;
    }

    function Str2Int(str = '') {
        let result = 0;
        for (let c of str) {
            let num = c.charCodeAt(0) - ch_0;
            if (num < 0 || num > 9) return Number.NaN;
            result = result * 10 + num;
        }
        return result;
    }

    let int = Str2Int(main[0]);
    if (Number.isNaN(int)) return int;
    let dec = Str2Int(main[1]);
    if (Number.isNaN(dec)) return dec;
    while (dec >= 1) dec /= 10;

    let result = sign * (int + dec);

    if (numParts[1]) {
        let expStr = numParts[1];
        let sign = 1;
        if (expStr[0] == '-') {
            sign = -1;
            expStr = expStr.substring(1);
        }
        else if (expStr[0] == '+') {
            expStr = expStr.substring(1);
        }
        let exp = Str2Int(expStr);
        if (Number.isNaN(exp)) return exp;
        result *= 10 ** (sign * exp);
    }

    return result;
}

let testS2N = new Map([
    ['-Infinity', -Infinity], ['Infinity', Infinity],
    ['0B101', 5], ['0b1100', 12], ['0b1120', Number.NaN],
    ['0O172', 122], ['0o11', 9], ['0o1a0', Number.NaN],
    ['0X21', 33], ['0x1f', 31], ['0x112g', Number.NaN],
    ['.3e8E-9', Number.NaN], ['e34', Number.NaN],
    ['-3.4e', Number.NaN], ['10.53', 10.53], ['4.', 4],
    ['-.5', -0.5], ['-6b.5', Number.NaN], ['.', Number.NaN],
    ['.5e7', 5e6], ['8eB', Number.NaN], ['2e-3', 0.002],
    ['.8e-+4', Number.NaN],
]);

for (let [t, a] of testS2N) {
    let res = StringToNumber(t);
    if (Number.isNaN(a)) {
        console.assert(Number.isNaN(res), `${t} should be NaN, real ${res}`);
    }
    else if (!Number.isFinite(a)) {
        console.assert(res === a, `${t} should be ${a}, real ${res}`);
    }
    else {
        console.assert(Math.abs(res - a) < Number.EPSILON, `${t} should be ${a}, real ${res}`);
    }
}


function NumberToString(num = 0, radix = 10) {
    if (Number.isNaN(num)) return "NaN";
    if (!Number.isFinite(num))
        return num > 0 ? "Infinity" : "-Infinity";

    let ch_0 = '0'.charCodeAt(0);
    if (radix < 2 || radix > 36) {
        throw new RangeError("radix argument must be between 2 and 36");
    }
    radix = Math.floor(radix);
    if (radix != 10) {
        let ch_a = 'a'.charCodeAt(0);
        // 非10进制只作为正整数处理，最大36进制
        if (num < 0 || radix < 2 || radix > 36) return '';
        num = Math.floor(num);
        let result = '';
        while (num) {
            let pos = num % radix;
            let ch = pos < 10 ? String.fromCharCode(ch_0 + pos)
                : String.fromCharCode(ch_a + pos - 10);
            result = ch + result;
            num = (num - pos) / radix;
        }
        if (radix == 16) return '0x' + result;
        if (radix == 8) return '0o' + result;
        if (radix == 2) return '0b' + result;
        return `${result}(${radix})`;
    }

    let result = "", exp = 0;
    if (num < 0) {
        result = "-";
        num = - num;
    }

    if (num >= 1e21) {
        while (num >= 10) {
            num /= 10;
            ++exp;
        }
    }
    else if (num < 1e-7) {
        while (num < 1) {
            num *= 10;
            --exp;
        }
    }

    let dot = 0;
    while (num >= 10) {
        num /= 10;
        ++dot;
    }

    while (num > Number.EPSILON && dot > -16) {
        let pos = Math.floor(num);
        result += String.fromCharCode(ch_0 + pos);
        num -= pos;
        num *= 10;
        if (dot == 0 && num > Number.EPSILON) {
            result += '.';
        }
        --dot;
    }

    if (exp != 0) {
        result += `e${exp}`;
    }

    return result;
}

console.log(NumberToString(27, 2));
console.log(NumberToString(27, 5));
console.log(NumberToString(27, 8));
console.log(NumberToString(27, 16));
console.log(NumberToString(27, 22));
console.log(NumberToString(27.5));
console.log(NumberToString(275));
console.log(NumberToString(Math.E));
console.log(NumberToString(1.46e-17));
console.log(NumberToString(91.46e17));