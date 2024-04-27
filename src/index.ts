#! /usr/bin/env node

import * as fs from "node:fs";

const readFile = (filePath: string) => fs.readFileSync(filePath).toString();

const countChars = (file: string) => {
  const map: Record<string, number> = {};

  for (let c of file) {
    map[c] = (map[c] ?? 0) + 1;
  }
  return map;
};

const main = () => {
  if (process.argv.length > 2) {
    const filePath = process.argv[2];

    const file = readFile(filePath);
    const charDetails = countChars(file);

    console.log(charDetails);
  }
};

main();
