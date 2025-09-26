import { visit } from "unist-util-visit";

const INLINE_NOTE_IMPORT_NAME = "InlineNotePopover";
const INLINE_NOTE_ROLLUP_IMPORT_NAME = "InlineNoteReferenceList";
const INLINE_NOTE_ROLLUP_ITEM_IMPORT_NAME = "InlineNoteReferenceItem";
const COMPONENT_IMPORT = "@/components/inline-note/InlineNotePopover.astro";
const ROLLUP_IMPORT = "@/components/inline-note/InlineNoteReferenceList.astro";
const ROLLUP_ITEM_IMPORT = "@/components/inline-note/InlineNoteReferenceItem.astro";

const cloneNode = (node) => {
  if (typeof structuredClone === "function") {
    return structuredClone(node);
  }
  return JSON.parse(JSON.stringify(node));
};

const createImportNode = (importName, source) => ({
  type: "mdxjsEsm",
  value: `import ${importName} from "${source}";`,
  data: {
    estree: {
      type: "Program",
      sourceType: "module",
      body: [
        {
          type: "ImportDeclaration",
          source: { type: "Literal", value: source, raw: `"${source}"` },
          specifiers: [
            {
              type: "ImportDefaultSpecifier",
              local: { type: "Identifier", name: importName },
            },
          ],
        },
      ],
    },
  },
});

const sanitizeForId = (value) => {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");
};

const isInlineNoteNode = (node) =>
  node?.type === "mdxJsxTextElement" && node.name === INLINE_NOTE_IMPORT_NAME;

const isWhitespaceTextNode = (node) =>
  node?.type === "text" && !/\S/.test(node.value || "");

const wrapInlineNotesInParent = (parent) => {
  if (!parent || !Array.isArray(parent.children) || parent.children.length === 0) {
    return;
  }

  const children = parent.children;
  const newChildren = [];

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];

    if (!isInlineNoteNode(child)) {
      newChildren.push(child);
      continue;
    }

    const inlineNotes = [child];
    while (
      index + 1 < children.length &&
      isInlineNoteNode(children[index + 1])
    ) {
      inlineNotes.push(children[index + 1]);
      index += 1;
    }

    let precedingIndex = newChildren.length - 1;
    while (precedingIndex >= 0 && isWhitespaceTextNode(newChildren[precedingIndex])) {
      precedingIndex -= 1;
    }

    if (precedingIndex < 0) {
      newChildren.push(...inlineNotes);
      continue;
    }

    const precedingNode = newChildren[precedingIndex];
    const wrapperChildren = [];

    if (precedingNode.type === "text") {
      const textValue = precedingNode.value ?? "";
      const textMatch = textValue.match(/([\s\S]*?)(\S+)(\s*)$/);

      if (!textMatch) {
        newChildren.push(...inlineNotes);
        continue;
      }

      const [, prefix, trailingToken] = textMatch;

      if (prefix) {
        precedingNode.value = prefix;
      } else {
        newChildren.splice(precedingIndex, 1);
      }

      wrapperChildren.push({ type: "text", value: trailingToken });
    } else {
      newChildren.splice(precedingIndex, 1);
      wrapperChildren.push(precedingNode);
    }

    inlineNotes.forEach((inlineNote) => {
      wrapperChildren.push({ type: "text", value: "\u202f" });
      wrapperChildren.push(inlineNote);
    });

    const wrapperNode = {
      type: "mdxJsxTextElement",
      name: "span",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "class",
          value: "inline-note-group whitespace-nowrap",
        },
      ],
      children: wrapperChildren,
    };

    newChildren.push(wrapperNode);
  }

  parent.children = newChildren;
};

