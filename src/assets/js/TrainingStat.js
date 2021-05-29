class TrainingStat {

    _isAllInOneYear = false;
    _isAllInOneMonth = false;
    _minDate = null;
    _maxDate = null;

    _answerPer = [[], [], []];
    _answerSpeed = [[], [], []];
    _answerTimestamps = [];

    _setsSpeed0 = [[], [], []];
    _setsSpeed1 = [[], [], []];
    _setsSpeed2 = [[], [], []];

    _setsPer0 = [[], [], []];
    _setsPer1 = [[], [], []];
    _setsPer2 = [[], [], []];

    _setsLabels0 = [];
    _setsLabels1 = [];
    _setsLabels2 = [];


    constructor(trainings, infoType, infoTime) {
        for (let day in trainings) {
            if (!trainings.hasOwnProperty(day))
                continue;

            let info = trainings[day];

            this._answerTimestamps.push(day * 1);

            let perS = (!info[0].an) ? 0 : info[0].cAn / info[0].an * 100,
                perA = (!info[1].an) ? 0 : info[1].cAn / info[1].an * 100;

            this._addStat(this._answerPer, perS, perA);

            let speedS = (!info[0].an) ? 0 : info[0].an / info[0].t,
                speedA = (!info[1].an) ? 0 : info[1].an / info[1].t;

            this._addStat(this._answerSpeed, speedS, speedA);
        }

        if (!this.infoCount)
            return;

        this._minDate = new Date(this._answerTimestamps[0]);
        this._maxDate = new Date(this._answerTimestamps[this.infoCount - 1]);

        if (this._minDate.getFullYear() === this._maxDate.getFullYear())
            this._isAllInOneYear = true;

        if (this._isAllInOneYear && this._minDate.getMonth() === this._maxDate.getMonth())
            this._isAllInOneMonth = true;

        this._fillSets(!!infoType, infoTime);
    }

    get infoCount(){
        return this._answerTimestamps.length;
    }

    datasets(isSpeedInfo, timeInfo) {

        this._fillSets(isSpeedInfo, timeInfo);

        let sets = this[`_sets${isSpeedInfo ? 'Speed' : 'Per'}${timeInfo}`],
            labels = this[`_setsLabels${timeInfo}`];
        //console.log(data);
        return {
            labels: labels,
            datasets: [
                {
                    label: 'Верно/Неверно',
                    data: sets[0],
                    borderColor: 'green',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4
                },
                {
                    label: 'Дай ответ',
                    data: sets[1],
                    borderColor: 'blue',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4
                },
                {
                    label: 'В среднем',
                    data: sets[2],
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4
                }
            ]
        };
    }

    _fillSets(isSpeedInfo, timeInfo) {
        if (this[`_sets${isSpeedInfo ? 'Speed' : 'Per'}${timeInfo}`][0].length > 0)
            return;

        let firstDate = this._gerStartChartDate(timeInfo);

        let stat = this[`_sets${isSpeedInfo ? 'Speed' : 'Per'}${timeInfo}`],
            labels = this[`_setsLabels${timeInfo}`],
            isLabelsFilled = !!labels.length;

        let times = Object.assign([], this._answerTimestamps),
            statsOrigin = Object.assign([], isSpeedInfo ? this._answerSpeed : this._answerPer);

        while (firstDate <= this._maxDate) {
            let nextDate = this._getNextStatDate(firstDate, timeInfo),
            firstTime = firstDate.getTime(), nextTime = nextDate.getTime();

            let indexes = times.map((item, index) => {
                if (item >= firstTime && item < nextTime)
                    return index;
                return null;
            }).filter((i) => i !== null);

            if (!isLabelsFilled)
                labels.push(this._getLabel(firstDate, timeInfo));

            this._addStat(stat, this._getAvg(indexes, statsOrigin[0]), this._getAvg(indexes, statsOrigin[1]));

            this._removeByIndexNo(indexes, [times, statsOrigin[0], statsOrigin[1], statsOrigin[2]]);
            firstDate = nextDate;
        }

    }

    _getAvg(indexes, list) {
        if(!indexes.length)
            return null;
        let avg = list.filter((el, i) => indexes.includes(i)).reduce(function (sum, current) {
            return sum + current;
        }, 0) / indexes.length || 0;
        return Math.floor(avg);
    }

    _gerStartChartDate(timeInfo) {
        let firstDate = new Date(this._minDate.getTime());

        if (timeInfo === 1) {
            let day = firstDate.getDay(),
                diff = firstDate.getDate() - day + (day === 0 ? -6 : 1);
            firstDate.setDate(diff);
        } else if (timeInfo === 2)
            firstDate.setDate(1);
        return firstDate;
    }

    _getNextStatDate(date, timeInfo) {
        let nextDate = new Date(date.getTime());
        if (timeInfo === 2)
            nextDate.setMonth(nextDate.getMonth() + 1);
        else
            nextDate.setDate(nextDate.getDate() + (timeInfo ? 7 : 1));
        return nextDate;
    }

    _removeByIndexNo(indexes, lists) {
        lists.forEach((list)=> {
            list = list.filter((item, i) => indexes.includes(i));
            }
        )
    }

    _addStat(addTo, sInfo, AInfo) {
        let avgInfo = Math.floor((!sInfo) ? AInfo : ((!AInfo) ? sInfo : (sInfo + AInfo) / 2));
        addTo[0].push(sInfo);
        addTo[1].push(AInfo);
        addTo[2].push(avgInfo);
    }

    _getLabel(date, timeInfo) {

        let label;
        if (this._isAllInOneMonth)
            label = `${timeInfo === 2 ? '' : date.getDate()} ${date.toLocaleDateString('default', {weekday: 'short'})}`;
        else {
            label = `${timeInfo === 2 ? '' : date.getDate()} ${date.toLocaleDateString('default', {month: 'short'})}`;

            if (this._isAllInOneYear)
                return label;

            label += ` ${date.getFullYear().toString().substr(-2)} `
        }
        return label;

    }

}


export default TrainingStat;