import { Stream, Duplex } from 'stream';

/**
 * Convert `Stream` data to `Buffer`.
 *
 * @param stream Data that needs to be transformed.
 * @returns Promise<Buffer>
 *
 * @publicApi
 */
export async function toBuffer(stream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}
/**
 * Convert `Buffer` data to `Stream`.
 *
 * @param buffer Data that needs to be transformed.
 * @param encoding The encoding type.
 * @returns Promise<Duplex>
 *
 * @publicApi
 */
export async function toStream(buffer: Buffer, encoding?: BufferEncoding): Promise<Stream> {
  const stream = new Duplex();
  stream.push(buffer, encoding);
  stream.push(null, encoding);
  return stream;
}
