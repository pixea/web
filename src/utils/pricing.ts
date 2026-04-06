import { Product } from "@/db/schema";
import { OrderItemPayload } from "@/db/validation";
import * as ohm from "ohm-js";

const grammar = ohm.grammar(String.raw`
PriceFormula {
  Expr = AddExp

  AddExp
    = AddExp "+" MulExp  -- plus
    | AddExp "-" MulExp  -- minus
    | MulExp

  MulExp
    = MulExp "*" PowExp  -- times
    | MulExp "/" PowExp  -- divide
    | PowExp

  PowExp
    = PriExp "^" PowExp  -- pow
    | PriExp

  PriExp
    = "(" Expr ")"       -- parens
    | "-" PriExp         -- neg
    | number             -- number
    | identPath          -- variable

  identPath = ident ("." ident)*
  ident = identStart identContinue*
  identStart = letter | "_"
  identContinue = alnum | "_"
  number = digit+ ("." digit+)?
}
`);

const semantics = grammar.createSemantics();

const sanitizePathSegment = (segment: string) => {
  const sanitized = segment.replace(/[^A-Za-z0-9_]/g, "_");
  if (!sanitized) return "_";
  if (/^[0-9]/.test(sanitized)) return `_${sanitized}`;
  return sanitized;
};

const toPath = (path: string) =>
  path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);

const getByPath = (
  input: unknown,
  path: string,
  fallback: unknown = undefined
): unknown => {
  const result = toPath(path).reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, input);

  return result === undefined ? fallback : result;
};

const toFiniteNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

semantics.addOperation<number>("eval(ctx)", {
  Expr(exp) {
    return exp.eval(this.args.ctx);
  },
  AddExp_plus(left, _op, right) {
    return left.eval(this.args.ctx) + right.eval(this.args.ctx);
  },
  AddExp_minus(left, _op, right) {
    return left.eval(this.args.ctx) - right.eval(this.args.ctx);
  },
  MulExp_times(left, _op, right) {
    return left.eval(this.args.ctx) * right.eval(this.args.ctx);
  },
  MulExp_divide(left, _op, right) {
    return left.eval(this.args.ctx) / right.eval(this.args.ctx);
  },
  PowExp_pow(base, _op, exponent) {
    return Math.pow(base.eval(this.args.ctx), exponent.eval(this.args.ctx));
  },
  PriExp_parens(_open, expression, closeToken) {
    void closeToken;
    return expression.eval(this.args.ctx);
  },
  PriExp_neg(_minus, value) {
    return -value.eval(this.args.ctx);
  },
  PriExp_number(numberNode) {
    return Number(numberNode.sourceString);
  },
  PriExp_variable(pathNode) {
    return toFiniteNumber(getByPath(this.args.ctx, pathNode.sourceString));
  },
  _terminal() {
    return 0;
  },
});

const getSelectedRadioOption = (
  product: Product,
  item: Partial<OrderItemPayload>,
  configId: string
) => {
  const selectedId = item.configuration?.find((c) => c.id === configId)?.value;
  if (!selectedId) return undefined;

  const definition = product.configuration.find(
    (c) => c.id === configId && c.type === "radio-card"
  );

  if (!definition || definition.type !== "radio-card") return undefined;
  return definition.options.find((option) => option.id === selectedId);
};

export const buildPriceContext = (
  product: Product,
  item: Partial<OrderItemPayload>
) => {
  const width = toFiniteNumber(item.size?.dimensions?.[0]);
  const height = toFiniteNumber(item.size?.dimensions?.[1]);
  const area = (width * height) / 10000;
  const filesCount = item.files?.items?.length ?? 0;
  const pieces = item.files?.pieces ?? 1;
  const totalPieces = filesCount * pieces;

  const config = Object.fromEntries(
    product.configuration.map((definition) => {
      const key = sanitizePathSegment(definition.id);
      const selected = item.configuration?.find((c) => c.id === definition.id);
      const selectedOption = getSelectedRadioOption(product, item, definition.id);
      return [
        key,
        {
          id: definition.id,
          value: selected?.value ?? null,
          priceCost: selectedOption?.price.cost ?? 0,
          priceMargin: selectedOption?.price.margin ?? 0,
        },
      ];
    })
  );

  const configTotals = Object.values(config).reduce(
    (acc, entry) => ({
      cost: acc.cost + toFiniteNumber(entry.priceCost),
      margin: acc.margin + toFiniteNumber(entry.priceMargin),
    }),
    { cost: 0, margin: 0 }
  );

  return {
    product,
    item,
    size: { width, height, area },
    files: { count: filesCount, pieces, totalPieces },
    config,
    configTotals,
  };
};

export const evaluatePriceFormula = (formula: string, context: unknown) => {
  const trimmed = formula.trim();
  if (!trimmed) return 0;

  const match = grammar.match(trimmed, "Expr");
  if (match.failed()) {
    throw new Error(`Invalid pricing formula: ${match.message}`);
  }

  return semantics(match).eval(context);
};

export type ItemPricingBreakdown = {
  baseCost: number;
  margin: number;
  price: number;
};

const evaluateFormulaSafely = (formula: string | undefined, context: unknown) => {
  if (!formula) return 0;

  try {
    const result = evaluatePriceFormula(formula, context);
    if (!Number.isFinite(result)) return 0;
    return Math.max(0, result);
  } catch {
    return 0;
  }
};

export const calculateItemPricing = (
  product: Product,
  item: Partial<OrderItemPayload>
): ItemPricingBreakdown => {
  const baseCostFormula = product.pricing?.baseCostFormula;
  const marginFormula = product.pricing?.marginFormula;
  const legacyFormula = product.pricing?.formula;

  const context = buildPriceContext(product, item);

  if (baseCostFormula || marginFormula) {
    const baseCost = evaluateFormulaSafely(baseCostFormula, context);
    const margin = evaluateFormulaSafely(marginFormula, {
      ...context,
      pricing: { baseCost },
    });

    return {
      baseCost,
      margin,
      price: baseCost + margin,
    };
  }

  if (legacyFormula) {
    const legacyPrice = evaluateFormulaSafely(legacyFormula, context);
    return {
      // Legacy formulas only define total price; we keep margin at 0 to avoid
      // inventing profit data and treat the total as production cost.
      baseCost: legacyPrice,
      margin: 0,
      price: legacyPrice,
    };
  }

  return {
    baseCost: 0,
    margin: 0,
    price: 0,
  };
};

export const calculateItemPrice = (
  product: Product,
  item: Partial<OrderItemPayload>
) => {
  return calculateItemPricing(product, item).price;
};
