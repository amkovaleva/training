class Helper {

    /**
     * Ключ, по которому производится сохранение информации в localStorage
     * @type {string}
     */
    static TRAININGS_STORAGE_NAME = 'trainings';

    /**
     * Тип интервала. То, по сколько дней мы группируем данные
     * @type {{week: string, month: string, day: string}}
     */
    static STAT_PERIOD_STRINGS = {day: 'day', week: 'week', month: 'month'};

    /**
     * Строковое представление интервалов
     * @type {[string, string, string]}
     */
    static STAT_PERIODS = [Helper.STAT_PERIOD_STRINGS.day, Helper.STAT_PERIOD_STRINGS.week, Helper.STAT_PERIOD_STRINGS.month];

    /**
     * Получаем информацию по тренировкам при загрузке страницы (установке плагина)
     * @param isTestMode - Нужно ли тестовое заполенение данными в случае отсутствия их в localStorage
     * @returns {Map<any, any>} - Коллекция тренировок:
     * - key - время тренировки с точностью до дня,
     * - value - статискика по дню
     */
    static getSavedInfo(isTestMode) {

        let trainings = new Map(),
            item = localStorage.getItem(Helper.TRAININGS_STORAGE_NAME), data = null;

        if (item)
            data = new Map(Object.entries(JSON.parse(item)));

        if (data)
            trainings = data;
        else if (isTestMode) {
            trainings = Helper._testCollection();
        }
        return trainings;
    }

    /**
     *
     * @param date - дата, ключ для которой нужно сгенерировать. По умолчанию: сегодня.
     * @returns {number} - ключ (timestamp) для дня тренировки
     */
    static dateCode(date = new Date()) {
        date = Helper._dateWithoutTime(date);
        return date.getTime();
    }

    /**
     * Формируем основные данные для диаграммы
     * @param trainings - стисок (Map<any, any>) тренировок
     * @returns {{week: {}, month: {}, day: {}}} - Полная статистика для каждого временного периода
     * {
     * labels = [];
     * speedStat = [[], [], []];
     * correctStat = [[], [], []];
     * }
     */
    static generateStatInfo(trainings) {
        let statData = {
            day: Helper._resetSatObj(),
            week: Helper._resetSatObj(),
            month: Helper._resetSatObj()
        };

        let baseStatInfo = Helper._prepareDataForStat(trainings);

        Helper.STAT_PERIODS.forEach((type) => {
            baseStatInfo.period = type;
            Helper._fillStat(statData[type], baseStatInfo)
        });
        return statData;
    }

    /**
     * Обнуляет у даты hours, min, sec, ms
     * @param date - дата. По умолчанию: сегодня
     * @returns {Date} Дата с точностью до дня
     * @private
     */
    static _dateWithoutTime(date = new Date()) {
        date.setHours(0, 0, 0, 0);
        return date;
    }

    /**
     * Формирует первоначальную информацию для статистики
     * @param trainings - Map<any, any> Коллекция тренировок
     * @returns {{minDate: Date, isAllInOneYear: boolean, trainings, isAllInOneMonth: boolean, maxDate: Date}}
     * minDate - минимальная дата среди дат тренировок
     * maxDate - максимальная дата среди дат тренировок
     * isAllInOneYear - Все тренировки происходили в одном календарном году
     * isAllInOneMonth - Все тренировки происходили в одном календарном месяце
     * trainings - Исходная коллекция тренировок
     * @private
     */
    static _prepareDataForStat(trainings) {

        let isAllInOneYear = false, isAllInOneMonth = false,
            times = Array.from(trainings.keys()),
            minDate = new Date(Math.min(...times)), maxDate = new Date(Math.max(...times));

        if (minDate.getFullYear() === maxDate.getFullYear())
            isAllInOneYear = true;

        if (isAllInOneYear && minDate.getMonth() === maxDate.getMonth())
            isAllInOneMonth = true;

        return {
            trainings: trainings,
            minDate: minDate,
            maxDate: maxDate,
            isAllInOneYear: isAllInOneYear,
            isAllInOneMonth: isAllInOneMonth,
        }
    }

    /**
     * Создает заготовку для объекта, где храниться вся статистика по виду периода
     * @param statObj - Объект для статистики по периоду. По умолчанию: {}
     * @returns {{}} - Объект с добавленными / очищенными данными.
     * @private
     */
    static _resetSatObj(statObj = {}) {
        statObj.labels = [];
        statObj.speedStat = [[], [], []];
        statObj.correctStat = [[], [], []];
        return statObj;
    }

    /**
     * Формирует label для даты
     * @param date - дата, для которой нужна подпись
     * @param baseStatInfo - базовая информация о тренировке.     *
     * minDate - минимальная дата среди дат тренировок
     * maxDate - максимальная дата среди дат тренировок
     * isAllInOneYear - Все тренировки происходили в одном календарном году
     * isAllInOneMonth - Все тренировки происходили в одном календарном месяце
     * trainings - Исходная коллекция тренировок
     * period - период, по которому нужна статистика
     *
     * @returns {string}
     * @private
     */
    static _getLabelFor(date, baseStatInfo) {

        let label;
        if (baseStatInfo.isAllInOneMonth)
            label = `${baseStatInfo.period === Helper.STAT_PERIOD_STRINGS.month ? '' : date.getDate()} ${date.toLocaleDateString('default', {weekday: 'short'})}`;
        else {
            label = `${baseStatInfo.period === Helper.STAT_PERIOD_STRINGS.month ? '' : date.getDate()} ${date.toLocaleDateString('default', {month: 'short'})}`;

            if (baseStatInfo.isAllInOneYear)
                return label;

            label += ` ${date.getFullYear().toString().substr(-2)} `
        }
        return label;

    }

    /**
     * Находит следующую дату для статистики
     * @param date - Дата, для которой в данный момент формируется статистика
     * @param period - Период, по которому формируется статистика
     * @returns {Date}
     * @private
     */
    static _getNextStatDate(date, period) {
        let nextDate = new Date(date.getTime());
        if (period === Helper.STAT_PERIOD_STRINGS.month)
            nextDate.setMonth(nextDate.getMonth() + 1);
        else
            nextDate.setDate(nextDate.getDate() + (Helper.STAT_PERIOD_STRINGS.week ? 7 : 1));
        return nextDate;
    }

    /**
     * Нахидит дату, с которой стартует диаграмма
     * @param baseStatInfo
     * @returns {Date}
     * @private
     */
    static _gerStartChartDate(baseStatInfo) {
        let firstDate = new Date(baseStatInfo.minDate.getTime());

        if (baseStatInfo.period === Helper.STAT_PERIOD_STRINGS.week) {
            let day = firstDate.getDay(),
                diff = firstDate.getDate() - day + (day === 0 ? -6 : 1);
            firstDate.setDate(diff);
        } else if (baseStatInfo.period === Helper.STAT_PERIOD_STRINGS.month)
            firstDate.setDate(1);

        return firstDate;
    }

    /**
     * Среднее арифметическое среди положительных значений массива.
     * @param values
     * @returns {number}
     * @private
     */
    static _avg(values) {
        let mainItems = values.filter(item => item > 0);
        if (!mainItems.length)
            return 0;
        return mainItems.reduce((a, b) => a + b) / mainItems.length;
    }

    /**
     * Заполняет statObj данными
     * @param statObj
     * @param baseStatInfo
     * @private
     */
    static _fillStat(statObj, baseStatInfo) {
        if (!baseStatInfo.trainings.size)
            return;

        let currDate = Helper._gerStartChartDate(baseStatInfo);

        while (currDate <= baseStatInfo.maxDate) {

            let nextDate = Helper._getNextStatDate(currDate, baseStatInfo.period),
                curTime = currDate.getTime(), nextTime = nextDate.getTime();

            let trInPeriod = [];

            Array.from(baseStatInfo.trainings.keys()).filter(index => {
                return index >= curTime && index < nextTime;
            }).forEach(day => {
                trInPeriod.push(baseStatInfo.trainings.get(day));
            });

            statObj.labels.push(Helper._getLabelFor(currDate, baseStatInfo));

            let periodStat = [];
            [0, 1].forEach(index => {
                periodStat[index] = {};
                ['n', 't', 'an', 'cAn'].forEach(prop => {
                    periodStat[index][prop] = trInPeriod.map(item => item[index][prop]).reduce((a, b) => a + b);
                });
            });

            let speed = [], percent = [];

            [0, 1].forEach(index => {
                let isAnExists = periodStat[index].an > 0;

                speed[index] = !isAnExists ? 0 : periodStat[index].an / periodStat[index].t;
                percent[index] = !isAnExists ? 0 : Math.round(periodStat[index].cAn / periodStat[index].an * 100);
            });

            speed.push(Helper._avg(speed));
            percent.push(Math.round(Helper._avg(percent)));

            [0, 1, 2].forEach(index => {
                statObj.speedStat[index].push(speed[index]);
                statObj.correctStat[index].push(percent[index]);
            });

            currDate = nextDate;
        }
    }

    /**
     * Заполнение коллекции тренировок случайными данными.
     * @returns {Map<any, any>}
     * @private
     */
    static _testCollection() {
        let trainings = new Map(), today = Helper._dateWithoutTime(), curDate = Helper._dateWithoutTime();

        curDate.setDate(curDate.getDate() - 400);
        while (curDate <= today) {
            let isTraining = Math.round(Math.random());

            if (isTraining)
                trainings.set(curDate.getTime(), this._testDay());

            curDate.setDate(curDate.getDate() + 1);
        }
        return trainings;
    }

    /**
     * Заполнение дня тренировок случайными данными.
     * @returns {[{cAn: number, t: number, an: number, n: number}, {cAn: number, t: number, an: number, n: number}]}
     * @private
     */
    static _testDay() {
        let t = 90, n1, n2, s1, s2, p1, p2;
        n1 = Helper._randomInt(20);
        n2 = Helper._randomInt(20);
        s1 = Helper._randomInt(60);
        s2 = Helper._randomInt(40);
        p1 = Helper._randomInt(100);
        p2 = Helper._randomInt(100);

        if (n1 && !s1)
            s1 = 30;
        if (n2 && !s2)
            s2 = 30;

        let an1 = n1 * t * s1, an2 = n2 * t * s2;

        return [{n: n1, t: n1 * t, an: an1, cAn: Math.floor(p1 * an1 / 100)},
            {n: n2, t: n2 * t, an: an2, cAn: Math.floor(p2 * an2 / 100)}];
    }

    /**
     *
     * @param max
     * @returns {number} - Случайное целое число в [0, max]
     * @private
     */
    static _randomInt(max) {
        return Math.floor(Math.random() * (max + 1));
    }
}

export default Helper;