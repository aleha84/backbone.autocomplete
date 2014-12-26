function render(tmpl_name, tmpl_data) {
    if (!render.tmpl_cache) {
        render.tmpl_cache = {};
    }

    if (!render.tmpl_cache[tmpl_name]) {
        var tmpl_string = $('#' + tmpl_name + 'Template').html();
        render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
    }

    return render.tmpl_cache[tmpl_name](tmpl_data);
}

function mergeByProperty(arr1, arr2, prop) {
    _.each(arr2, function (arr2obj) {
        var arr1obj = _.find(arr1, function (arr1obj) {
            return arr1obj[prop] === arr2obj[prop];
        });

        arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
}

function setValue(obj, path, value)
{
    if (obj == undefined) {
        return;
    }
    var properties = path.split(".");
    var curObj = obj;
    var i = 0;
    for (; i < properties.length -1; i++) {
        curObj = curObj[properties[i]];
    }
    curObj[properties[i]] = value;
}

function getValue(obj, path)
{
    if (obj == undefined)
    {
        return '';
    }
    var properties = path.split(".");
    var curObj = obj;
    for(var i = 0;i<properties.length;i++)
    {
        if (curObj == null) {
            return;
        }
        curObj = curObj[properties[i]];
    }
    return curObj;
}