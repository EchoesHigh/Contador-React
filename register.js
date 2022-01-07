// if("serviceWorker" in navigator) {
//     console.log("Si existe");
// }
//Es lo mismo
// if ( navigator.serviceWorker ) {
//     console.log("Si existe");
// }

if ( navigator.serviceWorker ) {
    console.log("Si existe");
    navigator.serviceWorker.register("./serviceWorker.js");
}