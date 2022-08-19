const areEqual = (o1, o2) => {
  const entries1 = Object.entries(o1);
  const entries2 = Object.entries(o2);

  const o1Param4 = getParamValueFromEntry(entries1, 'param4');
  const o2Param4 = getParamValueFromEntry(entries2, 'param4');

  const entries1WithNoParam4 = removeParamFromEntry(entries1, 'param4');
  const entries2WithNoParam4 = removeParamFromEntry(entries2, 'param4');

  const areParams4Same = shouldParamsValueBeTreatedAsEqual(o1Param4, o2Param4);

  const areEntriesWithNoparam4Same =
    entries1WithNoParam4.toString() === entries2WithNoParam4.toString();
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

export const fieldsHasValue = (value: string) => {
  return Boolean(value && value?.trim()?.length !== 0);
};
