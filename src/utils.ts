import * as fs from "node:fs";

//Read data from file
export const readFile = (path: string) => {
  try {
    return fs.readFileSync(path, "utf-8").toString();
  } catch (err) {
    console.error("Error reading file data", err);
    process.exit(1);
  }
};

//Convert map to string
export const convertMapToString = (map: Map<any, any>) =>
  JSON.stringify(Array.from(map.entries()));

//Convert 2D array to map
export const convertArrayToMap = (arr: [string, number][]) =>
  arr.reduce<Map<string, number>>(
    (acc, curr) => acc.set(curr[0], curr[1]),
    new Map<string, number>()
  );

//Convert char to code map to code to char map
export const getCodeToCharMapping = (charToCodeMap: Map<string, string>) =>
  Array.from(charToCodeMap.entries()).reduce((acc, [key, value]) => {
    acc.set(value, key);
    return acc;
  }, new Map<string, string>());

//Adds padding and converts the binary string to Uint8Array
export const packBitString = (bitString: string): [Uint8Array, number] => {
  //Pad the data with 0 so that we can convert it to bytes
  let paddedBitString = bitString;
  while (paddedBitString.length % 8 !== 0) {
    paddedBitString += "0";
  }

  const padding = paddedBitString.length - bitString.length;
  const size = paddedBitString.length / 8;

  //Create a Uint8Array
  //Ref: https://www.w3schools.com/jsref/jsref_obj_typed_array.asp
  const bytes = new Uint8Array(size);

  for (let i = 0; i < size; i++) {
    const startIndex = i * 8;
    const endIndex = startIndex + 8;

    //Get data of byte from the bit string
    const byte = paddedBitString.slice(startIndex, endIndex);

    //Convert the string to binary Int and push it in the bytes array
    //Eg. '10001000' becomes 136
    bytes[i] = parseInt(byte, 2);

    if (i % 1000 === 0) console.log(`Compressed ${i} of ${size} bytes`);
  }

  return [bytes, padding];
};
