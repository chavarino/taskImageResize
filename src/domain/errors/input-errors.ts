export class InvalidSourceError extends Error {
  constructor(msg = 'Invalid source') { super(msg); this.name = 'InvalidSourceError'; }
}
export class SourceNotFoundError extends Error {
  constructor(msg = 'Source not found') { super(msg); this.name = 'SourceNotFoundError'; }
}
export class UpstreamUnavailableError extends Error {
  constructor(msg = 'Upstream unavailable') { super(msg); this.name = 'UpstreamUnavailableError'; }
}
export class UnsupportedSourceError extends Error {
  constructor(msg = 'Unsupported source type') { super(msg); this.name = 'UnsupportedSourceError'; }
}
