#! /usr/bin/env node

import * as fs from "node:fs";
import { HuffmanTree } from "./utils/huffman-tree";

const readFile = (filePath: string) => fs.readFileSync(filePath).toString();

const main = () => {
  if (process.argv.length > 2) {
    const filePath = process.argv[2];

    const file = readFile(filePath);

    const huffmanTree = new HuffmanTree();
    const frequencyTable = huffmanTree.buildFrequencyTable(file);
    const generatedHuffmanTree = huffmanTree.buildHuffmanTree();

    console.log("Frequencey Table", frequencyTable);
    console.log("Huffman tree", generatedHuffmanTree);
  }
};

main();
