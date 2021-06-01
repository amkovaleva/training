
import Helper from './Helper'

export default {
    install: (app, isTestMode) => {

        let trainings = [], settings = app.config.globalProperties.$settings(),
            item = localStorage.getItem("trainings"), data = null;

        if (item)
            data = JSON.parse(item);

        if(data)
            trainings =  data;
        else if(isTestMode){
            trainings = Helper.testCollection();
        }

        app.config.globalProperties.$collectTraining = info => {

            /*
            *
            * info = {
            *   isYesNo: this.type == 1,
            *   total: this.totalAnswers,
            *   correct: this.correctAnswers
            * }
            * */
            let day = Helper.dateStr(),
                todayInfo = trainings[day];
            if (!todayInfo)
                todayInfo = [{ n: 0, t: 0, an: 0, cAn: 0 }, { n: 0, t: 0, an: 0, cAn: 0 }];

            let totalPart = todayInfo[info.isYesNo ? 0 : 1];
            totalPart.n++;
            totalPart.t += 1 * settings.time.training;
            totalPart.an += info.total;
            totalPart.cAn += info.correct;

            trainings[day] = todayInfo;
            localStorage.setItem("trainings", JSON.stringify(Object.assign([],  trainings)));
        };
    }
}