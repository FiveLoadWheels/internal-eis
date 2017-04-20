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
            MM = date.getMonth() + 1,
            DD = date.getDate(),
            hh = date.getHours(),
            mm = date.getMinutes(),
            ss = date.getSeconds()
        
        return `${YYYY}/${xx(MM)}/${xx(DD)} ${xx(hh)}:${xx(mm)}:${xx(ss)}`;
    }
}

function xx(x) {
    return x.toString().length === 1 ? '0' + x : x;
}