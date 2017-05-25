/**
 * Created by John Gorven on 2017/4/29.
 */
/**
 * mainBg
 */
var pageW = gar.getFullPageWH('w'), pageH = gar.getFullPageWH('h'),
    mainBg = new gar.component.EllipseWhirl({
        imgs: ['img/bg_r1_c6.png', 'img/bg_r2_c1.png', 'img/bg_r5_c5.png', 'img/bg_r6_c2.png'],
        x0: pageW / 1.9,
        y0: pageH >> 1,
        a: pageW / 2.6,
        b: pageH / 2.4
    });
mainBg.init();
for (var aMenu = getEls('#menu > li > a'), l = aMenu.length; l--;)mainBg.stopAnim(aMenu[l]);
for (var aModal = getEls('.gar-canvasModal'), len = aModal.length; len--;)mainBg.stopAnim(aModal[len]);

/**
 * modal
 */
var mET = gar.component.customEvents.modalEvent;
mET.trigger(0, 'rewriteHeading', 'ADD CONTACT');
mET.trigger(1, 'rewriteHeading', 'MODIFY INFO');
mET.trigger(2, 'rewriteHeading', 'DELETE CONTACT');
mET.trigger(3, 'rewriteHeading', 'SEARCH CONTACT');

/**
 * table
 */
var lS = gar.getLocalStorage(),
    dic = new gar.Dictionary(lS.getItem('contact-data') ? JSON.parse(lS.getItem('contact-data')).dataStore : {});

var ths = getEls('.gar-table th'),

    table = new gar.component.MFTable(
        getEl('.gar-table'), dic, [ths[0], ths[1]]
    ),

    tDic = table.data;


/**
 * data interface handle
 */

//add
var addF = getEl('#addForm'), addBtn = addF.querySelector('button');
gar.addHandler(addBtn, 'click', function () {
    //validate
    if (addF.add_id.value.toString().length != 10)return alert('id\'s id must be 10!');

    //submit
    tDic.add(addF.add_id.value, {
        name: addF.add_name.value,
        id: addF.add_id.value,
        tel: addF.add_tel.value,
        phone: addF.add_phone.value,
        qq: addF.add_qq.value
    });
    alert('Add successfully!');
    update(addF);
}, false);

//modify
var modifyF = getEl('#modifyForm'), modifyBtn = modifyF.querySelector('button');
gar.addHandler(modifyBtn, 'click', function () {
    //validate

    //submit
    var key = tDic.find(modifyF.modify_id.value);
    if (!key)return alert('This contact does not exit!');
    tDic.add(modifyF.modify_id.value, {
        name: modifyF.modify_name.value,
        id: modifyF.modify_id.value,
        tel: modifyF.modify_tel.value,
        phone: modifyF.modify_phone.value,
        qq: modifyF.modify_qq.value
    });
    alert('Modify successfully!');
    update(modifyF);

}, false);

//delete
var delF = getEl('#delForm'), delBtn = delF.querySelector('button');
gar.addHandler(delBtn, 'click', function () {
    //validate

    //submit
    var result = new Array;
    gar.each(tDic.dataStore, function (i, item, len) {
        if (item.name === delF.delete_name.value)result.push(item.id);
    });

    //if use binarySearch, data name must be sorted in advance


    if (result.length === 0)return alert('This contact does not exist!');
    gar.reverseEach(result, function (i, item, len) {
        tDic.remove(item);
    });
    alert('Delete successfully!');
    update(delF);
}, false);

//search
var searchF = getEl('#searchForm'), searchBtn = searchF.querySelector('button'),
    closeBtn = getEl('#checkBtn');
gar.addHandler(searchBtn, 'click', function () {
    //validate

    //linear
    var tmpDic = {dataStore: {}}, result = tmpDic.dataStore;
    gar.each(tDic.dataStore, function (i, item, len) {
        if (item.name === searchF.search_name.value)result[i] = item;
    });

    //binarySearch
    //binarySearch(tDic.dataStore,searchF.search_name.value,'name');


    if (JSON.stringify(result) == '{}')return alert('This contact does not exist!');

    //clone
    table.changeData(tmpDic);

    //update
    update(searchF);

    alert('Search successfully!');
    //open table at once
    mET.trigger(4, 'openBoxFn');

}, false);


//reset data
gar.addHandler(closeBtn, 'click', function () {
    table.changeData(dic);
    //update table
    table.showData();
    mET.trigger(4, 'updateBox');
}, false);


table.init();


function binarySearch(arr, item, attr) {
    var low = 0,
        high = arr.length - 1,
        mid, element;

    while (low <= high) {
        mid = Math.floor((low + high) >> 1);
        element = arr[mid][attr];
        if (element.localeCompare(item) < 0) low = mid + 1;
        else if (element.localeCompare(item) > 0) high = mid - 1;
        else return arr[mid];
    }
    return -1;
}


//update func
function update(form) {
    //update table
    table.showData();
    mET.trigger(4, 'updateBox');
    //clear input
    gar.reverseEach(form.querySelectorAll('input'), function (i, item, len) {
        item.value = '';
    });
    gar.reverseEach(form.querySelectorAll('span>span'), function (i, item, len) {
        item.innerHTML = '';
    });
    lS.setItem('contact-data', JSON.stringify(tDic));
}

if (lS.getItem('contact-data'))mET.trigger(4, 'updateBox');
