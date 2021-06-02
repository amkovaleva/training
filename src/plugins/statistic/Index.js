import Helper from './Helper'

export default {
    install: (app, isTestMode) => {

        let trainings = Helper.getSavedInfo(isTestMode),
            settings = app.config.globalProperties.$settings(),
            statData = Helper.generateStatInfo(trainings);
        /*
        *
        * info = {
        *   isYesNo: this.type == 1,
        *   total: this.totalAnswers,
        *   correct: this.correctAnswers
        * }
        * */
        app.config.globalProperties.$collectTraining = info => {

            let day = Helper.dateCode(),
                todayInfo = trainings.get(day);
            if (!todayInfo)
                todayInfo = [{n: 0, t: 0, an: 0, cAn: 0}, {n: 0, t: 0, an: 0, cAn: 0}];

            let totalPart = todayInfo[info.isYesNo ? 0 : 1];
            totalPart.n++;
            totalPart.t += 1 * settings.time.training;
            totalPart.an += info.total;
            totalPart.cAn += info.correct;

            trainings.set(day, todayInfo);
            localStorage.setItem(Helper.TRAININGS_STORAGE_NAME, JSON.stringify(Object.fromEntries(trainings)));
        };

        app.config.globalProperties.$updateStatData = () => {
            statData = Helper.generateStatInfo(trainings);
        };

        app.config.globalProperties.$getStatData = (period, isSpeed) => {
            let stat = statData[period];
            return {
                labels: stat.labels,
                datasets: [
                    {
                        label: 'Верно/Неверно',
                        data:  isSpeed ? stat.speedStat[0] : stat.correctStat[0],
                        borderColor: 'green',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4
                    },
                    {
                        label: 'Дай ответ',
                        data:  isSpeed ? stat.speedStat[1] : stat.correctStat[1],
                        borderColor: 'blue',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4
                    },
                    {
                        label: 'В среднем',
                        data:  isSpeed ? stat.speedStat[2] : stat.correctStat[2],
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4
                    }
                ]
            };
        };

    }
}