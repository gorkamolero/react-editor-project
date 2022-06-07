export default function cleanedProps(props, excludedProps) {
  const copy = { ...props };
  for (const ex of excludedProps) {
    delete copy[ex];
  }
  return copy;
}
