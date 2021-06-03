import TaskGenerator from "../../assets/js/TaskGenerator";

class Helper {

    static TRAININGS_STORAGE_NAME = 'trainings';
    static STAT_PERIOD_STRINGS = {day: 'day', week: 'week', month: 'month'};
    static STAT_PERIODS = [Helper.STAT_PERIOD_STRINGS.day, Helper.STAT_PERIOD_STRINGS.week, Helper.STAT_PERIOD_STRINGS.month];

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

    static dateCode(date = new Date()) {
        date = Helper._dateWithoutTime(date);
        return date.getTime();
    }

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

    static _dateWithoutTime(date = new Date()) {
        date.setHours(0, 0, 0, 0);
        return date;
    }

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

    static _resetSatObj(statObj = {}) {
        statObj.labels = [];
        statObj.speedStat = [[], [], []];
        statObj.correctStat = [[], [], []];
        return statObj;
    }

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

    static _getNextStatDate(date, period) {
        let nextDate = new Date(date.getTime());
        if (period === Helper.STAT_PERIOD_STRINGS.month)
            nextDate.setMonth(nextDate.getMonth() + 1);
        else
            nextDate.setDate(nextDate.getDate() + (Helper.STAT_PERIOD_STRINGS.week ? 7 : 1));
        return nextDate;
    }

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

    static _avg(values) {
        let mainItems = values.filter(item => item > 0);
        if (!mainItems.length)
            return 0;
        return mainItems.reduce((a, b) => a + b) / mainItems.length;
    }

    static _fillStat(statObj, baseStatInfo) {
        if(!baseStatInfo.trainings.size)
            return;

        let currDate = Helper._gerStartChartDate(baseStatInfo);

        while (currDate <= baseStatInfo.maxDate) {

            let nextDate = Helper._getNextStatDate(currDate, baseStatInfo.period),
                curTime = currDate.getTime(), nextTime = nextDate.getTime();

            let trInPeriod = [];

            Array.from(baseStatInfo.trainings.keys()).filter(index => {
                return index >= curTime && index < nextTime;
            }).forEach(day =>{
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

                speed[index] = !isAnExists ? 0 :periodStat[index].an / periodStat[index].t;
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

    static _randomInt(max) {
        return Math.floor(Math.random() * (max + 1));
    }
}

export default Helper;