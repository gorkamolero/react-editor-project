export default function parseSize(size) {
  return !isNaN(size) ? size + "px" : size;
}
