function data(id,currency) {
    var id=id;
    var currncy=currency;

    this.getId =function () {
        return id;
    }
    this.getCurrncy=function () {
        return currncy;
    }
    this.setId=function (idVal) {
        id=idVal;
    }
    this.setCurrncy=function (curruncyVal) {
        currncy=curruncyVal;
    }
}
