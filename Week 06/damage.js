const DamageType = {
    Pierce: 0,
    Cut: 1,
    Blunt: 2,
    Virus: 3,
}

class Animal {
    health = 100;
    virus = 0;
    wound = 0;

    gotHurt(...hurts) {
        if (this.health <= 0) return;
        hurts.forEach(hurt => {
            switch (hurt.type) {
                case DamageType.Pierce:
                    this._gotPierce(hurt.val); break;
                case DamageType.Cut:
                    this._gotCut(hurt.val); break;
                case DamageType.Blunt:
                    this._gotBlunt(hurt.val); break;
                case DamageType.Virus:
                    this._gotVirus(hurt.val); break;
            }
        })
    }

    _decreaseHealth(val) {
        if (val > this.health) {
            this.health = 0;
        }
        else {
            this.health -= val;
        }
    }

    _gotPierce(val) {
        this.wound += val;
        this._decreaseHealth(val);
    }

    _gotCut(val) {
        this.wound += val * 2;
        this._decreaseHealth(val);
    }

    _gotBlunt(val) {
        this._decreaseHealth(val * 2);
    }

    _gotVirus(val) {
        this.virus += val;
    }
}

class Dog extends Animal {
    bite(other) {
        let hurts = [{ type: DamageType.Pierce, val: 5 }];
        if (this.virus) {
            hurts.push({ type: DamageType.Virus, val: 10 });
        }
        other.gotHurt(...hurts);
    }
}

const Season = {
    Spring: 0,
    Summer: 1,
    Autumn: 2,
    Winter: 3,
}

let currentSeason = Season.Winter;

class Human extends Animal {
    _gotPierce(val) {
        if (currentSeason == Season.Winter) {
            val *= 0.5;
        }
        else if (currentSeason == Season.Summer) {
            val *= 2;
        }
        this.shout("啊~");
        super._gotPierce(val);
    }

    shout(speech) {
        console.log(speech);
    }
}

let someDog = new Dog();
let somebody = new Human();
console.log("before:", somebody, someDog);
someDog.bite(somebody);
console.log("after:", somebody, someDog);
someDog.virus = 10;
someDog.bite(somebody);
console.log("twice:", somebody, someDog);