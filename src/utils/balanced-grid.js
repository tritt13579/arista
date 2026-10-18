// Center incomplete rows while keeping every item the same width. Twenty-four
// tracks divide evenly into 1, 2, 3 and 4 columns, including half-column offsets.
function positions(count, columns) {
  if (!count) return [];
  const rows = Math.ceil(count / columns);
  const small = Math.floor(count / rows);
  const extra = count % rows;
  const largest = small + Number(extra > 0);
  const span = 24 / largest;
  const result = [];
  for (let row = 0; row < rows; row++) {
    const length = small + Number(row < extra);
    const offset = (24 - length * span) / 2 + 1;
    for (let column = 0; column < length; column++) {
      result.push({ start: offset + column * span, span, row: row + 1 });
    }
  }
  return result;
}

export function balanceGrid(grid, desktopColumns, tabletColumns, mobileColumns) {
  const items = [...grid.children];
  for (const [prefix, columns] of [['', desktopColumns], ['md-', tabletColumns], ['sm-', mobileColumns]]) {
    positions(items.length, columns).forEach((position, index) => {
      for (const [key, value] of Object.entries(position)) items[index].style.setProperty(`--${prefix}${key}`, value);
    });
  }
}
