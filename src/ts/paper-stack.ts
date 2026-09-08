const STACK_INTERVAL_MS = 20_000;
const MAX_SHEETS = 4;

const paperEntryPaths = [
  { x: "-115vw", y: "-8vh", rotation: "-7deg" },
  { x: "115vw", y: "8vh", rotation: "7deg" },
  { x: "-10vw", y: "-115vh", rotation: "-4deg" },
  { x: "8vw", y: "115vh", rotation: "5deg" },
  { x: "-110vw", y: "-90vh", rotation: "-8deg" },
  { x: "110vw", y: "90vh", rotation: "8deg" },
] as const;

function randomBetween(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum);
}

function addPaperStack() {
  const page =
    document.querySelector<HTMLElement>(".guide-layout") ??
    document.querySelector<HTMLElement>("main");
  if (!page) return;

  const stack = document.createElement("div");
  stack.className = "paper-stack";
  stack.setAttribute("aria-hidden", "true");
  document.body.append(stack);
  page.classList.add("paper-stack-page");

  let depth = 0;

  const positionStack = () => {
    const rect = page.getBoundingClientRect();
    stack.style.left = `${rect.left}px`;
    stack.style.top = `${rect.top}px`;
    stack.style.width = `${rect.width}px`;
    stack.style.height = `${rect.height}px`;
  };

  const addSheet = () => {
    if (depth >= MAX_SHEETS) return;

    depth += 1;
    const direction = depth % 2 === 0 ? 1 : -1;
    const x = direction * randomBetween(2 + depth, 4 + depth);
    const y = randomBetween(2 + depth, 4 + depth * 1.5);
    const rotation = direction * randomBetween(0.06, 0.22);
    const entryPath =
      paperEntryPaths[Math.floor(Math.random() * paperEntryPaths.length)];
    const sheet = document.createElement("div");

    sheet.className = "paper-stack-sheet";
    sheet.style.setProperty("--paper-depth", String(depth));
    sheet.style.setProperty("--paper-x", `${x.toFixed(1)}px`);
    sheet.style.setProperty("--paper-y", `${y.toFixed(1)}px`);
    sheet.style.setProperty("--paper-rotate", `${rotation.toFixed(2)}deg`);
    sheet.style.setProperty("--paper-entry-x", entryPath.x);
    sheet.style.setProperty("--paper-entry-y", entryPath.y);
    sheet.style.setProperty("--paper-entry-rotate", entryPath.rotation);
    stack.append(sheet);

    // Force the off-screen transform to be committed before transitioning it.
    // Without this layout read, browsers can batch insertion and the class
    // change into one paint, making the paper appear at its final position.
    void sheet.offsetWidth;
    requestAnimationFrame(() => sheet.classList.add("is-visible"));
  };

  positionStack();
  requestAnimationFrame(positionStack);
  window.addEventListener("load", positionStack, { once: true });

  const resizeObserver = new ResizeObserver(positionStack);
  resizeObserver.observe(page);
  window.addEventListener("resize", positionStack);
  window.addEventListener("scroll", positionStack, { passive: true });

  const timer = window.setInterval(() => {
    if (document.visibilityState !== "visible") return;
    addSheet();

    if (depth >= MAX_SHEETS) window.clearInterval(timer);
  }, STACK_INTERVAL_MS);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addPaperStack, { once: true });
} else {
  addPaperStack();
}
