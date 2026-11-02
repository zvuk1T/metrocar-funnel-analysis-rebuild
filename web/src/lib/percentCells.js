const MARKDOWN_MARKER = /^# %% \[markdown\][ \t]*$/;
const CODE_MARKER = /^# %%[ \t]*$/;
const MARKER_PREFIX = /^# %%/;
const EDITOR_REGION = /^# (?:end)?region(?:\s|$)/;

function splitCodeExplanation(lines, markerLine) {
  const code = [];
  let explanation;
  let inside = false;
  for (const line of lines) {
    if (/^# region Explain this code[ \t]*$/.test(line)) {
      if (explanation) throw new Error(`Duplicate explanation in source cell at line ${markerLine}`);
      explanation = [];
      inside = true;
    } else if (inside && /^# endregion[ \t]*$/.test(line)) {
      inside = false;
    } else if (inside) {
      if (EDITOR_REGION.test(line) || (line !== "#" && !line.startsWith("# "))) {
        throw new Error(`Explanation must contain comments only in source cell at line ${markerLine}`);
      }
      explanation.push(line === "#" ? "" : line.slice(2));
    } else if (!EDITOR_REGION.test(line)) {
      code.push(line);
    }
  }
  if (inside || (explanation && !explanation.join("\n").trim())) {
    throw new Error(`Unclosed or empty explanation in source cell at line ${markerLine}`);
  }
  return { content: code.join("\n"), explanation: explanation?.join("\n") };
}

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

    const code = currentCell.type === "code"
      ? splitCodeExplanation(currentCell.lines.map(({ line }) => line), currentCell.markerLine)
      : null;
    const content =
      currentCell.type === "markdown"
        ? currentCell.lines
            .map(({ line, lineNumber }) =>
              stripMarkdownPrefix(line, lineNumber),
            )
            .join("\n")
        : code.content;

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
      explanation: code?.explanation,
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

    if (EDITOR_REGION.test(line) && currentCell?.type !== "code") return;
    if (!currentCell) return;

    currentCell.lines.push({ line, lineNumber });
  });

  flushCurrentCell();
  return cells;
}
