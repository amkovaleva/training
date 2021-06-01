import TaskGenerator from "../../assets/js/TaskGenerator";

class Helper {
    static testCollection(){
        let trainings = []
        let today = Helper.dateWithoutTime(), curDate = Helper.dateWithoutTime();
        curDate.setDate(curDate.getDate() - 400);
        while (curDate <= today) {
            let isTraining = Math.round(Math.random());

            if (isTraining)
                trainings[curDate.getTime()] = this._testDay();

            curDate.setDate(curDate.getDate() + 1);
        }
        return trainings;
    }

    static dateWithoutTime(date = new Date()){
        date.setHours(0,0,0,0);
        return date;
    }

    static dateStr(date = new Date()){
        date = Helper.dateWithoutTime(date);
        return date.getTime();
    }

    static _testDay(){
        let t = 90, n1, n2, s1, s2, p1, p2;
        n1 = Helper.randomInt(20);
        n2 = Helper.randomInt(20);
        s1 = Helper.randomInt(60);
        s2 = Helper.randomInt(40);
        p1 = Helper.randomInt(100);
        p2 = Helper.randomInt(100);

        if (n1 && !s1)
            s1 = 30;
        if (n2 && !s2)
            s2 = 30;

        let an1 = n1 * t * s1, an2 = n2 * t * s2;

        return [{
            n: n1,
            t: n1 * t,
            an: an1,
            cAn: Math.floor(p1 * an1 / 100),
        }, {
            n: n2,
            t: n2 * t,
            an: an2,
            cAn: Math.floor(p2 * an2 / 100),
        }];
    }

    static randomInt(max){
        return Math.floor(Math.random() * (max + 1));
    }
}
export default Helper;