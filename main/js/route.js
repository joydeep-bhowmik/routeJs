/*
MIT License

Copyright (c) 2023 Joydeep Bhowmik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function route() {
    this.param = {};
}

route.prototype.live = function(selector, evt, handler) {
    document.addEventListener(evt, function(event) {
        if (event.target.matches(selector + ', ' + selector + ' *')) {
            handler.apply(event.target.closest(selector), arguments);
        }
    }, false);
}
route.prototype.init = function(args = null) {
    var onDOMLoaded = true;
    var link = "a";
    if (args) {
        if ('onDOMLoaded' in args) {
            onDOMLoaded = args['onDOMLoaded'];
        }
        if ('link' in args) {
            link = args['link'];
        }
    }

    this.live('a[_target="blank"]', "click", function() {
        window.open(this.href, "_blank")
    })
    this.live(link, "click", function(e) {
        e.preventDefault();
        if (this.href != window.location.href) {
            window.history.pushState({}, '', this.href)
            const onurlchangeEvent = new Event("onurlchange");
            document.dispatchEvent(onurlchangeEvent);
        }
    })
    window.onpopstate = function() {
        const onurlchangeEvent = new Event("onurlchange");
        document.dispatchEvent(onurlchangeEvent);
    }

    if (onDOMLoaded) {
        document.addEventListener('DOMContentLoaded', () => {
            const onurlchangeEvent = new Event("onurlchange");
            document.dispatchEvent(onurlchangeEvent);
        });
    }

}
route.prototype.isEmptyObject = function(obj) {
    if (Object.keys(obj).length > 0) {
        return false;

    } else {
        return true;
    }
}
route.prototype.setparam = function(drl, url) {
    const keys = drl.split("/");
    const values = url.toString().split("/");
    const pair = {};
    var i;
    if (keys.length == values.length) {
        for (i = 0; i < keys.length; i++) {
            // if key and values are not equal,then they must be dynamic values
            if (keys[i] != values[i]) {
                if (keys[i].match(/{|}/g)) //if dynamic values
                {
                    pair[keys[i].replace(/{|}/g, '')] = values[i];
                    console.log(pair)

                } else { //if not dynamic values

                    return pair;
                }
            }
        }
    }

    return pair;
}

route.prototype.get = function(url, callback) {
    document.addEventListener("onurlchange", () => {
        const param = this.setparam(url, location.pathname);
        if (url == location.pathname) {
            callback("yes")

        } else if (Object.keys(param).length != 0) {
            {
                callback(param)
            }
        }


    });

}
route.prototype.getQueryParams = function(url = null) {

    if (!url) {
        url = location.search;
    }
    const paramArr = url.slice(url.indexOf('?') + 1).split('&');
    const params = {};
    paramArr.map(param => {
        const [key, val] = param.split('=');
        params[key] = decodeURIComponent(val);
    })
   if(Object.keys(params)[0]==""){
    return false;
   }
    return params;
}
route.prototype.render = function(html, element) {
    element.innerHTML = html;
}

//view
route.prototype.view = function(view, values = {}) {
    const newvalues = [];
    for (const [key, value] of Object.entries(values)) {
        newvalues['{{' + key + '}}'] = value;
    }
    if (view.match(/{{(.*?)}}/g)) {
        view.match(/{{(.*?)}}/g).forEach(match => {
            if (newvalues[match] != undefined) {
                var regex = new RegExp(match);
                view = view.replace(regex, newvalues[match]);
            }
        })
    }
    return view;

}
//if route path is not mentioned
route.prototype.onRouteNotAvail = function(callback) {
    const routes = this.routes;
    var i;
    document.addEventListener("onurlchange", () => {
        const results = [];
        if (!routes.includes(location.pathname)) {
            for (i = 0; i < routes.length; i++) {
                results[0] = this.setparam(routes[i], location.pathname);
                //return object
            }
            if (Object.keys(results[0]).length == 0) {
                callback();
            }
        }
    });

}
