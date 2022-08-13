// //false
// const obj1 =  {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLYyy",
//   "param3": "2022-07-07",

// }

// const obj2 = {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",

// }

// //true
// const obj1 =  {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
//   "param4": ""
// }

// const obj2 = {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",

// }

// //true
// const obj1 =  {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
//   "param4": "777"
// }

// const obj2 = {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
// "param4": "777"
// }

//false
// const obj1 =  {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
//   "param4": ""
// }

// const obj2 = {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
// "param4": "777"
// }

// //false
// const obj1 =  {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
// "param4": "fff"
// }

// const obj2 = {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
// }

// //true
// const obj1 =  {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
//   "param4": ""
// }

// const obj2 = {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",

// }

// //true
// const obj1 =  {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",

// }

// const obj2 = {
//   "param1": "SHOOTING_DATE",
//   "param2": "EXACTLY",
//   "param3": "2022-07-07",
// "param4": ""
// }
const obj1 = {
  param1: 'SHOOTING_DATE',
  param2: 'EXACTLY',
  param3: '2022-07-07',
  param4: '',
};

const obj2 = {
  param1: 'SHOOTING_DATE',
  param2: 'EXACTLY',
  param3: '2022-07-07',
  param4: '',
};

const areEqual = (o1, o2) => {
  const entries1 = Object.entries(o1);
  const entries2 = Object.entries(o2);

  const o1Param4 = getParamValueFromEntry(entries1, 'param4');
  const o2Param4 = getParamValueFromEntry(entries2, 'param4');
  console.log('o1Param4', o1Param4);
  console.log('o2Param4', o2Param4);

  console.log('entries1', entries1);
  console.log('entries2', entries2);

  const entries1WithNoParam4 = removeParamFromEntry(entries1, 'param4');
  const entries2WithNoParam4 = removeParamFromEntry(entries2, 'param4');

  const areParams4Same = shouldParamsValueBeTreatedAsEqual(o1Param4, o2Param4);

  const areEntriesWithNoparam4Same =
    entries1WithNoParam4.toString() === entries2WithNoParam4.toString();

  console.log('areEntriesWithNoparam4Same', areEntriesWithNoparam4Same);
  console.log('areParams4Same', areParams4Same);

  return areParams4Same && areEntriesWithNoparam4Same;
};

const getParamValueFromEntry = (entries, paramName) => {
  const eParam = entries.find((entry) => entry[0] === paramName);

  if (eParam) {
    return eParam[1];
  }

  return null;
};

const removeParamFromEntry = (entries, paramName) =>
  entries.filter((entry) => entry[0] !== paramName);

const shouldParamsValueBeTreatedAsEqual = (p1, p2) => {
  if ((p1 === '' && p2 === null) || (p2 === '' && p1 === null)) {
    return true;
  }

  return p1 === p2;
};

export const areFiltersEqual = (f1, f2) => {
  if (f1.length === f2.length) {
    let isEqual = true;
    for (let i = 0; i < f1.length; i++) {
      const f1Element = f1[i];
      const f2Element = f2[i];

      isEqual = isEqual && areEqual(f1Element, f2Element);

      if (!isEqual) {
        return;
      }
    }

    return isEqual;
  } else {
    false;
  }
};
console.log('areEqual', areEqual(obj1, obj2));

export const fieldsHasValue = (value: string) => {
  // console.log('value::fieldsHasValue::::', value);
  return Boolean(value && value?.trim()?.length !== 0);
};
