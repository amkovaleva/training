class TrainingCollector {
    _trainings = [];
    _loaded = false;

    constructor() {
        let item = localStorage.getItem("trainings"),
            data = null;
        if (item)
            data = JSON.parse(item);
        if (data)
            this._trainings = data;
        else
            this._testCollection()

        this._loaded = true;
    }

    collect(info) {
        let day = this._todayStr,
            todayInfo = this._trainings[day];
        if (!todayInfo)
            todayInfo = [{
                n: 0,
                t: 0,
                an: 0,
                cAn: 0,
            }, {
                n: 0,
                t: 0,
                an: 0,
                cAn: 0,
            }];

        for (let key in todayInfo[info.type]){
            if(!todayInfo[info.type].hasOwnProperty(key))
                continue;
            todayInfo[info.type][key] += 1 * info[key]
        }

        this._trainings[day] = todayInfo;

        localStorage.setItem("trainings", JSON.stringify(Object.assign({},  this._trainings)));
    }

    get collection(){
        return this._trainings;
    }


    get _todayStr() {
        return this._dataStr();
    }

    _dataStr(date = new Date()){
        date = this._dateWithoutTime(date);
        return date.getTime();
    }

    _dateWithoutTime(date = new Date()){
        date.setHours(0,0,0,0);
        return date;
    }

    _testCollection() {
        let today = this._dateWithoutTime(), curDate = this._dateWithoutTime();
        curDate.setDate(curDate.getDate() - 400);
        while (curDate <= today) {
            let isTraining = Math.round(Math.random());

            if (isTraining)
                this._trainings[this._dataStr(curDate)] = this._testDay;

            curDate.setDate(curDate.getDate() + 1);
        }
    }

    get _testDay(){
        let t = this._taskTime, n1 = this._randomInt(20), n2 = this._randomInt(20),
        s1 = this._randomInt(60), s2 = this._randomInt(40),
        p1 = this._randomInt(100), p2 = this._randomInt(100);

        if(n1 && !s1)
            s1 = 30;
        if(n2 && !s2)
            s2 = 30;

        let an1 = n1 * t * s1, an2 = n2 * t * s2;

        return [{
            n: n1,
            t: n1 * t,
            an: an1,
            cAn: Math.floor(p1 * an1 / 100),
        },{
            n: n2,
            t: n2 * t,
            an: an2,
            cAn:  Math.floor(p2 * an2 / 100),
        }];
    }

    _randomInt(max) {
        return Math.floor(Math.random() * (max + 1));
    }

    get _taskTime() {
        return (window.settings) ? window.settings.time.training : 90;
    }
}


export default TrainingCollector;