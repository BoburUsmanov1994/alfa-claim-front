import {includes, isEqual, get, isObject, isArray} from "lodash";
import dayjs from "dayjs";

const addDetectClick =  ({setOpen,classNames = []}) => {
    window.addEventListener("click", (e) => {
        if (!classNames.some(className => e.target.classList.contains(className))) {
            setOpen(false);
        }
    });
}
const removeDetectClick = () => {
    window.removeEventListener('click',addDetectClick,false);
}

const hasAccess = (roles = [], can = '') => {
    let access = false;
    if (includes(roles, can)) {
        access = true;
    }
    return access;
}

const formatDate  = (date) => {

    date = new Date(date);
    let day = date.getDate();
    let monthIndex = date.getMonth()+1;
    let year = date.getFullYear();

    return monthIndex < 10 ? `${day}/0${monthIndex}/${year}` : `${day}/${monthIndex}/${year}`;
}




const getSelectOptionsListFromData = (data = [], value = 'id', label = 'title') => {
    return isArray(data) ? data.map(item => isObject(item) ?  ({ value: item[value], label: get(item,label) }) : ({ value: item, label: item})) : [];
}

const getFieldType = (type = 'String') => {
    if(isEqual(type,'Date')){
        return 'datepicker';
    }

    if(isEqual(type,'Schema.Types.ObjectId')){
        return 'select';
    }


    return 'input';
}
const saveFile = (file, name = dayjs(), extension = 'xlsx') => {
    const blob = new Blob([file],{
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${name}.${extension}`;
    link.click();
    URL.revokeObjectURL(link.href);
}

export {
    addDetectClick,
    removeDetectClick,
    hasAccess,
    getSelectOptionsListFromData,
    formatDate,
    getFieldType,
    saveFile
}
