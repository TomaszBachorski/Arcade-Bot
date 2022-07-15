module.exports = {
    footerDate: ()=>{
        return new Date().toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
    }
}