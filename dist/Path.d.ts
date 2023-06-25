/**
 * 感谢 Deno 的开源项目 deno std,所有权利归 deno std 所有
 * Thanks to the open source project deno std of Deno, all rights belong to deno std
 * https://github.com/denoland/deno_std
 */
export declare const CHAR_UPPERCASE_A = 65;
export declare const CHAR_LOWERCASE_A = 97;
export declare const CHAR_UPPERCASE_Z = 90;
export declare const CHAR_LOWERCASE_Z = 122;
export declare const CHAR_DOT = 46;
export declare const CHAR_COLON = 58;
export declare const CHAR_FORWARD_SLASH = 47;
export declare const CHAR_BACKWARD_SLASH = 92;
/** Make an assertion, if not `true`, then throw. */
export declare function assert(expr: unknown, msg?: string): asserts expr;
export declare function isPosixPathSeparator(code: number): boolean;
export declare function isPathSeparator(code: number): boolean;
export declare function assertPath(path: string): void;
export declare function isWindowsDeviceRoot(code: number): boolean;
export declare function lastPathSegment(path: string, isSep: (char: number) => boolean, start?: number): string;
export declare function stripTrailingSeparators(segment: string, isSep: (char: number) => boolean): string;
export declare function stripSuffix(name: string, suffix: string): string;
export declare function normalizeString(path: string, allowAboveRoot: boolean, separator: string, isPathSeparator: (code: number) => boolean): string;
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 * @param path to be normalized
 */
export declare function normalize(path: string): string;
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 * @param paths to be joined and normalized
 */
export declare function join(...paths: string[]): string;
/**
* Return the last portion of a `path`.
* Trailing directory separators are ignored, and optional suffix is removed.
*
* @param path - path to extract the name from.
* @param [suffix] - suffix to remove from extracted name.
*/
export declare function basename(path: string, suffix?: string): string;
/**
 * Return the directory path of a `path`.
 * @param path - path to extract the directory from.
 */
export declare function dirname(path: string): string;
/**
* Return the extension of the `path` with leading period.
* @param path with extension
* @returns extension (ex. for `file.ts` returns `.ts`)
*/
export declare function extname(path: string): string;
