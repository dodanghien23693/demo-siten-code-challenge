'use strict';

//angular.module('mamifood', [])
team1.factory('mamifoodService', function ($http, $state) {

    var DSTinh = null;
    var flagDSTinh = false;

    var DSQuanHuyen = null;
    var flagDSQuanHuyen = false;

    var DSKho = null;
    var flagDSKho = false;

    var DSNhaCungCap = null;
    var flagDSNhaCungCap = false;

    var DSDanhMuc = null;
    var flagDSDanhMuc = false;

    var pad = function(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    return {

        pad: pad,
        onlyNumbers:/^\d+$/,
        flagDSTinh: flagDSTinh,
        getDSTinh: function () {
            return new Promise(function (resolve, reject) {
                if (DSTinh == null && !flagDSTinh) {
                    flagDSTinh = true;
                    mgCnn.address.getProvinces({})
                    .done(function (resp) {
                        DSTinh = resp.provinces;
                        resolve(DSTinh);
                    })
                    .fail(function (err) {
                        swal('', 'Lỗi get danh sách tỉnh', 'error');
                    })
                }
                else {
                    resolve(DSTinh);
                }
            })

        },

        flagDSQuanHuyen: flagDSQuanHuyen,
        getDSQuanHuyen: function () {
            return new Promise(function (resolve, reject) {
                if (DSQuanHuyen == null && !flagDSQuanHuyen) {
                    flagDSQuanHuyen = true;
                    mgCnn.address.getDistricts()
                    .done(function (resp) {
                        DSQuanHuyen = resp.districts;

                        resolve(DSQuanHuyen);
                    })
                    .fail(function (err) {
                        swal('', 'Lỗi get danh sách quận huyện', 'error');
                    })
                }
                else {
                    resolve(DSQuanHuyen);
                }
            })

        },

        flagDSKho: flagDSKho,
        getDSKho: function () {
            return new Promise(function (resolve, reject) {
                if (DSKho == null && !flagDSKho) {

                    flagDSKho = true;
                    mgCnn.stock.searchStocks({ limit: 200, sortBy: "name", sortType:"asc" })
                   .done(function (resp) {
                       DSKho = resp.stocks;
                       resolve(DSKho);
                   })
                   .fail(function (err) {
                       swal('', "Lỗi load dữ liệu", 'error');
                   })
                }
                else {
                    resolve(DSKho);
                }
            })

        },

        flagDSNhaCungCap: flagDSNhaCungCap,
        getDSNhaCungCap: function () {
            return new Promise(function (resolve, reject) {
                if (DSNhaCungCap == null && !flagDSNhaCungCap) {
                    flagDSNhaCungCap = true;

                    mgCnn.supplier.searchSuppliers({ limit: 200, sortBy: "name", sortType: "asc" })
                    .done(function (resp) {
                        DSNhaCungCap = resp.suppliers;
                        resolve(DSNhaCungCap);
                    })
                    .fail(function (resp) {
                        swal('', "Lỗi load dữ liệu", 'error');
                    })
                }
                else {
                    resolve(DSNhaCungCap);
                }
            })

        },

        flagDSDanhMuc: flagDSDanhMuc,
        getDSDanhMuc: function () {
            return new Promise(function (resolve, reject) {
                // do a thing, possibly async, then…
                if (DSDanhMuc == null && !flagDSDanhMuc) {
                    flagDSDanhMuc = true;
                    mgCnn.product.getAllCategories()
                    .done(function (resp) {
                        DSDanhMuc = resp.categories;

                        resolve(DSDanhMuc);
                        //return DSDanhMuc;
                    })
                    .fail(function (err) {
                        swal('', 'Lỗi load danh mục sản phẩm', 'error');
                    })
                }
                else {
                    resolve(DSDanhMuc);
                }
            });
        },

        getUrl: function (routeName, params, options) {
            return $state.href(routeName, params, options);
        },
        convertToLocalDate : function(isoDateString, plusTime) {
            if (isoDateString != undefined) {
                if (!isoDateString.endsWith("Z")) isoDateString = isoDateString + "Z";
                var d = new Date(isoDateString);
                var extraTime = 0;
                if (plusTime != undefined) extraTime = plusTime;

                var localTime = d.getTime() + extraTime;

                var localDate = new Date(localTime);
                var time = pad(localDate.getHours(),2) + ":" + pad(localDate.getMinutes(),2) + ":" + pad(localDate.getSeconds(),2);
                var result = localDate.toLocaleDateString() + " " + time;

                return result;
            } else {
                return "";
            }

        },
       convertToISODate : function(localDateString) {

            if (localDateString != undefined && localDateString != "") {
                var spaceIndex = localDateString.indexOf(" ");
                var time = "";
                var dateArray;
                if (spaceIndex >= 0) {
                    dateArray = localDateString.substring(0, spaceIndex).split("/")
                }
                else {
                    dateArray = localDateString.split("/");
                }

                var date = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
                
                if (spaceIndex >= 0) {
                    time = " "+localDateString.substring(spaceIndex + 1, localDateString.length);
                }
                var d = new Date(date + time);
                var localTime = d.getTime() + 420 * 60000;
                var localDate = new Date(localTime);
                var result = localDate.toISOString();
                if (result.indexOf("Z") >= 0) {
                    result = result.substring(0, result.length - 1);
                }
                return result;
            } else {
                return "";
            }
        },

       logout: function () {
           mgCnn.account.logout({})
           .done(function (resp) {
               window.location = "/dang-nhap";
           });
       },

       formatNumber: function (toFormat) {
           if (toFormat == undefined) return "";
           return toFormat.toString().replace(
             /\B(?=(\d{3})+(?!\d))/g, "."
           );
       }
    }
});



