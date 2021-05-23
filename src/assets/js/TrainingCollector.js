class TrainingCollector {
    _trainings = {};
    _loaded = false;

    constructor() {
        let item = localStorage.getItem("trainings"),
            data = null;
        if (item)
            data = JSON.parse(item);
        if (data)
            this._trainings = data;

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

        for (let key in todayInfo[info.type])
            todayInfo[info.type][key] += 1 * info[key]

        this._trainings[day] = todayInfo;
        console.log(this._trainings);
        localStorage.setItem("trainings", JSON.stringify(Object.assign({},  this._trainings)));
    }

    get collection(){
        return this._trainings;
    }

    get _todayStr() {
        let date = new Date();
        date.setHours(0,0,0,0)
        return `${date.getTime()}`;
    }
}


export default TrainingCollector;