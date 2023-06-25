declare class WebFileInfo {
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
    size: number;
    mtime: Date;
    atime: Date;
    birthtime: Date;
    constructor(isFile?: boolean, isDirectory?: boolean, isSymlink?: boolean, size?: number, mtime?: Date, atime?: Date, birthtime?: Date);
}
declare class WebFile extends WebFileInfo {
    path: string;
    parentPath: string;
    content: string;
    id?: number;
    constructor(path: string, content: string, info: Partial<WebFileInfo>, id?: number);
}
declare class WebFileSystem {
    private db;
    private _ready;
    private _watchMap;
    constructor();
    serializeFileSystem(): Promise<unknown>;
    deserializeFileSystem(files: WebFile[]): Promise<unknown>;
    whenReady(): Promise<WebFileSystem>;
    registerWatcher(path: RegExp, callback: (path: string, content: string) => void): void;
    commitWatch(path: string, content: string): void;
    removeFileSystem(): void;
    /**
     * 读取指定路径的文件内容
     * @param path 文件路径
     * @returns 文件内容
     */
    readFile(path: string): Promise<string | null>;
    /**
     * 写入文件内容到指定路径 不存在则创建，存在则覆盖
     * @param path 文件路径
     * @param content 文件内容
     */
    writeFile(path: string, par: {
        content: string;
    }): Promise<void>;
    appendFile(path: string, content: string): Promise<void>;
    /**
   * 读取指定路径下的所有文件和文件夹
   * @param path 目录路径
   * @returns 文件和文件夹列表
   */
    readdir(path: string): Promise<WebFile[]>;
    exists(path: string): Promise<boolean>;
    stat(path: string): Promise<WebFile | null>;
    /**
     * 删除指定路径的文件
     * @param path 文件路径
     */
    unlink(path: string): Promise<void>;
    rename(path: string, newPath: string): Promise<void>;
    /**
     * 删除指定路径的文件夹及其内容
     * @param path 文件夹路径
     */
    rmdir(path: string): Promise<void>;
    /**
     * 创建新的文件夹
     * @param path 文件夹路径
     */
    mkdir(path: string): Promise<void>;
}
export { WebFile, WebFileInfo, WebFileSystem };
