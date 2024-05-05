const packBitString = (bitString: string): [Uint8Array, number] => {
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
    const endIndex = startIndex * 8;

    //Get data of byte from the bit string
    const byte = bitString.slice(startIndex, endIndex);

    //Convert the string to binary Int and push it in the bytes array
    //Eg. '10001000' becomes 136
    bytes[i] = parseInt(byte, 2);
  }

  return [bytes, padding];
};