const remarkInlineNotes = () => {
  return (tree) => {
    const definitions = new Map();

    visit(tree, "footnoteDefinition", (node) => {
      const key = String(node.identifier || "").toLowerCase();
      if (!key) {
        return;
      }
      definitions.set(key, cloneNode(node));
    });

    if (definitions.size === 0) {
      return;
    }

    let inlineImportInserted = false;
    let rollupImportInserted = false;
    let rollupItemImportInserted = false;

    const ensureInlineImport = () => {
      if (inlineImportInserted) {
        return;
      }
      tree.children.unshift(createImportNode(INLINE_NOTE_IMPORT_NAME, COMPONENT_IMPORT));
      inlineImportInserted = true;
    };

    const ensureRollupImports = () => {
      if (!rollupImportInserted) {
        tree.children.unshift(
          createImportNode(INLINE_NOTE_ROLLUP_IMPORT_NAME, ROLLUP_IMPORT)
        );
        rollupImportInserted = true;
      }
      if (!rollupItemImportInserted) {
        tree.children.unshift(
          createImportNode(INLINE_NOTE_ROLLUP_ITEM_IMPORT_NAME, ROLLUP_ITEM_IMPORT)
        );
        rollupItemImportInserted = true;
      }
    };

    const references = [];
    const parentsToWrap = new Set();

    visit(tree, "footnoteReference", (node, index, parent) => {
      if (!parent || typeof index !== "number") {
        return;
      }
      references.push({ node, index, parent });
      parentsToWrap.add(parent);
    });

    if (references.length === 0) {
      tree.children = tree.children.filter((child) => child.type !== "footnoteDefinition");
      return;
    }

    const usedDefinitions = new Map();
    const referenceOrder = [];
    const markerMap = new Map();
    let nextMarker = 1;

    for (const { node, index, parent } of references) {
      const key = String(node.identifier || "").toLowerCase();
      const definition = definitions.get(key);
      if (!definition) {
        continue;
      }

      ensureInlineImport();

      let marker = markerMap.get(key);
      if (!marker) {
        marker = String(nextMarker++);
        markerMap.set(key, marker);
        referenceOrder.push(key);
      }

      const rawLabel = definition.label || node.label || node.identifier || "";
      const hasDescriptiveLabel = rawLabel && rawLabel !== marker && !/^\d+$/.test(rawLabel);
      const labelSuffix = hasDescriptiveLabel ? `: ${rawLabel}` : "";
      const accessibleLabel = `Footnote ${marker}${labelSuffix}`;
      const generatedIdBase = sanitizeForId(rawLabel || marker);
      const noteId = generatedIdBase ? `inline-note-${generatedIdBase}` : `inline-note-${marker}`;

      const inlineNode = {
        type: "mdxJsxTextElement",
        name: INLINE_NOTE_IMPORT_NAME,
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "marker",
            value: marker,
          },
          {
            type: "mdxJsxAttribute",
            name: "label",
            value: accessibleLabel,
          },
          {
            type: "mdxJsxAttribute",
            name: "id",
            value: noteId,
          },
        ],
        children: (definition.children || []).map(cloneNode),
      };

      parent.children.splice(index, 1, inlineNode);

      if (!usedDefinitions.has(key)) {
        usedDefinitions.set(key, {
          marker,
          label: accessibleLabel,
          definition: cloneNode(definition),
        });
      }
    }

    parentsToWrap.forEach(wrapInlineNotesInParent);

    tree.children = tree.children.filter((child) => child.type !== "footnoteDefinition");

    if (usedDefinitions.size > 0) {
      ensureRollupImports();

      const rollupChildren = [];
      for (const key of referenceOrder) {
        const entry = usedDefinitions.get(key);
        if (!entry) {
          continue;
        }
        const { marker, label, definition } = entry;
        rollupChildren.push({
          type: "mdxJsxFlowElement",
          name: INLINE_NOTE_ROLLUP_ITEM_IMPORT_NAME,
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "marker",
              value: marker,
            },
            {
              type: "mdxJsxAttribute",
              name: "label",
              value: label,
            },
          ],
          children: (definition.children || []).map(cloneNode),
        });
      }

      if (rollupChildren.length > 0) {
        tree.children.push({
          type: "mdxJsxFlowElement",
          name: INLINE_NOTE_ROLLUP_IMPORT_NAME,
          attributes: [],
          children: rollupChildren,
        });
      }
    }
  };
};

export default remarkInlineNotes;


