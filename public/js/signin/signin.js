/**
 * Created with Home Web.
 * User: jasommer350
 * Date: 2015-01-09
 * Time: 06:40 PM
 * To change this template use Tools | Templates.
 */


document.getElementById("loginsubmit").addEventListener("click", function(evt) {
    window.utilities.sendLogin({"username": "justin", "password": "password"}, "/signin", "responseId", "UlId")
});