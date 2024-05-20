import { HuffmanNode } from "./huffman-node";
import { PriorityQueue } from "./priority-queue";
import {
  convertArrayToMap,
  convertMapToString,
  getCodeToCharMapping,
  packBitString,
} from "./utils";

export class HuffmanTree {
  private table?: Map<string, number>;
  private tree?: HuffmanNode;

  private compareFn = (node1: HuffmanNode, node2: HuffmanNode) =>
    node2.weight - node1.weight;

  getHuffmanTree = () => this.tree;
  getFrequencyTable = () => this.table;

  //Build frequency table by counting all the occurances of char in the given text
  private buildFrequencyTable = (text: string) => {
    const table = new Map<string, number>();
    for (let c of text) table.set(c, (table.get(c) ?? 0) + 1);
    this.table = table;
    return table;
  };

  //Combine the two Huffman nodes by creating a new node whose
  //value is null and weight is sum of the 2 nodes
  //left node is the one with lower weight and right, the one with higher weight
  private combineHuffmanNodes = (node1: HuffmanNode, node2: HuffmanNode) => {
    let leftNode = node1;
    let rightNode = node2;

    if (node1.weight > node2.weight) {
      leftNode = node2;
      rightNode = node1;
    }
    return new HuffmanNode(
      node1.weight + node2.weight,
      null,
      leftNode,
      rightNode
    );
  };

  //Build huffman tree from the generated table.
  //Ref: https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/Huffman.html
  private buildHuffmanTree = (table: Map<string, number>) => {
    if (!table) {
      throw new Error("Frequency table not found");
    }

    //Create a priority queue and insert all elements into the queue
    const pQueue = new PriorityQueue(this.compareFn);
    table.forEach((weight, value) =>
      pQueue.enqueue(new HuffmanNode(weight, value, null, null))
    );

    //Keep combining the first two elements of the queue to build the huffman tree
    while (pQueue.size() > 1) {
      const node1 = pQueue.dequeue();
      const node2 = pQueue.dequeue();

      const combinedNode = this.combineHuffmanNodes(node1, node2);

      pQueue.enqueue(combinedNode);
    }

    this.tree = pQueue.dequeue();
    return this.tree;
  };

  //Recursive function to generate Huffman codes based on node position
  private parseHuffmanTree = (
    node: HuffmanNode,
    prefix: string,
    codesMap: Map<string, string>
  ) => {
    if (node.value) codesMap.set(node.value, prefix);

    if (node.leftNode)
      this.parseHuffmanTree(node.leftNode, prefix + "0", codesMap);
    if (node.rightNode)
      this.parseHuffmanTree(node.rightNode, prefix + "1", codesMap);
  };

  //Generate Huffman codes from the huffman tree
  private getHuffmanCodes = (tree: HuffmanNode) => {
    if (!tree) throw new Error("Huffman tree not found");

    const codesMap = new Map<string, string>();
    this.parseHuffmanTree(tree, "", codesMap);
    return codesMap;
  };

  //Compress the given text using the huffman encoding
  private compressDataUtil = (data: string) => {
    //Build frequency table from the given text
    const table = this.buildFrequencyTable(data);

    //Build huffman tree from the frequency table
    const tree = this.buildHuffmanTree(table);

    //Generate codes from the huffman tree
    const codes = this.getHuffmanCodes(tree);

    //Generate the compressed data based on the codes
    const compressedData = data
      .split("")
      .map((c) => codes.get(c))
      .join("");

    //Pack the compressed data and return it
    return packBitString(compressedData);
  };

  //Generate compressed data with header section
  getCompressedData = (data: string) => {
    const [compressedUint8Array, padding] = this.compressDataUtil(data);
    const header = convertMapToString(this.table!);

    //Convert the header string to Uint8Array
    const headerUint8Array = new TextEncoder().encode(header);

    //Return the metadata, header and compressed data
    return {
      //Metadata is header length and padding length
      metadata:
        headerUint8Array.length.toString() + "\n" + padding.toString() + "\n",

      //Return the frequency table as Uint8Array
      headerUint8Array,

      //Return the compressed data as Uint8Array
      compressedUint8Array,
    };
  };

  private parseCompressedFile = (data: Buffer) => {
    let index = 0;

    //Match the char code of "\n" to get the header length
    while (data[index] !== "\n".charCodeAt(0)) {
      index++;
    }
    const headerLength = parseInt(data.subarray(0, index).toString());

    //Skip "\n"
    index++;

    const padding = parseInt(data.subarray(index, index + 1).toString());

    //Skip padding and "\n"
    index += 2;

    const headerBuffer = data.subarray(index, index + headerLength);

    //Get the frequency table buffer as string and parse it to get JSON object
    const frequencyTable = JSON.parse(headerBuffer.toString());

    const compressedData = data.subarray(index + headerLength);

    return { frequencyTable, compressedData, padding };
  };

  decompressData = (data: Buffer) => {
    const { frequencyTable, compressedData, padding } =
      this.parseCompressedFile(data);

    const tree = this.buildHuffmanTree(convertArrayToMap(frequencyTable));
    const codes = this.getHuffmanCodes(tree);

    const codeToCharMap = getCodeToCharMapping(codes);

    let uncompressedData = "";
    let curBinaryString = "";
    for (let val of compressedData.values()) {
      //Convert the decimal to binary string
      for (let b of val.toString(2).padStart(8, "0")) {
        curBinaryString += b;
        if (codeToCharMap.get(curBinaryString)) {
          uncompressedData += codeToCharMap.get(curBinaryString);
          curBinaryString = "";
        }
      }
    }

    return uncompressedData;
  };
}
