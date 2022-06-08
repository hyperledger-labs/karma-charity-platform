//--------------------------------------------------------------------------
//
//	Common
//
//--------------------------------------------------------------------------

function cookieGet(name) {
    var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
}

//--------------------------------------------------------------------------
//
//	Theme
//
//--------------------------------------------------------------------------

function themeSet(themeCookieName) {
    var theme = cookieGet(themeCookieName);
    if (theme) {
        document.body.className = `${theme}-theme`;
    }
}

//--------------------------------------------------------------------------
//
//	Main
//
//--------------------------------------------------------------------------

var global = global || window;
