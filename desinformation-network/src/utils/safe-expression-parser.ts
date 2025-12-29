/**
 * Safe Expression Parser
 *
 * Safely evaluates simple boolean expressions without using eval() or Function().
 * Only allows:
 * - Comparison operators: <, >, <=, >=, ==, !=
 * - Logical operators: &&, ||
 * - Parentheses for grouping
 * - Numbers (integers and decimals)
 * - Variables (must be provided in context)
 */

type Context = Record<string, number | boolean>;

/**
 * Tokenize the expression
 */
function tokenize(expr: string): string[] {
  // Remove whitespace and split by operators while keeping them
  const tokens: string[] = [];
  let current = '';

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    const nextChar = expr[i + 1];

    // Skip whitespace
    if (char === ' ' || char === '\t') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    // Two-character operators
    if (
      (char === '&' && nextChar === '&') ||
      (char === '|' && nextChar === '|') ||
      (char === '=' && nextChar === '=') ||
      (char === '!' && nextChar === '=') ||
      (char === '<' && nextChar === '=') ||
      (char === '>' && nextChar === '=')
    ) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      tokens.push(char + nextChar);
      i++; // Skip next character
      continue;
    }

    // Single-character operators
    if (char === '(' || char === ')' || char === '<' || char === '>') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      tokens.push(char);
      continue;
    }

    // Build current token
    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Parse and evaluate a comparison expression
 */
function evaluateComparison(left: number, operator: string, right: number): boolean {
  switch (operator) {
    case '<': return left < right;
    case '>': return left > right;
    case '<=': return left <= right;
    case '>=': return left >= right;
    case '==': return left === right;
    case '!=': return left !== right;
    default:
      throw new Error(`Unknown comparison operator: ${operator}`);
  }
}

/**
 * Get value from token (either a number or variable from context)
 */
function getValue(token: string, context: Context): number {
  // Try parsing as number
  const num = parseFloat(token);
  if (!isNaN(num)) {
    return num;
  }

  // Look up in context
  if (token in context) {
    const value = context[token];
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value;
  }

  throw new Error(`Unknown variable: ${token}`);
}

/**
 * Safely evaluate a boolean expression
 */
export function safeEvaluate(expression: string, context: Context): boolean {
  if (!expression || expression.trim() === '') {
    return false;
  }

  try {
    const tokens = tokenize(expression);

    // Simple recursive descent parser
    let index = 0;

    function parseExpression(): boolean {
      let left = parseTerm();

      while (index < tokens.length && tokens[index] === '||') {
        index++; // consume ||
        const right = parseTerm();
        left = left || right;
      }

      return left;
    }

    function parseTerm(): boolean {
      let left = parseFactor();

      while (index < tokens.length && tokens[index] === '&&') {
        index++; // consume &&
        const right = parseFactor();
        left = left && right;
      }

      return left;
    }

    function parseFactor(): boolean {
      // Handle parentheses
      if (tokens[index] === '(') {
        index++; // consume (
        const result = parseExpression();
        if (tokens[index] !== ')') {
          throw new Error('Missing closing parenthesis');
        }
        index++; // consume )
        return result;
      }

      // Handle comparison: left op right
      const leftToken = tokens[index++];
      const leftValue = getValue(leftToken, context);

      if (index >= tokens.length) {
        // Single value (truthy/falsy)
        return leftValue !== 0;
      }

      const operator = tokens[index];

      // Check if this is a comparison operator
      if (['<', '>', '<=', '>=', '==', '!='].includes(operator)) {
        index++; // consume operator
        const rightToken = tokens[index++];
        const rightValue = getValue(rightToken, context);
        return evaluateComparison(leftValue, operator, rightValue);
      }

      // If no operator, treat as truthy/falsy
      index--; // put token back
      return leftValue !== 0;
    }

    const result = parseExpression();

    if (index !== tokens.length) {
      throw new Error(`Unexpected tokens after expression: ${tokens.slice(index).join(' ')}`);
    }

    return result;
  } catch (error) {
    console.warn(`Failed to evaluate expression: ${expression}`, error);
    return false;
  }
}
