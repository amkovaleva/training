class TaskGenerator{

    _number1 = 1;
    _number2 = 1;
    _operation = -1;
    _result = -1;
    _max = 10;
    _min = 1;
    _isEquationRight = true;

    _operations = ['+', '-', '*', '/']

    constructor(min, max) {
       this._min = min;
       this._max = max;
       this.generate();
    }

    get equation(){
        return `${this._number1} ${this._operations[this._operation]} ${this._number2} = ${this._result}`
    }


    generate(){
        this._operation = this._getRandomIntInclusive(4) % 4;
        this._isEquationRight = this._getRandomIntInclusive(2) % 2;

        this._number1 = this._getRandomIntInclusive();
        this._number2 = this._getRandomIntInclusive();

        this._generateRightAnswer();
        this._makeWrongAnswer();
    }

    isAnswerCorrect(givenAnswer){
        return givenAnswer === !!this._isEquationRight;
    }

    _getRandomIntInclusive(max = this._max) {
        return Math.floor(Math.random() * (max - this._min + 1)) + this._min;
    }

    _generateRightAnswer() {
        switch(this._operation){
            case 0: this._result = this._number1 + this._number2; break;
            case 1: {
                if(this._number1 < this._number2){ // Исключаем отрицательные числа
                    let tmp = this._number1;
                    this._number1 = this._number2;
                    this._number2 = tmp;
                }
                this._result = this._number1 - this._number2;
                break;
            }
            case 2:
            case 3: {
                this._result = this._number1 * this._number2;

                if(this._operation === 2) return;

                let changePart = this._getRandomIntInclusive() % 2,
                    tmp = this._result;
                if(changePart === 0)
                    this._number2 = this._number1;
                this._number1 = tmp;
                this._result = this._number1 / this._number2;
            }
        }
    }

    _makeWrongAnswer(){
        if(this._isEquationRight)
            return;

        let randomInfo = this._maybeRandomAnswer();
        if(!randomInfo)
            return;

        this[`_makeWrongAnswerFor${this._operation}`](randomInfo);
    }

    _maybeRandomAnswer(){
        let changeVariant = this._getRandomIntInclusive(100),
            randomValue = this._getRandomIntInclusive(100);

        if(changeVariant === 0){
            this._result = randomValue;
            return null;
        }

        let min = Math.min(this._number1, this._number2),
            max = Math.max(this._number1, this._number2);
        return {min: min, max: max, changeVariant: changeVariant, randomValue: randomValue};
    }

    _makeWrongAnswerFor0(randomInfo){
        let variantsCount = randomInfo.changeVariant % ((randomInfo.min - 1) * 2 + 1),
            direction = (variantsCount < randomInfo.min) ? -1 : 1,
            diff = randomInfo.changeVariant % randomInfo.min + 1,
            newValue = this._result + direction * diff;

        this._result = (newValue >= 0) ? newValue : (randomInfo.randomValue % ((randomInfo.min + 1) * randomInfo.max));
    }
    _makeWrongAnswerFor1(randomInfo){
        this._makeWrongAnswerFor0(randomInfo);
    }

    _makeWrongAnswerFor2(randomInfo){
        let variantsCount = randomInfo.changeVariant % ( (randomInfo.min - 1) * 2 + 1 + randomInfo.min * 2 * 2);
        if(variantsCount <=  (randomInfo.min -1 ) * 2 ){
            this._makeWrongAnswerFor0(randomInfo);
            return;
        }
        variantsCount -= (randomInfo.min - 1) * 2 + 1;

        let direction = (variantsCount <= randomInfo.min * 2) ? -1 : 1,
            baseNumber = (variantsCount % (randomInfo.min * 2) <= randomInfo.min) ? randomInfo.min : randomInfo.max,
            diff = baseNumber * variantsCount,
            newValue = this._result + direction * diff;

        this._result = (newValue >= 0) ? newValue : (randomInfo.randomValue % (randomInfo.min * 2 * randomInfo.max));
    }

    _makeWrongAnswerFor3(randomInfo){
        this._makeWrongAnswerFor2(randomInfo);
    }

}

export default TaskGenerator;