const MARKDOWN_MARKER = /^# %% \[markdown\][ \t]*$/;
const CODE_MARKER = /^# %%[ \t]*$/;
const MARKER_PREFIX = /^# %%/;
const EDITOR_REGION = /^# (?:end)?region(?:\s|$)/;

function stripMarkdownPrefix(line, lineNumber) {
  if (line === "#") return "";
  if (line.startsWith("# ")) return line.slice(2);
  if (line.trim() === "") return line;

  throw new Error(
    `Unexpected non-Markdown line at source line ${lineNumber}: ${line}`,
  );
}

export function parsePercentCells(source) {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const cells = [];
  let currentCell = null;

  const flushCurrentCell = () => {
    if (!currentCell) return;

    const content =
      currentCell.type === "markdown"
        ? currentCell.lines
            .map(({ line, lineNumber }) =>
              stripMarkdownPrefix(line, lineNumber),
            )
            .join("\n")
        : currentCell.lines.map(({ line }) => line).join("\n");

    if (content.trim() === "") {
      throw new Error(
        `Empty ${currentCell.type} cell at source line ${currentCell.markerLine}`,
      );
    }

    cells.push({
      index: cells.length,
      type: currentCell.type,
      markerLine: currentCell.markerLine,
      content,
    });
  };

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (MARKDOWN_MARKER.test(line) || CODE_MARKER.test(line)) {
      flushCurrentCell();
      currentCell = {
        type: MARKDOWN_MARKER.test(line) ? "markdown" : "code",
        markerLine: lineNumber,
        lines: [],
      };
      return;
    }

    if (MARKER_PREFIX.test(line)) {
      throw new Error(`Unsupported percent-cell marker at line ${lineNumber}`);
    }

    if (EDITOR_REGION.test(line)) return;
    if (!currentCell) return;

    currentCell.lines.push({ line, lineNumber });
  });

  flushCurrentCell();
  return cells;
}
