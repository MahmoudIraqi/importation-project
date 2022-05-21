import {FormGroup} from '@angular/forms';

export const formDataClass = (req?: any, FormParam?: FormGroup) => {
  let formData = new FormData();
  let arrayOfKeys;
  if (req) {
    arrayOfKeys = Object.keys(req);

    for (let i = 0; i < arrayOfKeys.length; i++) {
      formData.append(arrayOfKeys[i], FormParam.get(arrayOfKeys[i]).value);
    }

    return formData;
  }
};

export const convertToSpecialObject = (WhichForm, typeOfMarketing, typeOfRegistration, isExport, Tracktype, id, event) => {
  return {
    ...event,
    typeOfMarketing,
    typeOfRegistration,
    isExport: isExport ? 1 : 0,
    Tracktype,
    id,
    isCompleted: WhichForm === 'submitProductForKit' && (typeOfMarketing === 5 || typeOfMarketing === 6) ? true : false,
    isDraft: WhichForm === 'save' || WhichForm === 'submitProductForKit' ? 1 : 0,
  };
};

export const convertToSpecialObjectForLegacy = (WhichForm, event) => {
  return {
    ...event,
    isDraft: WhichForm === 'save' ? 1 : 0
  };
};

export const convertToSpecialObjectForReNotification = (WhichForm, typeOfMarketing, typeOfRegistration, isExport, Tracktype, id, NotificationNo, event) => {
  return {
    ...event,
    isDraft: WhichForm === 'save' || WhichForm === 'submitProductForKit' ? 1 : 0,
    typeOfMarketing,
    typeOfRegistration,
    isExport: isExport ? 1 : 0,
    Tracktype,
    id,
    NotificationNo,
    isCompleted: WhichForm === 'submitProductForKit' && (typeOfMarketing === 5 || typeOfMarketing === 6) ? true : false
  };
};

export const convertFromStringToArrayWithCommaSeparator = (value) => {
  return value?.split(',');
};
