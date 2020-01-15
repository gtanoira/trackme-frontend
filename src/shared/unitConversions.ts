// Sets the unit measures for length, weight and volumetric
export function changeUnits(unitType: string): object {

  switch (unitType) {

    case 'cm': {
      return {
        unitLength: 'cm',
        unitWeight: 'kg',
        unitVolumetric: 'kgV'
      };
    }

    case 'inch': {
      return {
        unitLength: 'inch',
        unitWeight: 'lb',
        unitVolumetric: 'lbV'
      };
    }
  }
}
