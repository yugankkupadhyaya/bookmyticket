const normalize = (value) => String(value ?? '')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, ' ');

const levenshteinDistance = (left, right) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex];
      previous[rightIndex] = left[leftIndex - 1] === right[rightIndex - 1]
        ? diagonal
        : Math.min(diagonal + 1, previous[rightIndex] + 1, previous[rightIndex - 1] + 1);
      diagonal = above;
    }
  }

  return previous[right.length];
};

const allowedDistance = (term) => {
  if (term.length <= 3) return 0;
  if (term.length <= 6) return 1;
  return Math.floor(term.length * 0.3);
};

const fuzzyScore = (value, searchTerm) => {
  const normalizedValue = normalize(value);
  const normalizedSearchTerm = normalize(searchTerm);

  if (!normalizedSearchTerm) return 0;
  if (normalizedValue.includes(normalizedSearchTerm)) return 0;

  const valueWords = normalizedValue.split(' ');
  const searchWords = normalizedSearchTerm.split(' ');
  let score = 0;

  for (const searchWord of searchWords) {
    let bestDistance = Infinity;

    for (const valueWord of valueWords) {
      bestDistance = Math.min(bestDistance, levenshteinDistance(searchWord, valueWord));
    }

    if (bestDistance > allowedDistance(searchWord)) return null;
    score += bestDistance;
  }

  return score;
};

export const filterByFuzzyField = (documents, field, searchTerm) => {
  const normalizedSearchTerm = normalize(searchTerm);
  if (!normalizedSearchTerm) return documents;

  return documents
    .map((document, index) => ({
      document,
      index,
      score: fuzzyScore(document[field], normalizedSearchTerm),
    }))
    .filter(({ score }) => score !== null)
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .map(({ document }) => document);
};
