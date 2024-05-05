export class HuffmanNode {
  value: string | null;
  weight: number;
  leftNode: HuffmanNode | null;
  rightNode: HuffmanNode | null;

  constructor(
    weight: number,
    value: string | null = null,
    leftNode: HuffmanNode | null = null,
    rightNode: HuffmanNode | null = null
  ) {
    this.weight = weight;
    this.value = value;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
  }
}
