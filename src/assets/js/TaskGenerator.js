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

    get Task() {
        return {
            number1: this._number1,
            number2: this._number2,
            operation: this._operation,
            isEquationRight: this._isEquationRight,
            result: this._result,
        }
    }

    get equation(){
        return `${this._number1} ${this._operations[this._operation]} ${this._number1} = ${this._result}`
    }

    generate(){
        this._operation = this._getRandomIntInclusive() % 4;
        this._isEquationRight = !!this._getRandomIntInclusive() % 2;

        this._number1 = this._getRandomIntInclusive();
        this._number2 = this._getRandomIntInclusive();

        this._generateRightAnswer();
        this._makeWrongAnswer();
    }

    _getRandomIntInclusive() {
        return Math.floor(Math.random() * (this._max - this._min + 1)) + this._min;
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

        this[`_makeWrongAnswerFor${this._operation}`]();
    }

    _maybeRandomAnswer(){

        let min = Math.min(this._number1, this._number2),
            mode = (min - 1) * 2 + 1,
            changeVariant = this._getRandomIntInclusive() % mode;

        if(changeVariant === 0){
            this._result = this._getRandomIntInclusive();
            return null;
        }
        return {min: min, changeVariant: changeVariant, direction: (changeVariant  >= min) ? 1 : -1};
    }

    _makeWrongAnswerFor0(){
        let randomInfo = this._maybeRandomAnswer();
        if(!randomInfo)
            return;

        let diff = randomInfo.changeVariant % randomInfo.min;
        this._result = this._result + randomInfo.direction * diff;
    }
    _makeWrongAnswerFor1(){
        this._makeWrongAnswerFor0();
    }

    _makeWrongAnswerFor2(){
        let randomInfo = this._maybeRandomAnswer();
        if(!randomInfo)
            return;

        let diff = randomInfo.changeVariant % randomInfo.min;

        this._result = this._result + randomInfo.direction * diff;
    }

    _makeWrongAnswerFor3(){
        this._makeWrongAnswerFor2();
    }

}

export default TaskGenerator;