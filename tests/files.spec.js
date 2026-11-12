const { test, expect } = require('@playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');

test.describe('File handling', () => {
  test('uploads a file and shows its name', async ({ page }) => {
    const tmpFile = path.join(os.tmpdir(), 'notes.txt');
    fs.writeFileSync(tmpFile, 'some sample text');

    await page.goto('/files.html');
    await page.locator('#file-input').setInputFiles(tmpFile);

    await expect(page.locator('#file-name')).toHaveText('Uploaded: notes.txt (16 chars)');
    fs.unlinkSync(tmpFile);
  });

  test('uploads an in-memory file', async ({ page }) => {
    await page.goto('/files.html');
    await page.locator('#file-input').setInputFiles({
      name: 'data.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('a,b\n1,2\n'),
    });

    await expect(page.locator('#file-name')).toContainText('Uploaded: data.csv');
  });

  test('downloads a file and checks its content', async ({ page }) => {
    await page.goto('/files.html');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download report.txt' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('report.txt');

    const savedPath = await download.path();
    const content = fs.readFileSync(savedPath, 'utf-8');
    expect(content).toContain('Total: 42');
  });
});
