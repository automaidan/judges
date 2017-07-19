module.exports = function toSquareMeters(space, space_units) {
  if (space === '' || typeof space === 'undefined') {
    return 0;
  }
  space = parseFloat(space.replace(',', '.'));

  if (space_units === 'м²' || space_units === '' || typeof space_units === 'undefined') {
    return space;
  } else if (space_units === 'га') {
    return space * 10000;
  } else if (space_units === 'соток') {
    return space * 100;
  }
};
