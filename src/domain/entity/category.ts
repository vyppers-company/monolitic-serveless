export enum ICategoryHair {
  BROWN = 'BROWN',
  BLACK = 'BLACK',
  BLONDE = 'BLONDE',
  RED = 'RED',
  OTHER = 'OTHER',
}

export enum ICategoryEyes {
  BROWN = 'BROWN',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  OTHER = 'OTHER',
}
export enum ICategoryEthnicity {
  LATINO = 'LATINO',
  CAUCASIAN = 'CAUCASIAN',
  AFRICAN_AMERICAN = 'AFRICAN AMERICAN',
  ASIAN = 'ASIAN',
  NATIVE_AMERICAN = 'NATIVE AMERICAN',
  PACIFIC_ISLANDER = 'PACIFIC ISLANDER',
  MIDDLE_EASTERN = 'MIDDLE EASTERN',
  SOUTH_ASIAN = 'SOUTH ASIAN',
  MULTIRACIAL = 'MULTIRACIAL',
  OTHER = 'OTHER',
}
export enum ICategoryBiotype {
  SLIM = 'SLIM',
  ATHLETIC = 'ATHLETIC',
  OVERWEIGHT = 'OVERWEIGHT',
  DWARF = 'DWARF',
}

export enum ICategoryGender {
  M = 'M',
  F = 'F',
  NON_BINARY = 'NON_BINARY',
  TRANS = 'TRANS',
  OTHER = 'OTHER',
}

export interface ICategory {
  hair?: ICategoryHair[];
  eyes?: ICategoryEyes[];
  ethnicity?: ICategoryEthnicity[];
  biotype?: ICategoryBiotype[];
  gender?: ICategoryGender[];
}
