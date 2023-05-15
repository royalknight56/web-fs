import { assert, describe, it } from 'vitest'
import { WebFile, WebFileSystem } from "./FileSystem"
describe('test',async () => {
    let fs = new WebFileSystem();
    await fs.whenReady();
    console.log(fs);
    it('test', async () => {
        let res = await fs.mkdir("/test");
        assert.equal(res, "/test");
    })
    it('test2', async () => {
        let res = await fs.readdir("/");
        assert.equal(res, [
            
        ]);
    })

})