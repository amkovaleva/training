class TrainingStat {
    _trainingStats = [];
    _isAllInOneYear = false;
    _isAllInOneMonth = true;

    constructor(trainings) {
        for (let day in trainings) {
            if (!trainings.hasOwnProperty(day))
                continue;

            let info = trainings[day],
                date = this._getDateByStr(day),
                dailyStat = {
                    date: date,
                    simpleTrN: info[0].n,
                    answerTrN: info[1].n,
                    simpleTrT: info[0].t,
                    answerTrT: info[1].t,

                    simpleTr: info[0].an,
                    answerTr: info[1].an,
                    simpleTrC: info[0].cAn,
                    answerTrC: info[1].cAn,
                }
            this._trainingStats.push(dailyStat);
        }
        if (!this._trainingStats.length)
            return;

        this._trainingStats.sort(function (a, b) {
            return a.date - b.date;
        });

        let minDate = new Date(this._trainingStats[0].date),
            maxDate = new Date(this._trainingStats[this._trainingStats.length - 1].date);

        if (minDate.getFullYear() === maxDate.getFullYear())
            this._isAllInOneYear = true;

        if (this._isAllInOneYear && minDate.getMonth() === maxDate.getMonth())
            this._isAllInOneMonth = true;

        this._generateLabels();
    }

    _getDateByStr(timestamp) {
        return new Date(timestamp);
    }

    _generateLabels() {
        let label = '';
        this._trainingStats.forEach((dayStat) => {
            let date = new Date(dayStat.date);

            if (this._isAllInOneMonth) {
                label = `${date.getDay()} ${date.toLocaleDateString('default', {weekday: 'short'})}`;

            } else {
                label = `${date.getDay()} ${date.toLocaleDateString('default', {month: 'short'})}`;

                if (this._isAllInOneYear)
                    return;

                label += ` ${date.getFullYear().toString().substr(-2)} `

            }
            dayStat.label = label;
        });
    }
}


export default TrainingStat;