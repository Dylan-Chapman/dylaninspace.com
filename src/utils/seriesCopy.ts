type SeriesProgressSource = {
  planned: number;
  published: number;
  upcoming?: number;
};

function getUpcoming(progress: SeriesProgressSource) {
  const upcoming = progress.upcoming ?? progress.planned - progress.published;
  return upcoming > 0 ? upcoming : 0;
}

type SeriesPlacementSource = {
  index?: number | null;
  planned?: number | null;
};

export function formatSeriesPlacement(source: SeriesPlacementSource) {
  const index = typeof source.index === "number" ? source.index : 1;
  const planned = typeof source.planned === "number" ? source.planned : 0;
  const safeIndex = index > 0 ? index : 1;
  if (planned > 0) {
    return `Part ${safeIndex} of ${planned}`;
  }
  return `Part ${safeIndex}`;
}

export function formatSeriesProgressInline(progress: SeriesProgressSource) {
  const upcoming = getUpcoming(progress);
  if (upcoming > 0) {
    return ` - ${progress.published} published, ${upcoming} upcoming`;
  }
  return ".";
}

export function formatSeriesProgressSummary(progress: SeriesProgressSource) {
  const upcoming = getUpcoming(progress);
  const planned = Math.max(0, progress.planned);
  const published = Math.max(0, progress.published);

  if (planned <= 0) {
    if (upcoming > 0) {
      return `${published} parts published (${upcoming} upcoming)`;
    }
    return `${published} parts published`;
  }

  const partLabel = planned === 1 ? "part" : "parts";
  if (upcoming > 0) {
    return `${published} of ${planned} ${partLabel} published (${upcoming} upcoming)`;
  }

  return `${published} of ${planned} ${partLabel} published`;
}
