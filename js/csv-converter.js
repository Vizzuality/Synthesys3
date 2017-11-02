// https://github.com/bsusensjackson/json2csv
var csvConverter;
csvConverter = csvConverter || {}, function () {
  "use strict";
  return csvConverter = {
    convert: function (e) {
      var t = "object" != typeof e ? JSON.parse(e) : e, r = Object.keys(t[0]),
        n = this.parseHeaders(r, t), o = this.parseBody(t, n);
      return this.open(o)
    }, parseHeaders: function (e) {
      var t = "";
      return e.forEach(function (e) {
        t += e + ","
      }), t += "\r\n"
    }, parseBody: function (e, t) {
      var r, n, o;
      return e.forEach(function (e, c) {
        o = "";
        for (c in e) {
          "" !== o && (o += ","), r = /\,/, "string" == typeof(n = e[c]) && (n = r.test(n) ? '"' + n + '"' : n), o += n;
        }
        t += o + "\r\n"
      }), t
    }, open: function (e) {
      if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) {
        var t = new Blob([e], { type: "text/csv;charset=utf-8;" });
        return window.navigator.msSaveBlob(t, "tcm-01.csv")
      }
      var r = "data:text/csv;charset=utf-8," + escape(e), n = document.createElement("a");
      return n.setAttribute("href", r), n.setAttribute("target", "_blank"), n.setAttribute("rel", "noopener noreferrer"), n.setAttribute("download", "download.csv"), document.body.appendChild(n), n.click()
    }
  }
}.call(this);
