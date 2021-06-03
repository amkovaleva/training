export default {
    install: (app, options) => {

        let item = localStorage.getItem("settings"), data = null;
        if (item)
            data = JSON.parse(item);

        if (data)
            options = data;

        app.provide('settings', options);

        /**
         *
         * @param key - Строковое представление свойства, которое нужно получить из настроек.
         * Разделитель - точка
         * @returns {*} - Значение запрошенной настройки
         */
        app.config.globalProperties.$getSetting = key => {
            return key.split('.').reduce((o, i) => {
                if (o) return o[i]
            }, options)
        };
        /**
         *
         * @returns {*} - объект настроек
         */
        app.config.globalProperties.$settings = () => {
            return options;
        };

        /**
         *
         * @param settings - Объект настроек для сохранения
         * Сохраняет настройки в localStorage
         */
        app.config.globalProperties.$saveSettings = (settings) => {
            localStorage.setItem("settings", JSON.stringify(settings));
            options = settings;
        };
    }
}