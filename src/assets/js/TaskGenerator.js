class TaskGenerator{

    _state = 0;
    _type = 1; // 1 - yes/No; 2-get Answer

    _operations = ['+', '-', '*', '/'];
    _states = {new:0, correct: 1, error: 2};

    _max = 10;
    _min = 1;

    _number1 = 1;
    _number2 = 1;
    _operation = -1;
    _result = 0;


    _correctResult = 0;
    _isEquationRight = true;

    _partWhatSkip = 0;

    constructor(min, max) {
       this._min = min;
       this._max = max;
       this.generate();
    }

    changeType(val){
        this._type = val;
    }

    get equation(){
        if(this.isYesNoType)
            return `${this._number1} ${this._operations[this._operation]} ${this._number2} = ${this._result} ?`;

        if(this._partWhatSkip === 0)
            return ` ? ${this._operations[this._operation]} ${this._number2} = ${this._correctResult}`;
        if(this._partWhatSkip === 1)
            return `${this._number1} ${this._operations[this._operation]}  ? = ${this._correctResult}`;

        return `${this._number1} ${this._operations[this._operation]} ${this._number2} = ?`;
    }

    get correctEquation(){
        return `${this._number1} ${this._operations[this._operation]} ${this._number2} = ${this._correctResult}`
    }

    get state(){
        return this._state;
    }

    get isErrorState(){
        return this._state === this._states.error;
    }

    get isNewState(){
        return this._state === this._states.new;
    }

    get isYesNoType(){
        return this._type === 1;
    }

    generate(){
        this._state = this._states.new;
        this._operation = this._getRandomIntInclusive(4) % 4;
        this._isEquationRight =  !!(this._getRandomIntInclusive(2) % 2);

        this._number1 = this._getRandomIntInclusive();
        this._number2 = this._getRandomIntInclusive();

        this._generateRightAnswer();

        if(this.isYesNoType)
            this._makeWrongAnswer();
        else
            this._makeSkipPart();
    }

    checkAnswer(givenAnswer){
        let isCorrect = false;
        if(this.isYesNoType)
            isCorrect = givenAnswer === this._isEquationRight;
        else if(this._partWhatSkip === 0)
            isCorrect = givenAnswer == this._number1;
        else if(this._partWhatSkip === 1)
            isCorrect = givenAnswer == this._number2;
        else
            isCorrect = givenAnswer == this._result;


        this._state = (isCorrect) ? this._states.correct : this._states.error;
        return isCorrect;
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

                if(this._operation === 2) break;

                let changePart = this._getRandomIntInclusive() % 2,
                    tmp = this._result;
                if(changePart === 0)
                    this._number2 = this._number1;
                this._number1 = tmp;
                this._result = this._number1 / this._number2;
            }
        }
        this._correctResult = this._result;
    }

    _makeSkipPart(){
        this._partWhatSkip = this._getRandomIntInclusive(3) % 3;
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