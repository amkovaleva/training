export default {
    install: (app, options) => {

        let item = localStorage.getItem("settings"), data = null;
        if (item)
            data = JSON.parse(item);

        if(data)
            options =  data;

        app.provide('settings', options);

        app.config.globalProperties.$getSetting = key => {
            return key.split('.').reduce((o, i) => {
                if (o) return o[i]
            }, options)
        };

        app.config.globalProperties.$settings = key => {
            return options;
        };

        app.config.globalProperties.$saveSettings = (settings) => {
            localStorage.setItem("settings", JSON.stringify(settings));
            options = settings;
        };
    }
}