#! /usr/bin/env node

import * as fs from "node:fs";
import { HuffmanTree } from "./huffman-tree";
import { readFile } from "./utils";

const compressFile = (inputFilePath: string, outputFilePath: string) => {
  const file = readFile(inputFilePath);
  const huffmanTree = new HuffmanTree();
  const compressedData = huffmanTree.getCompressedData(file);

  //Write the compressed data to the output file
  fs.writeFileSync(outputFilePath, compressedData.metadata);
  fs.appendFileSync(outputFilePath, compressedData.headerUint8Array);
  fs.appendFileSync(outputFilePath, compressedData.compressedUint8Array);

  console.log("Input file size", fs.statSync(inputFilePath).size);
  console.log("Compressed file size", fs.statSync(outputFilePath).size);
  process.exit(0);
};

const decompressFile = (inputFilePath: string, outputFilePath: string) => {
  const file = fs.readFileSync(inputFilePath);
  const huffmanTree = new HuffmanTree();
  const decompressedData = huffmanTree.decompressData(file);
  fs.writeFileSync(outputFilePath, decompressedData);
  process.exit(0);
};

const main = () => {
  if (process.argv.length < 5) {
    console.error("Invalid number of arguments");
    process.exit(1);
  }

  const [, , action, inputFilePath, outputFilePath] = process.argv;
  console.log("DATA", action, inputFilePath, outputFilePath);

  if (action === "--compress") {
    compressFile(inputFilePath, outputFilePath);
  } else if (action === "--decompress") {
    decompressFile(inputFilePath, outputFilePath);
  } else {
    console.error("Invalid command");
    process.exit(1);
  }
  process.exit(0);
};

main();
