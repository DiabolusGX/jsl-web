
module.exports = (UNIX_timestamp) => {

    if(isNaN(UNIX_timestamp)) return "Undefined";
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = '**On** : ' + date + ' ' + month + ' ' + year + ',\n**At** : ' + hour + ':' + min + ':' + sec;
    let myTime = date + 'th, ' + month + ', ' + year;
    let myDate = a.toUTCString();
    return myTime;
    
}