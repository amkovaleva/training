class TaskGenerator {

    _isYesNoType = true;
    _operations = ['+', '-', '*', '/'];
    _states = {new: 0, correct: 1, error: 2};
    _max = 10;
    _min = 1;
    _number1 = 1;
    _number2 = 1;
    _operation = -1;
    _result = 0;
    _correctResult = 0;
    _isEquationRight = true;
    _partWhatSkip = 0;

    /**
     *
     * @param min - миниальное значение, используемое при генерации заданий
     * @param max - максимальное значение, используемое при генерации заданий
     * @param isYesNoType - является ли выбранный тип тренировки, тренировкой Верно / Неверно
     */
    constructor(min, max, isYesNoType) {
        this._min = min;
        this._max = max;
        this._isYesNoType = isYesNoType;
        this.generate();
    }

    _state = 0;

    /**
     *
     * @returns {number}
     * 0: new - Ответ на задание еще не дан
     * 1: correct - Ответ верный
     * 2: error - Ошибка в ответе
     */
    get state() {
        return this._state;
    }

    /**
     *
     * @returns {string}
     * Строковое представление задания
     */
    get equation() {
        if (this._isYesNoType)
            return `${this._number1} ${this._operations[this._operation]} ${this._number2} = ${this._result} ?`;

        if (this._partWhatSkip === 0)
            return ` ? ${this._operations[this._operation]} ${this._number2} = ${this._correctResult}`;
        if (this._partWhatSkip === 1)
            return `${this._number1} ${this._operations[this._operation]}  ? = ${this._correctResult}`;

        return `${this._number1} ${this._operations[this._operation]} ${this._number2} = ?`;
    }

    /**
     *
     * @returns {string}
     * Строковое представление правильного развернутого ответа на задание
     */
    get correctEquation() {
        return `${this._number1} ${this._operations[this._operation]} ${this._number2} = ${this._correctResult}`
    }

    /**
     *
     * @returns {boolean}
     * true - Дан ответ с ошибкой
     */
    get isErrorState() {
        return this._state === this._states.error;
    }

    /**
     *
     * @returns {boolean}
     * true - Ответа пока нет
     */
    get isNewState() {
        return this._state === this._states.new;
    }

    /**
     * Создание нового задания.
     */
    generate() {
        this._state = this._states.new;
        this._operation = this._getRandomIntInclusive(4) % 4;
        this._isEquationRight = !!(this._getRandomIntInclusive(2) % 2);

        this._number1 = this._getRandomIntInclusive();
        this._number2 = this._getRandomIntInclusive();

        this._generateRightAnswer();

        if (this._isYesNoType)
            this._makeWrongAnswer();
        else
            this._makeSkipPart();
    }

    /**
     *
     * @param givenAnswer - ответ, данный пользователем
     * @returns {boolean} - true, если ответ верный
     *
     */
    checkAnswer(givenAnswer) {

        if (!this._isYesNoType)
            givenAnswer = Number(givenAnswer);

        let compareTo = this._isYesNoType ? this._isEquationRight : [this._number1, this._number2, this._result][this._partWhatSkip],
            isCorrect = givenAnswer === compareTo;

        this._state = (isCorrect) ? this._states.correct : this._states.error;
        return isCorrect;
    }

    /**
     *
     * @param max - максимальное число доапазона генерации числа
     * @returns {number} - случайлое число из отрезка [this._min, max]. this._min Определяется в конструкторе.
     * @private
     */
    _getRandomIntInclusive(max = this._max) {
        return Math.floor(Math.random() * (max - this._min + 1)) + this._min;
    }

    /**
     * Для двух чисел и операции между ними определяется результат.
     * В некоторых случаях для удобства числа меняются местами:
     * - Чтобы не было отрицательных чисел
     * - Избегаем дробей. При делении вначале вычисляется результат умножения, а потом уже формируется деление.
     *  При этом, делитель выбирается случайным образом
     * @private
     */
    _generateRightAnswer() {
        switch (this._operation) {
            case 0:
                this._result = this._number1 + this._number2;
                break;
            case 1: {
                if (this._number1 < this._number2) {
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

                if (this._operation === 2) break;

                let changePart = this._getRandomIntInclusive() % 2,
                    tmp = this._result;
                if (changePart === 0)
                    this._number2 = this._number1;
                this._number1 = tmp;
                this._result = this._number1 / this._number2;
            }
        }
        this._correctResult = this._result;
        console.log(this.equation)
    }

    /**
     * Случайным образом определяем, то, какую часть уравнения пользователь должен вычислить.
     * Не выполняется для Верно / Неверно тренировки.
     * @private
     */
    _makeSkipPart() {
        this._partWhatSkip = this._getRandomIntInclusive(3) % 3;
    }

    /**
     * Для тренировки Верно / Неверно.
     * Составляем уравнение с ошибкой, если нам она нужна.
     * @private
     */
    _makeWrongAnswer() {
        if (this._isEquationRight)
            return;

        let randomInfo = this._maybeRandomAnswer();
        if (!randomInfo)
            return;

        this[`_makeWrongAnswerFor${this._operation}`](randomInfo);
        while(this._result === this._correctResult)
            this._result = this._getRandomIntInclusive(100);
    }

    /**
     *
     * @returns {{min: number, max: number, changeVariant: number, randomValue: number}|null} - Необходимые данные для генерации ошибки
     * {
     * min: number,  - Значение минимального операнда
     * max: number,  -  Значение максимального операнда
     * changeVariant: number,   -  Случайное значение для определения того, как именно будет расчитана ошибка в ответе
     * randomValue: number  - Случайное число
     * }
     * null - Ответ является случайным числом
     * @private
     */
    _maybeRandomAnswer() {
        let changeVariant = this._getRandomIntInclusive(100),
            randomValue = this._getRandomIntInclusive(100);

        if (changeVariant === 0) {
            this._result = randomValue;
            return null;
        }

        let min = Math.min(this._number1, this._number2),
            max = Math.max(this._number1, this._number2);
        return {min: min, max: max, changeVariant: changeVariant, randomValue: randomValue};
    }

    /**
     *
     * @param randomInfo
     * Вормируется ответ для сложения
     * @private
     */
    _makeWrongAnswerFor0(randomInfo) {
        let variantsCount = randomInfo.changeVariant % ((randomInfo.min - 1) * 2 + 1),
            direction = (variantsCount < randomInfo.min) ? -1 : 1,
            diff = randomInfo.changeVariant % randomInfo.min + 1,
            newValue = this._result + direction * diff;

        this._result = (newValue >= 0) ? newValue : (randomInfo.randomValue % ((randomInfo.min + 1) * randomInfo.max));
    }

    /**
     *
     * @param randomInfo
     * Вормируется ответ для вычитания
     * @private
     */
    _makeWrongAnswerFor1(randomInfo) {
        this._makeWrongAnswerFor0(randomInfo);
    }

    /**
     *
     * @param randomInfo
     * Вормируется ответ для умножения
     * @private
     */
    _makeWrongAnswerFor2(randomInfo) {
        let variantsCount = randomInfo.changeVariant % ((randomInfo.min - 1) * 2 + 1 + randomInfo.min * 2 * 2);
        if (variantsCount <= (randomInfo.min - 1) * 2) {
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

    /**
     *
     * @param randomInfo
     * Вормируется ответ для деления
     * @private
     */
    _makeWrongAnswerFor3(randomInfo) {
        this._makeWrongAnswerFor2(randomInfo);
    }
}

export default TaskGenerator;