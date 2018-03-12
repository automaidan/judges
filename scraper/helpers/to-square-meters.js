function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

module.exports = function toSquareMeters(rawSpace, spaceUnits) {
  if (rawSpace === '' || typeof rawSpace === 'undefined') {
    return 0;
  }
  const space = isFloat(rawSpace) ? parseFloat(rawSpace.replace(',', '.')) : rawSpace;

  if (spaceUnits === 'м²' || spaceUnits === '' || typeof spaceUnits === 'undefined') {
    return space;
  } else if (spaceUnits === 'га') {
    return space * 10000;
  } else if (spaceUnits === 'соток') {
    return space * 100;
  }
  return space;
};
