module.exports = {
    addSpace(str) {
        return str.replace(/([A-Z])/g, ' $1').trim();
    },

    actionTypeToId(type) {
        return type.toLowerCase().replace(/_/g, '-');
    },

    tsToString(ts) {
        let date = new Date(ts);
        let YYYY = date.getFullYear(),
            MM = date.getMonth(),
            DD = date.getDate(),
            hh = date.getHours(),
            mm = date.getMinutes(),
            ss = date.getSeconds()
        
        return `${YYYY}/${MM}/${DD} ${hh}:${mm}:${ss}`;
    }
}